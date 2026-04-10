import type { DateFilter } from "../../pages/Profile";

type Props = {
  currentRange: DateFilter;
  onChange: (filter: DateFilter) => void;
};

const FILTERS: DateFilter[] = ["today", "week", "month", "year", "custom"];

export default function DateFilterButtons({ currentRange, onChange }: Props) {
  return (
    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium whitespace-nowrap transition-all ${
            currentRange === filter
              ? "bg-blue-500 text-white shadow-md"
              : "border border-blue-500 text-blue-600 hover:bg-blue-50"
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}
