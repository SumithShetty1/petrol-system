type Props = {
  attendants: any[];
  attendantFilter: string;
  fuelTypeFilter: string;
  onAttendantChange: (value: string) => void;
  onFuelChange: (value: string) => void;
  onClearFilters: () => void;
};

export default function FilterPanel({
  attendants,
  attendantFilter,
  fuelTypeFilter,
  onAttendantChange,
  onFuelChange,
  onClearFilters,
}: Props) {
  return (
    <div className="px-6 mt-4">
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 font-medium">Filters</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 block mb-2">Attendant</label>
            <select
              value={attendantFilter}
              onChange={(e) => onAttendantChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Attendants</option>
              {attendants.map((att) => (
                <option key={att.id} value={att.phone}>
                  {att.first_name} {att.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-2">Fuel Type</label>
            <select
              value={fuelTypeFilter}
              onChange={(e) => onFuelChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Types</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
            </select>
          </div>

          <button
            onClick={onClearFilters}
            className="w-full py-2 text-sm text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
