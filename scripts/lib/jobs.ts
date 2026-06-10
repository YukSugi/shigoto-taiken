import fs from "node:fs";
import path from "node:path";
import { config, GENDERS, type Gender } from "./config.ts";
import { jobs, getJobById } from "../../src/data/jobs/index.ts";
import type { JobRpg, FeedbackType } from "../../src/data/jobs/types.ts";

export type ImageKind = "scene" | "feedback";

export type ImageSpec = {
  kind: ImageKind;
  /** 出力ファイル名（拡張子込み） */
  filename: string;
  gender: Gender;
  /** 生成プロンプトに与える情景の説明（日本語） */
  sceneDescription: string;
  /** 既に public/images に存在するか */
  exists: boolean;
};

export function listJobs(): JobRpg[] {
  return jobs;
}

export function resolveJob(jobId: string): JobRpg {
  const job = getJobById(jobId);
  if (!job) {
    const ids = jobs.map((j) => j.id).join(", ");
    throw new Error(`jobId "${jobId}" が見つかりません。候補: ${ids}`);
  }
  return job;
}

function fileExists(filename: string): boolean {
  return fs.existsSync(path.join(config.publicImagesDir, filename));
}

const FEEDBACK_LABEL: Record<FeedbackType, string> = {
  good: "とても良い判断をして手応えを感じている",
  strong_normal: "良い判断ができて前向きな",
  normal: "まずまずの判断をして考え込んでいる",
  risky_bad: "リスクのある判断をして少し不安そうな",
  bad: "良くない判断をして反省している",
};

/**
 * 指定ジョブに必要な全画像の一覧を返す。
 * - シーン画像: 設問ごと × 性別  ({prefix}_scene_{N}_{gender}.png)
 * - 解説画像  : 出現する判定タイプごと × 性別  (feedback_{type}_{gender}.png)
 */
export function buildImageSpecs(job: JobRpg): ImageSpec[] {
  const prefix = job.sceneImagePrefix;
  if (!prefix) {
    throw new Error(
      `job "${job.id}" に sceneImagePrefix が設定されていません。`
    );
  }

  const specs: ImageSpec[] = [];

  // --- 設問シーン ---
  job.questions.forEach((q, idx) => {
    const n = idx + 1;
    for (const gender of GENDERS) {
      const filename = `${prefix}_scene_${n}_${gender}.png`;
      const protagonist =
        gender === "male" ? "20代の男性会社員が主人公" : "20代の女性会社員が主人公";
      specs.push({
        kind: "scene",
        filename,
        gender,
        exists: fileExists(filename),
        sceneDescription: [
          `職種「${job.displayName}」の設問${n}「${q.title}」のワンシーン。`,
          `状況: ${q.situation}`,
          `主人公への問い: ${q.question}`,
          `${protagonist}。日本のオフィス／現場での仕事の一場面を描く。文字やテキストは画像内に入れない。`,
        ].join("\n"),
      });
    }
  });

  // --- 解説（判定タイプ別）---
  const usedTypes = new Set<FeedbackType>();
  for (const q of job.questions) {
    for (const o of q.options) usedTypes.add(o.feedbackType);
  }
  for (const type of usedTypes) {
    for (const gender of GENDERS) {
      const filename = `feedback_${type}_${gender}.png`;
      const protagonist =
        gender === "male" ? "20代の男性会社員" : "20代の女性会社員";
      specs.push({
        kind: "feedback",
        filename,
        gender,
        exists: fileExists(filename),
        sceneDescription: [
          `フィードバック解説用のリアクション画像。`,
          `${protagonist}が「${FEEDBACK_LABEL[type]}」表情・しぐさをしている上半身のワンシーン。`,
          `背景はオフィス。文字やテキストは画像内に入れない。`,
        ].join("\n"),
      });
    }
  }

  return specs;
}

/**
 * 参考にする画像（スタイルアンカー）のパスを返す。
 * 優先順位: reference_images/（参考サンプル） → public/images/（反映済み）。
 * その中で「同prefixのシーン」→「feedback系」→「empsalesのシーン」の順で候補を探す。
 */
export function pickStyleReferences(job: JobRpg, kind: ImageKind): string[] {
  const prefix = job.sceneImagePrefix ?? "";
  // 参考サンプルを最優先。無ければ反映済みフォルダを使う。
  const dirs = [config.referenceDir, config.publicImagesDir];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const all = fs.readdirSync(dir);

    let candidates: string[] = [];
    if (kind === "feedback") {
      candidates = all.filter((f) => /^feedback_.*\.png$/.test(f));
    }
    if (candidates.length === 0) {
      candidates = all.filter((f) => f.startsWith(`${prefix}_scene_`));
    }
    if (candidates.length === 0) {
      candidates = all.filter((f) => f.startsWith("empsales_scene_"));
    }
    if (candidates.length === 0) {
      candidates = all.filter((f) => /\.png$/.test(f));
    }

    if (candidates.length > 0) {
      candidates.sort();
      return candidates.slice(0, 2).map((f) => path.join(dir, f));
    }
  }
  return [];
}
