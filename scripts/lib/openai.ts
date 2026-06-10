import fs from "node:fs";
import path from "node:path";
import OpenAI, { toFile } from "openai";
import { config } from "./config.ts";

let _client: OpenAI | null = null;
function client(): OpenAI {
  if (!_client) _client = new OpenAI({ apiKey: config.openaiApiKey });
  return _client;
}

// 全シーンに共通で効かせるスタイル指示（参考画像のドット感・タッチを言語化）
const STYLE_PROMPT = [
  "16bit〜32bitのレトロゲーム風ドット絵（ピクセルアート）。",
  "やわらかく明るいパステル調の配色、温かみのあるアニメ的タッチ。",
  "参考画像と同じ画風・筆致・解像感・キャラクターの頭身を厳密に踏襲する。",
  "横長4:3構図。画像内に文字・ロゴ・吹き出しは入れない。",
].join("");

/**
 * 1枚生成して PNG Buffer を返す。
 * 参考画像があれば images.edit でスタイルを踏襲、無ければ images.generate。
 */
export async function generateImage(opts: {
  sceneDescription: string;
  referencePaths: string[];
}): Promise<Buffer> {
  const prompt = `${STYLE_PROMPT}\n\n描く情景:\n${opts.sceneDescription}`;
  const c = client();

  let b64: string | undefined;
  if (opts.referencePaths.length > 0) {
    const images = await Promise.all(
      opts.referencePaths.map((p) =>
        toFile(fs.createReadStream(p), path.basename(p), { type: "image/png" })
      )
    );
    const res = await c.images.edit({
      model: config.imageModel,
      image: images,
      prompt,
      size: config.imageSize,
    });
    b64 = res.data?.[0]?.b64_json;
  } else {
    const res = await c.images.generate({
      model: config.imageModel,
      prompt,
      size: config.imageSize,
    });
    b64 = res.data?.[0]?.b64_json;
  }

  if (!b64) throw new Error("画像生成に失敗しました（b64_jsonが空）。");
  return Buffer.from(b64, "base64");
}

/**
 * 生成画像と参考画像の「ドット感・タッチ」の近さを 0-100 で採点。
 */
export async function scoreSimilarity(opts: {
  generated: Buffer;
  referencePath: string;
}): Promise<{ score: number; reason: string }> {
  const c = client();
  const genUrl = `data:image/png;base64,${opts.generated.toString("base64")}`;
  const refUrl = `data:image/png;base64,${fs
    .readFileSync(opts.referencePath)
    .toString("base64")}`;

  const res = await c.chat.completions.create({
    model: config.visionModel,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "あなたはピクセルアートのアートディレクターです。2枚の画像の『ドット感（ピクセルの粒度）・筆致・配色・頭身・全体の画風』がどれだけ一致しているかだけを評価します。被写体や構図の違いは無視します。JSONで {\"score\": 0-100, \"reason\": \"日本語の短い理由\"} を返してください。score=100が完全一致。",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "1枚目=生成画像、2枚目=参考画像（基準）。画風の近さを採点してください。" },
          { type: "image_url", image_url: { url: genUrl } },
          { type: "image_url", image_url: { url: refUrl } },
        ],
      },
    ],
  });

  const raw = res.choices[0]?.message?.content ?? "{}";
  try {
    const parsed = JSON.parse(raw) as { score?: number; reason?: string };
    return {
      score: Math.max(0, Math.min(100, Number(parsed.score ?? 0))),
      reason: parsed.reason ?? "",
    };
  } catch {
    return { score: 0, reason: `採点結果のパースに失敗: ${raw.slice(0, 120)}` };
  }
}
