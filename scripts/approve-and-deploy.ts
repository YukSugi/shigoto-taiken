/**
 * ⑥ 承認後の本番反映 & デプロイ
 *
 * check_images（レビュー待ち）の画像を public/images（反映済み）へ移動し、
 * コミット＆プッシュする。push されると Vercel が自動デプロイする。
 *
 *   npm run images:approve              # 移動→コミット→プッシュ
 *   npm run images:approve -- --no-push # 移動とコミットのみ（pushしない）
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { config, ROOT } from "./lib/config.ts";

function git(args: string[]): string {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function rel(p: string): string {
  return path.relative(ROOT, p).split(path.sep).join("/");
}

function main() {
  const noPush = process.argv.includes("--no-push");

  if (!fs.existsSync(config.checkImagesDir)) {
    console.error(`${rel(config.checkImagesDir)} がありません。先に画像を生成してください。`);
    process.exit(1);
  }

  const pngs = fs
    .readdirSync(config.checkImagesDir)
    .filter((f) => f.toLowerCase().endsWith(".png"));
  if (pngs.length === 0) {
    console.error(`${rel(config.checkImagesDir)} に png がありません。`);
    process.exit(1);
  }

  // 1) check_images -> public/images へ移動（レビュー待ちフォルダは空にする）
  fs.mkdirSync(config.publicImagesDir, { recursive: true });
  for (const f of pngs) {
    fs.renameSync(
      path.join(config.checkImagesDir, f),
      path.join(config.publicImagesDir, f)
    );
    console.log(`  反映: ${f}`);
  }

  // メタ情報（REVIEW.md / manifest.json）は反映時に削除
  let jobIds = "";
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(config.checkImagesDir, "manifest.json"), "utf8")
    );
    jobIds = (manifest.jobIds ?? []).join(", ");
  } catch {
    /* manifest無しでも続行 */
  }
  for (const meta of ["REVIEW.md", "manifest.json"]) {
    const p = path.join(config.checkImagesDir, meta);
    if (fs.existsSync(p)) fs.rmSync(p);
  }

  // 2) git add（公開フォルダの追加 と チェックフォルダの削除 を両方ステージ）
  git(["add", rel(config.publicImagesDir), rel(config.checkImagesDir)]);
  const status = git(["status", "--porcelain"]);
  if (!status) {
    console.log("変更がありません（既に反映済み）。");
    return;
  }

  const msg = `Approve & deploy images${jobIds ? ` for ${jobIds}` : ""} (${pngs.length} files)`;
  git(["commit", "-m", msg]);
  console.log(`\nコミット: ${msg}`);

  // 3) push（Vercelが自動デプロイ）
  if (noPush) {
    console.log("--no-push 指定のため push はスキップしました。");
    return;
  }
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
  git(["push", "origin", branch]);
  console.log(`\n✅ origin/${branch} に push しました。Vercel が自動デプロイします。`);
}

main();
