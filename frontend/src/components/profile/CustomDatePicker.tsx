import { Calendar } from "lucide-react";

type Props = {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function CustomDatePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  onCancel,
}: Props) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-gray-50 rounded-xl p-4 md:p-5 space-y-4 border border-gray-200">
      <div className="flex items-center gap-2 text-gray-700">
        <Calendar className="w-5 h-5 text-blue-500" />
        <span className="font-medium">Select Date Range</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <div className="flex gap-3">
        <button
          onClick={onSubmit}
          disabled={!startDate || !endDate}
          className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Apply
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

type DateInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
};

function DateInput({ label, value, onChange, min, max }: DateInputProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs md:text-sm text-gray-600">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm"
      />
    </div>
  );
}
