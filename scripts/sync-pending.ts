/**
 * レビュー待ち画像の取り込み（このPCへDL）
 *
 * クラウド(GitHub)で生成され check_images/ にコミットされた「レビュー待ち画像」のうち、
 * まだこのPCに無いものを public/check_images/ にダウンロードして目視確認できるようにする。
 * SessionStart フックから自動実行される想定（手動なら npm run images:sync）。
 *
 * - origin の既定ブランチを fetch
 * - origin:check_images/*.png を public/check_images/ に展開（ブランチ/indexは変更しない）
 * - 既に承認済み（origin から消えた）画像はローカルからも掃除
 * - 何かDLしたら（Windowsなら）フォルダを開く
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync, execFile } from "node:child_process";
import { config, ROOT } from "./lib/config.ts";

function git(
  args: string[],
  opts: { buffer?: boolean; timeout?: number } = {}
): Buffer | string {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: opts.buffer ? "buffer" : "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    maxBuffer: 1024 * 1024 * 64,
    timeout: opts.timeout,
  });
}

function defaultBranch(): string {
  try {
    const ref = (git(["symbolic-ref", "refs/remotes/origin/HEAD"]) as string).trim();
    return ref.split("/").pop() || "main";
  } catch {
    return "main";
  }
}

function main() {
  // origin を取得（オフライン等で失敗してもセッションを止めない）
  let branch = "main";
  try {
    git(["fetch", "origin", "--quiet"], { timeout: 20000 });
    branch = defaultBranch();
  } catch (e) {
    console.log("（オフラインのためレビュー待ち画像の確認をスキップしました）");
    return;
  }

  // origin の check_images にある追跡ファイル一覧
  let tracked: string[] = [];
  try {
    const out = git([
      "ls-tree",
      "-r",
      "--name-only",
      `origin/${branch}`,
      "--",
      "check_images",
    ]) as string;
    tracked = out
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.toLowerCase().endsWith(".png"));
  } catch {
    tracked = [];
  }

  fs.mkdirSync(config.localReviewDir, { recursive: true });

  // ローカルにある画像（前回DL分）
  const localBefore = new Set(
    fs
      .readdirSync(config.localReviewDir)
      .filter((f) => f.toLowerCase().endsWith(".png"))
  );

  const remoteNames = new Set(tracked.map((p) => path.basename(p)));

  // 1) origin にある画像を public/check_images へ展開
  let downloaded = 0;
  for (const rel of tracked) {
    const name = path.basename(rel);
    const dest = path.join(config.localReviewDir, name);
    try {
      const buf = git(["show", `origin/${branch}:${rel}`], { buffer: true }) as Buffer;
      const exists = fs.existsSync(dest) && fs.statSync(dest).size === buf.length;
      if (!exists) {
        fs.writeFileSync(dest, buf);
        downloaded++;
      }
    } catch {
      /* 個別失敗はスキップ */
    }
  }

  // REVIEW.md / manifest.json も取り込み（あれば）
  for (const meta of ["check_images/REVIEW.md", "check_images/manifest.json"]) {
    try {
      const buf = git(["show", `origin/${branch}:${meta}`], { buffer: true }) as Buffer;
      fs.writeFileSync(path.join(config.localReviewDir, path.basename(meta)), buf);
    } catch {
      /* 無ければスキップ */
    }
  }

  // 2) 承認済み（origin から消えた）画像をローカルから掃除
  let cleaned = 0;
  for (const name of localBefore) {
    if (!remoteNames.has(name)) {
      try {
        fs.rmSync(path.join(config.localReviewDir, name));
        cleaned++;
      } catch {
        /* ignore */
      }
    }
  }

  const pending = remoteNames.size;
  if (pending === 0) {
    console.log("レビュー待ちの画像はありません。");
    return;
  }

  console.log(
    `🖼️ レビュー待ち画像 ${pending}枚（新規DL ${downloaded}枚${cleaned ? ` / 掃除 ${cleaned}枚` : ""}）。` +
      `\n  確認先: ${config.localReviewDir}` +
      `\n  OKなら Claude に「承認」と伝えてください（本番反映＆デプロイ）。`
  );

  // 新しくDLしたものがあればフォルダを開く（Windows）
  if (downloaded > 0 && process.platform === "win32") {
    execFile("explorer.exe", [config.localReviewDir], () => {});
  }
}

main();
