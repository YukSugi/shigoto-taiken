"use client";

import type { JobRpg } from "@/data/jobs/types";
import JobTile from "./JobTile";

type Props = {
  jobs: JobRpg[];
  onSelectJob: (job: JobRpg) => void;
};

export default function JobTileGrid({ jobs, onSelectJob }: Props) {
  return (
    <section className="bg-amber-50/40 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
          体験する仕事を選ぼう
        </h2>
        <p className="text-gray-500 text-sm text-center mb-8">
          気になる職種を1つ選んでスタート。それぞれの仕事で、実際にありそうな場面を4択で体験できます。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobTile key={job.id} job={job} onClick={onSelectJob} />
          ))}
        </div>
      </div>
    </section>
  );
}
