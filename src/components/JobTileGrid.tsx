"use client";

import type { JobRpg } from "@/data/jobs/types";
import JobTile from "./JobTile";

type Props = {
  jobs: JobRpg[];
  onSelectJob: (job: JobRpg) => void;
};

export default function JobTileGrid({ jobs, onSelectJob }: Props) {
  return (
    <section className="py-14 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-extrabold tracking-wider text-teal-600 mb-2">
            SELECT YOUR JOB
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            体験する仕事を選ぼう
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
            気になる職種を1つ選んでスタート。それぞれの仕事で、実際にありそうな場面を4択で体験できます。
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobTile key={job.id} job={job} onClick={onSelectJob} />
          ))}
        </div>
      </div>
    </section>
  );
}
