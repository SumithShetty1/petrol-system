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

  // Sync when parent values change
  useEffect(() => {
    setSelectedPrimary(primaryValue);
  }, [primaryValue]);

  useEffect(() => {
    setSelectedFuel(fuelTypeFilter);
  }, [fuelTypeFilter]);

  const handleApply = () => {
    onApply(
      selectedPrimary,
      selectedFuel
    );
  };

  const handleClear = () => {
    setSelectedPrimary("all");
    setSelectedFuel("all");
    onClearFilters();
  };

  return (
    <div className="px-6 mt-4">
      <div className="bg-white rounded-2xl p-4 shadow-md">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-gray-900 font-medium">
            Filters
          </h3>
        </div>

        <div className="space-y-4">
          {/* Primary Filter */}
          <div>
            <label className="text-sm text-gray-600 block mb-2">
              {primaryLabel}
            </label>

            <select
              value={selectedPrimary}
              onChange={(e) =>
                setSelectedPrimary(
                  e.target.value
                )
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">
                All {primaryLabel}s
              </option>

              {primaryOptions.map(
                (item) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Fuel Filter */}
          <div>
            <label className="text-sm text-gray-600 block mb-2">
              Fuel Type
            </label>

            <select
              value={selectedFuel}
              onChange={(e) =>
                setSelectedFuel(
                  e.target.value
                )
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={
                handleClear
              }
              className="w-full py-2 text-sm text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Clear
            </button>

            <button
              onClick={
                handleApply
              }
              className="w-full py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
