"use client";

import type { JobRpg } from "@/data/jobs/types";
import type { JobGroup } from "@/data/jobs";
import JobTile from "./JobTile";

type Props = {
  groups: JobGroup[];
  onSelectJob: (job: JobRpg) => void;
};

export default function JobTileGrid({ groups, onSelectJob }: Props) {
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

        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.label}>
              {/* カテゴリ見出し */}
              <div className="flex items-center gap-3 mb-4">
                <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-teal-400 to-teal-600" />
                <h3 className="text-base font-extrabold text-gray-800">
                  {group.label}
                </h3>
                <span className="flex-1 border-t border-dashed border-gray-200" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {group.jobs.map((job) => (
                  <JobTile key={job.id} job={job} onClick={onSelectJob} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
