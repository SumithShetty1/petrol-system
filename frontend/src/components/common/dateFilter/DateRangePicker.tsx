import { Calendar } from "lucide-react";

type Props = {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  className?: string;
};

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  onCancel,
  className = "",
}: Props) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={`px-4 sm:px-6 ${className}`}>
      <div
        className="
          bg-gray-50
          rounded-2xl
          p-4 sm:p-5 md:p-6
          space-y-4 sm:space-y-5
          border border-gray-200
          shadow-sm
        "
      >
        {/* Header */}
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500" />
          <span className="text-sm sm:text-base font-semibold">
            Select Date Range
          </span>
        </div>

        {/* Inputs */}
        <div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            gap-3 sm:gap-4
          "
        >
          <DateInput
            label="Start Date"
            value={startDate}
            onChange={onStartDateChange}
            max={endDate || today}
          />

          <DateInput
            label="End Date"
            value={endDate}
            onChange={onEndDateChange}
            min={startDate}
            max={today}
          />
        </div>

        {/* Buttons */}
        <div
          className="
            flex flex-col sm:flex-row
            gap-2 sm:gap-3
          "
        >
          <button
            onClick={onSubmit}
            disabled={!startDate || !endDate}
            className="
              w-full sm:flex-1

              py-2.5 sm:py-3
              text-sm sm:text-base
              font-medium

              bg-blue-500 text-white
              rounded-lg

              hover:bg-blue-600
              active:scale-95

              transition-all duration-200

              disabled:bg-gray-300
              disabled:cursor-not-allowed
            "
          >
            Apply
          </button>

          <button
            onClick={onCancel}
            className="
              w-full sm:flex-1

              py-2.5 sm:py-3
              text-sm sm:text-base
              font-medium

              border border-gray-300
              text-gray-600
              rounded-lg

              hover:bg-gray-100
              active:scale-95

              transition-all duration-200
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
};

function DateInput({
  label,
  value,
  onChange,
  min,
  max,
}: InputProps) {
  return (
    <div className="space-y-1.5">
      <label
        className="
          text-xs sm:text-sm
          text-gray-600
          font-medium
        "
      >
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="
          w-full

          px-3 sm:px-4
          py-2.5 sm:py-3

          text-xs sm:text-sm

          border border-gray-300
          rounded-lg

          bg-white

          focus:outline-none
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-100

          transition-all duration-200
        "
      />
    </div>
  );
}
