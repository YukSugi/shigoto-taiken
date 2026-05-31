"use client";

type Range = "7d" | "30d" | "all";

type Props = {
  range: Range;
  onRangeChange: (range: Range) => void;
  jobId: string;
  onJobIdChange: (jobId: string) => void;
  version: string;
  onVersionChange: (version: string) => void;
};

const ranges: { value: Range; label: string }[] = [
  { value: "7d", label: "7日間" },
  { value: "30d", label: "30日間" },
  { value: "all", label: "全期間" },
];

const jobOptions = [
  { value: "", label: "全職種" },
  { value: "b2b-sales-existing", label: "法人営業" },
];

const versionOptions = [
  { value: "", label: "全version" },
  { value: "1.0.0", label: "1.0.0" },
];

export default function AdminFilters({
  range,
  onRangeChange,
  jobId,
  onJobIdChange,
  version,
  onVersionChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {ranges.map((r) => (
          <button
            key={r.value}
            onClick={() => onRangeChange(r.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              range === r.value
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <select
        value={jobId}
        onChange={(e) => onJobIdChange(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        {jobOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={version}
        onChange={(e) => onVersionChange(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        {versionOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
