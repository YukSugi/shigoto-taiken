/**
 * お仕事体験ドットコム 画像生成パイプライン
 *
 *   ② 設問と回答を確認 → ③ 各設問のシーン/解説画像を生成
 *   → ④ 参考画像とのドット感・タッチ類似度を判定し外れは再生成
 *   → ⑤ check_images へ保存して通知
 *
 * 使い方:
 *   npm run images:generate -- <jobId>          # 不足している画像だけ生成
 *   npm run images:generate -- <jobId> --force  # 既存も含め全再生成
 *   npm run images:generate -- --all            # 全ジョブの不足分を生成
 *   npm run images:generate -- --list           # jobId一覧を表示
 */
import fs from "node:fs";
import path from "node:path";
import { config } from "./lib/config.ts";
import {
  listJobs,
  resolveJob,
  buildImageSpecs,
  pickStyleReferences,
  type ImageSpec,
} from "./lib/jobs.ts";
import { generateImage, scoreSimilarity } from "./lib/openai.ts";
import { notify } from "./lib/notify.ts";
import type { JobRpg } from "../src/data/jobs/types.ts";

type Args = { jobIds: string[]; force: boolean; only?: string[] };

function parseArgs(argv: string[]): Args | "list" | null {
  const a = argv.slice(2);
  if (a.includes("--list")) return "list";
  const force = a.includes("--force");

  // --only <csv> または --only=<csv>: ファイル名にこの文字列を含む画像だけを生成（既存でも強制再生成）
  let only: string[] | undefined;
  const onlyIdx = a.findIndex((x) => x === "--only" || x.startsWith("--only="));
  const consumed = new Set<number>();
  if (onlyIdx >= 0) {
    const tok = a[onlyIdx];
    let val = tok.includes("=") ? tok.split("=").slice(1).join("=") : a[onlyIdx + 1];
    if (!tok.includes("=")) consumed.add(onlyIdx + 1);
    consumed.add(onlyIdx);
    only = (val ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    if (only.length === 0) only = undefined;
  }

  const positional = a.filter((x, i) => !x.startsWith("--") && !consumed.has(i));
  if (a.includes("--all")) {
    return { jobIds: listJobs().map((j) => j.id), force, only };
  }
  if (positional.length === 0) return null;
  return { jobIds: positional, force, only };
}

function printQuestions(job: JobRpg) {
  console.log(`\n========== ② 設問と回答の確認: ${job.displayName} (${job.id}) ==========`);
  job.questions.forEach((q, i) => {
    console.log(`\n[Q${i + 1}] ${q.title}`);
    console.log(`  状況: ${q.situation}`);
    console.log(`  問い: ${q.question}`);
    for (const o of q.options) {
      console.log(`   - (${o.id}) [${o.feedbackType}] ${o.text}`);
    }
  });
  console.log("\n=================================================\n");
}

type Result = {
  filename: string;
  kind: string;
  score: number;
  reason: string;
  attempts: number;
  passed: boolean;
};

async function generateOne(
  job: JobRpg,
  spec: ImageSpec
): Promise<Result> {
  const refs = pickStyleReferences(job, spec.kind);
  const basis = refs[0];
  let best: { buf: Buffer; score: number; reason: string } | null = null;

  const maxTries = config.maxRegenAttempts + 1; // 初回 + 再生成
  for (let attempt = 1; attempt <= maxTries; attempt++) {
    process.stdout.write(`  ③ 生成中 ${spec.filename} (試行${attempt}/${maxTries}) ... `);
    const buf = await generateImage({
      sceneDescription: spec.sceneDescription,
      referencePaths: refs,
    });

    // ④ 類似度チェック（参考画像が無ければ判定スキップ＝合格扱い）
    let score = 100;
    let reason = "参考画像なしのため類似度判定スキップ";
    if (basis) {
      const r = await scoreSimilarity({ generated: buf, referencePath: basis });
      score = r.score;
      reason = r.reason;
    }
    console.log(`類似度 ${score} (${reason})`);

    if (!best || score > best.score) best = { buf, score, reason };
    if (score >= config.similarityThreshold) break;
    if (attempt < maxTries) {
      console.log(`     ↳ しきい値${config.similarityThreshold}未満。再生成します。`);
    }
  }

  if (!best) throw new Error("生成結果がありません");
  const out = path.join(config.checkImagesDir, spec.filename);
  fs.writeFileSync(out, best.buf);

  return {
    filename: spec.filename,
    kind: spec.kind,
    score: best.score,
    reason: best.reason,
    attempts: maxTries,
    passed: best.score >= config.similarityThreshold,
  };
}

function writeReview(results: Result[], jobIds: string[]) {
  const lines: string[] = [];
  lines.push(`# 生成画像レビュー (${new Date().toLocaleString("ja-JP")})`);
  lines.push("");
  lines.push(`対象: ${jobIds.join(", ")}`);
  lines.push(`しきい値: ${config.similarityThreshold} / 画像モデル: ${config.imageModel}`);
  lines.push("");
  lines.push("確認後 OK なら以下で本番反映＆デプロイ:");
  lines.push("```");
  lines.push("npm run images:approve");
  lines.push("```");
  lines.push("");
  for (const r of results) {
    const mark = r.passed ? "✅" : "⚠️ 要確認";
    lines.push(`- ${mark} ${r.filename}  類似度 ${r.score}  — ${r.reason}`);
  }
  lines.push("");
  fs.writeFileSync(path.join(config.checkImagesDir, "REVIEW.md"), lines.join("\n"));

  // approve スクリプト用のマニフェスト
  fs.writeFileSync(
    path.join(config.checkImagesDir, "manifest.json"),
    JSON.stringify({ jobIds, generatedAt: new Date().toISOString(), results }, null, 2)
  );
}

async function main() {
  const parsed = parseArgs(process.argv);
  if (parsed === "list") {
    console.log("利用可能な jobId:");
    for (const j of listJobs()) console.log(`  - ${j.id}  (${j.displayName})`);
    return;
  }
  if (!parsed) {
    console.error("jobId を指定してください。例: npm run images:generate -- b2b-sales-existing");
    console.error("一覧: npm run images:generate -- --list");
    process.exit(1);
  }

  fs.mkdirSync(config.checkImagesDir, { recursive: true });

  const allResults: Result[] = [];
  for (const jobId of parsed.jobIds) {
    const job = resolveJob(jobId);

    if (!job.sceneImagePrefix) {
      console.warn(
        `⚠️ ${job.id}: sceneImagePrefix が未設定のためスキップします。` +
          ` src/data/jobs/${job.id}.ts に sceneImagePrefix を追加してください（例: sceneImagePrefix: "${job.id.replace(/-/g, "")}").`
      );
      continue;
    }

    printQuestions(job); // ②

    // public/images に未反映 かつ check_images に未生成 のものだけ生成（中断後の再開対応）。
    const all = buildImageSpecs(job);
    const specs = parsed.only
      ? // --only 指定時はファイル名一致のものを既存有無に関わらず強制生成
        all.filter((s) => parsed.only!.some((o) => s.filename.includes(o)))
      : all.filter((s) => {
          if (parsed.force) return true;
          if (s.exists) return false; // 既に本番反映済み
          const staged = fs.existsSync(path.join(config.checkImagesDir, s.filename));
          return !staged; // check_images に既にあればスキップ（再開）
        });
    const resumed = parsed.only
      ? 0
      : all.length - specs.length - all.filter((s) => s.exists).length;
    if (specs.length === 0) {
      console.log(`${job.id}: 生成が必要な画像はありません（--force で全再生成）。`);
      continue;
    }
    console.log(
      `${job.id}: ${specs.length} 枚を生成します。` +
        (resumed > 0 ? `（check_images に生成済みの ${resumed} 枚はスキップ）` : "")
    );
    for (const spec of specs) {
      const r = await generateOne(job, spec); // ③④⑤
      allResults.push(r);
    }
  }

  if (allResults.length === 0) {
    console.log("生成対象がありませんでした。");
    return;
  }

  writeReview(allResults, parsed.jobIds);

  const ng = allResults.filter((r) => !r.passed).length;
  const msg =
    `${allResults.length}枚を public/check_images に出力しました。` +
    (ng > 0 ? ` うち${ng}枚はしきい値未満（要確認）。` : " 全て類似度OK。") +
    " 内容を確認し、OKなら npm run images:approve でデプロイしてください。";
  notify("画像生成が完了しました", msg);
}

main().catch((e) => {
  console.error("\n❌ エラー:", e instanceof Error ? e.message : e);
  process.exit(1);
});
