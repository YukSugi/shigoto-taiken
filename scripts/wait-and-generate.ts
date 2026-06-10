/**
 * OpenAIの課金枠(quota)が有効になるのを待ってから、画像生成フローを開始する。
 *
 *   npx tsx scripts/wait-and-generate.ts marketer
 *   npx tsx scripts/wait-and-generate.ts marketer --force
 *
 * 課金設定が未完了(429 insufficient_quota)の間は一定間隔で再確認し、
 * 利用可能になった瞬間に generate-images.ts を実行する。
 */
import { spawnSync } from "node:child_process";
import { config, ROOT } from "./lib/config.ts";
import OpenAI from "openai";

const POLL_INTERVAL_MS = 60_000; // 1分ごとに再確認
const MAX_WAIT_MS = 3 * 60 * 60 * 1000; // 最大3時間待つ

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 課金枠が使えるか軽い推論で確認。true=OK, false=quota待ち, throw=その他の致命的エラー */
async function quotaReady(c: OpenAI): Promise<boolean> {
  try {
    await c.chat.completions.create({
      model: config.visionModel,
      max_completion_tokens: 16,
      messages: [{ role: "user", content: "ok" }],
    });
    return true;
  } catch (e: any) {
    const status = e?.status;
    const msg = String(e?.message ?? "");
    if (status === 429 || /quota|billing/i.test(msg)) return false;
    // 認証エラーなど復旧の見込みがないものは即時終了
    throw new Error(`想定外のAPIエラー (${status}): ${msg}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const jobArgs = args.filter((a) => !a.startsWith("--") || a === "--force" || a === "--all");
  if (jobArgs.filter((a) => !a.startsWith("--")).length === 0 && !args.includes("--all")) {
    console.error("jobId を指定してください。例: npx tsx scripts/wait-and-generate.ts marketer");
    process.exit(1);
  }

  const c = new OpenAI({ apiKey: config.openaiApiKey });
  const started = Date.now();
  let waited = false;

  while (true) {
    const ready = await quotaReady(c);
    if (ready) break;

    if (!waited) {
      console.log(
        "⏳ OpenAIの課金枠がまだ有効ではありません(429)。" +
          "https://platform.openai.com/account/billing で支払い設定を完了してください。"
      );
      console.log(`   有効になり次第、自動で生成を開始します（最大3時間、1分ごとに再確認）。`);
      waited = true;
    } else {
      process.stdout.write(".");
    }

    if (Date.now() - started > MAX_WAIT_MS) {
      console.error("\n⌛ 3時間待ちましたが課金枠が有効になりませんでした。中断します。");
      process.exit(1);
    }
    await sleep(POLL_INTERVAL_MS);
  }

  console.log("\n✅ 課金枠が有効になりました。画像生成を開始します。\n");

  // generate-images.ts を実行（②③④⑤）。完了時にWindows通知＆check_images出力。
  const res = spawnSync(
    "npx",
    ["tsx", "scripts/generate-images.ts", ...jobArgs],
    { cwd: ROOT, stdio: "inherit", shell: true }
  );
  process.exit(res.status ?? 0);
}

main().catch((e) => {
  console.error("\n❌ エラー:", e instanceof Error ? e.message : e);
  process.exit(1);
});
