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
    <div className={`relative ${className}`}>
      
      {/* Left Fade */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-gray-50 to-transparent z-10" />

      {/* Right Fade */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-gray-50 to-transparent z-10" />

      {/* Wrapper (important for centering) */}
      <div className="flex justify-center">
        <div
          className="
            flex gap-2 sm:gap-3

            overflow-x-auto
            px-2 pb-2

            scrollbar-hide

            max-w-full
          "
        >
          {FILTERS.map((filter) => {
            const active = value === filter;

            return (
              <button
                key={filter}
                onClick={() => onChange(filter)}
                className={`
                  flex-shrink-0

                  px-3 sm:px-4 md:px-5
                  py-1.5 sm:py-2 md:py-2.5

                  rounded-full

                  text-xs sm:text-sm md:text-base
                  font-medium

                  whitespace-nowrap

                  transition-all duration-200

                  ${
                    active
                      ? "bg-blue-500 text-white shadow-md"
                      : "border border-blue-500 text-blue-600 hover:bg-blue-50"
                  }

                  active:scale-95
                `}
              >
                {capitalize(filter)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
