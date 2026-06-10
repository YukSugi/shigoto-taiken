import path from "node:path";
import { fileURLToPath } from "node:url";

// scripts/lib/ から見たプロジェクトルート
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..", "..");

// .env / .env.local を読み込む（後勝ちにならないよう .env を基本に）
function loadEnvFiles() {
  for (const file of [".env", ".env.local"]) {
    try {
      // Node 21.7+ / 24 で利用可能
      process.loadEnvFile(path.join(ROOT, file));
    } catch {
      // ファイルが無ければ無視
    }
  }
}
loadEnvFiles();

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new Error(
      `環境変数 ${name} が未設定です。プロジェクト直下の .env に設定してください。`
    );
  }
  return v.trim();
}

export const config = {
  get openaiApiKey() {
    return required("OPENAI_API_KEY");
  },
  imageModel: process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2",
  visionModel: process.env.OPENAI_VISION_MODEL?.trim() || "gpt-5.5",
  imageSize: (process.env.IMAGE_SIZE?.trim() || "1536x1024") as
    | "1024x1024"
    | "1536x1024"
    | "1024x1536"
    | "auto",
  similarityThreshold: Number(process.env.SIMILARITY_THRESHOLD ?? 75),
  maxRegenAttempts: Number(process.env.MAX_REGEN_ATTEMPTS ?? 2),

  // 3つのフォルダ（環境変数で上書き可。CI/ローカル共通）
  // 1) 参考サンプル: 画風の基準にする画像
  referenceDir: path.resolve(ROOT, process.env.REFERENCE_DIR ?? "reference_images"),
  // 2) チェック用: 生成済み・レビュー待ち（リポジトリで追跡）
  checkImagesDir: path.resolve(ROOT, process.env.CHECK_IMAGES_DIR ?? "check_images"),
  // 3) 反映済み: 本番にデプロイされる公開フォルダ
  publicImagesDir: path.resolve(ROOT, process.env.OUTPUT_IMAGES_DIR ?? "public/images"),

  // ローカル閲覧用ミラー（gitignore・サイトには配信しない）。
  // PCを開いたとき check_images の中身をここにDLして目視確認する。
  localReviewDir: path.resolve(ROOT, "public/check_images"),
};

export const GENDERS = ["male", "female"] as const;
export type Gender = (typeof GENDERS)[number];
