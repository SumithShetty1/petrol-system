type DateFilter =
  | "today"
  | "week"
  | "month"
  | "year"
  | "custom";

type Props = {
  value: DateFilter;
  onChange: (filter: DateFilter) => void;
  className?: string;
};

const FILTERS: DateFilter[] = [
  "today",
  "week",
  "month",
  "year",
  "custom",
];

export default function DateFilterTabs({
  value,
  onChange,
  className = "",
}: Props) {
  return (
    <div className={className}>
      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
        {FILTERS.map((filter) => {
          const active = value === filter;

          return (
            <button
              key={filter}
              onClick={() => onChange(filter)}
              className={`px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium whitespace-nowrap transition-all ${
                active
                  ? "bg-blue-500 text-white shadow-md"
                  : "border border-blue-500 text-blue-600 hover:bg-blue-50"
              }`}
            >
              {capitalize(filter)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
