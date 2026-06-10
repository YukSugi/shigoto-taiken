/**
 * 利用可能なOpenAIモデルを確認する診断スクリプト。
 *   npx tsx scripts/check-models.ts
 *   npx tsx scripts/check-models.ts gpt-5.5   # 指定IDが使えるか個別確認
 */
import { config } from "./lib/config.ts";
import OpenAI from "openai";

async function main() {
  const c = new OpenAI({ apiKey: config.openaiApiKey });
  const target = process.argv[2];

  if (target) {
    try {
      const m = await c.models.retrieve(target);
      console.log(`✅ "${target}" は利用可能です (owned_by: ${m.owned_by})`);
    } catch (e: any) {
      console.log(`❌ "${target}" は利用不可: ${e?.status} ${e?.message}`);
    }
  }

  const list = await c.models.list();
  const ids = list.data.map((x) => x.id).sort();
  const rel = ids.filter((id) => /gpt-5|image|o3|o4|gpt-4\.1/.test(id));
  console.log(`\n--- 関連モデル (${rel.length}/${ids.length}) ---`);
  console.log(rel.join("\n"));
}

main().catch((e: any) => {
  console.error("API呼び出しに失敗:", e?.status, e?.message);
  process.exit(1);
});
