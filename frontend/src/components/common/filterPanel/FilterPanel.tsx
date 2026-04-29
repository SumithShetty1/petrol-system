import { useEffect, useState } from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  primaryLabel: string;
  primaryValue: string;
  primaryOptions: Option[];

  fuelTypeFilter: string;

  onApply: (
    primaryValue: string,
    fuelValue: string
  ) => void;

  onClearFilters: () => void;
};

export default function FilterPanel({
  primaryLabel,
  primaryValue,
  primaryOptions,
  fuelTypeFilter,
  onApply,
  onClearFilters,
}: Props) {
  const [selectedPrimary, setSelectedPrimary] =
    useState(primaryValue);

  const [selectedFuel, setSelectedFuel] =
    useState(fuelTypeFilter);

  // -----------------------------------
  // SYNC STATE
  // -----------------------------------
  useEffect(() => {
    setSelectedPrimary(primaryValue);
  }, [primaryValue]);

  useEffect(() => {
    setSelectedFuel(fuelTypeFilter);
  }, [fuelTypeFilter]);

  const handleApply = () => {
    onApply(selectedPrimary, selectedFuel);
  };

  const handleClear = () => {
    setSelectedPrimary("all");
    setSelectedFuel("all");
    onClearFilters();
  };

  return (
    <div className="px-4 sm:px-6 mt-4 flex justify-center">
      <div
        className="
          w-full
          max-w-full
          sm:max-w-lg
          md:max-w-xl
          lg:max-w-2xl
        "
      >
        <div
          className="
            bg-white
            rounded-2xl
            sm:rounded-3xl
            p-4 sm:p-5 md:p-6
            shadow-md
            border border-gray-100
          "
        >
          {/* Header */}
          <div className="mb-3 sm:mb-4">
            <h3 className="text-gray-900 text-sm sm:text-base md:text-lg font-semibold">
              Filters
            </h3>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* Primary Filter */}
            <div>
              <label className="text-xs sm:text-sm text-gray-600 block mb-1.5 sm:mb-2 font-medium">
                {primaryLabel}
              </label>

              <select
                value={selectedPrimary}
                onChange={(e) =>
                  setSelectedPrimary(e.target.value)
                }
                className="
                  w-full

                  px-3 sm:px-4
                  py-2.5 sm:py-3

                  text-xs sm:text-sm md:text-base

                  border border-gray-200
                  rounded-lg sm:rounded-xl

                  bg-white

                  outline-none
                  focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500

                  transition-all duration-200
                "
              >
                <option value="all">
                  All {primaryLabel}s
                </option>

                {primaryOptions.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel Filter */}
            <div>
              <label className="text-xs sm:text-sm text-gray-600 block mb-1.5 sm:mb-2 font-medium">
                Fuel Type
              </label>

              <select
                value={selectedFuel}
                onChange={(e) =>
                  setSelectedFuel(e.target.value)
                }
                className="
                  w-full

                  px-3 sm:px-4
                  py-2.5 sm:py-3

                  text-xs sm:text-sm md:text-base

                  border border-gray-200
                  rounded-lg sm:rounded-xl

                  bg-white

                  outline-none
                  focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500

                  transition-all duration-200
                "
              >
                <option value="all">
                  All Types
                </option>
                <option value="petrol">
                  Petrol
                </option>
                <option value="diesel">
                  Diesel
                </option>
              </select>
            </div>

            {/* Actions */}
            <div
              className="
                flex flex-col sm:flex-row
                gap-2 sm:gap-3
                pt-2
              "
            >
              <button
                onClick={handleClear}
                className="
                  w-full sm:flex-1

                  py-2.5 sm:py-3
                  text-xs sm:text-sm md:text-base
                  font-medium

                  text-blue-600
                  border border-blue-500
                  rounded-lg sm:rounded-xl

                  hover:bg-blue-50
                  active:scale-95

                  transition-all duration-200
                "
              >
                Clear
              </button>

              <button
                onClick={handleApply}
                className="
                  w-full sm:flex-1

                  py-2.5 sm:py-3
                  text-xs sm:text-sm md:text-base
                  font-medium

                  text-white
                  bg-blue-600
                  rounded-lg sm:rounded-xl

                  hover:bg-blue-700
                  active:scale-95

                  transition-all duration-200
                "
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
