import type { JobRpg } from "./types";
import { b2bSalesExisting } from "./b2b-sales-existing";
import { productMarketing } from "./product-marketing";
import { productManager } from "./product-manager";
import { engineer } from "./engineer";
import { corporatePlanning } from "./corporate-planning";
import { customerSuccess } from "./customer-success";

export const jobs: JobRpg[] = [
  b2bSalesExisting,
  productMarketing,
  productManager,
  engineer,
  corporatePlanning,
  customerSuccess,
];

export const getJobById = (jobId: string): JobRpg | undefined => {
  return jobs.find((job) => job.id === jobId);
};

export const getVisibleJobs = (): JobRpg[] => {
  return jobs.filter((job) => job.status !== "hidden");
};

export const getPublishedJobs = (): JobRpg[] => {
  return jobs.filter((job) => job.status === "published");
};
