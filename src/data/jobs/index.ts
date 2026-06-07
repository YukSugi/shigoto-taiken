import type { JobRpg } from "./types";
import { b2bSalesExisting } from "./b2b-sales-existing";
import { marketer } from "./marketer";
import { productManager } from "./product-manager";
import { corporatePlanning } from "./corporate-planning";
import { jinji } from "./jinji";
import { keiri } from "./keiri";
import { se } from "./se";
import { sekouKanri } from "./sekou-kanri";
import { seisanKanri } from "./seisan-kanri";

export const jobs: JobRpg[] = [
  b2bSalesExisting,
  marketer,
  productManager,
  corporatePlanning,
  jinji,
  keiri,
  se,
  sekouKanri,
  seisanKanri,
];

// 転職・就活サイトのような職種カテゴリ別の表示グループ（表示順）
const jobGroupDefs: { label: string; jobIds: string[] }[] = [
  { label: "営業", jobIds: ["b2b-sales-existing"] },
  {
    label: "企画・マーケティング",
    jobIds: ["marketer", "product-manager", "corporate-planning"],
  },
  { label: "管理・コーポレート", jobIds: ["jinji", "keiri"] },
  { label: "IT・エンジニア", jobIds: ["se"] },
  { label: "建築・土木", jobIds: ["sekou-kanri"] },
  { label: "製造・生産", jobIds: ["seisan-kanri"] },
];

export type JobGroup = { label: string; jobs: JobRpg[] };

export const getJobById = (jobId: string): JobRpg | undefined => {
  return jobs.find((job) => job.id === jobId);
};

export const getVisibleJobs = (): JobRpg[] => {
  return jobs.filter((job) => job.status !== "hidden");
};

export const getPublishedJobs = (): JobRpg[] => {
  return jobs.filter((job) => job.status === "published");
};

// カテゴリごとにまとめた表示用グループ（非表示・空グループは除外）
export const getVisibleJobGroups = (): JobGroup[] => {
  return jobGroupDefs
    .map((g) => ({
      label: g.label,
      jobs: g.jobIds
        .map((id) => jobs.find((job) => job.id === id))
        .filter((job): job is JobRpg => !!job && job.status !== "hidden"),
    }))
    .filter((g) => g.jobs.length > 0);
};
