import { Search, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  resultCount,
}: Props) {
  return (
    <div className="px-4 sm:px-6 mt-4 flex justify-center">
      <div
        className="
          relative w-full
          max-w-full
          sm:max-w-lg
          md:max-w-xl
          lg:max-w-2xl
          xl:max-w-3xl
          2xl:max-w-4xl
          group
        "
      >
        {/* Search Icon */}
        <div
          className="
            absolute left-3 sm:left-4
            top-1/2 -translate-y-1/2
            text-gray-400
            group-focus-within:text-blue-500
            transition-colors
          "
        >
          <Search className="w-4 sm:w-5 h-4 sm:h-5" />
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full

            pl-9 sm:pl-12
            pr-10 sm:pr-24 md:pr-28

            py-2 sm:py-2.5 md:py-3

            rounded-xl sm:rounded-2xl
            border-2 border-gray-100
            bg-white

            text-xs sm:text-sm md:text-base
            text-gray-700 font-medium

            shadow-sm
            transition-all duration-200

            placeholder:text-gray-400
            placeholder:font-normal

            hover:border-gray-200 hover:shadow-md

            focus:outline-none
            focus:border-blue-400
            focus:ring-4 focus:ring-blue-50
            focus:shadow-lg
          "
        />

        {/* Right Section */}
        {value && (
          <div
            className="
              absolute right-2 sm:right-3 md:right-4
              top-1/2 -translate-y-1/2
              flex items-center gap-1.5 sm:gap-2
            "
          >
            {/* Result Count */}
            {typeof resultCount === "number" && (
              <span
                className="
                  hidden sm:inline-flex
                  text-xs font-medium
                  text-gray-400
                  bg-gray-50
                  px-2 py-1
                  rounded-full
                "
              >
                {resultCount}
              </span>
            )}

            {/* Clear Button */}
            <button
              onClick={() => onChange("")}
              className="
                w-6 sm:w-7 md:w-8
                h-6 sm:h-7 md:h-8

                flex items-center justify-center

                rounded-full
                bg-gray-100 hover:bg-gray-200

                text-gray-400 hover:text-gray-600

                transition-all duration-200
                hover:scale-110

                focus:outline-none
                focus:ring-2 focus:ring-gray-300
              "
              aria-label="Clear search"
            >
              <X className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
