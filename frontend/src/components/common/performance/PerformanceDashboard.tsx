import { BarChart3 } from "lucide-react";
import DateFilterTabs from "../dateFilter/DateFilterTabs";
import DateRangePicker from "../dateFilter/DateRangePicker";
import PetrolCard from "./PetrolCard";
import DieselCard from "./DieselCard";
import TotalSalesCard from "./TotalSalesCard";
import TransactionCountCard from "./TransactionCountCard";
import type { DateFilter } from "../../../pages/attendant/Profile";


type Props = {
  stats: any;
  error?: string | null;
  range: DateFilter;
  showCustomDatePicker: boolean;
  startDate: string;
  endDate: string;
  onChangeFilter: (filter: DateFilter) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onCustomDateSubmit: () => void;
  onCancelCustomDate: () => void;
};

export default function PerformanceDashboard({
  stats,
  error,
  range,
  showCustomDatePicker,
  startDate,
  endDate,
  onChangeFilter,
  onStartDateChange,
  onEndDateChange,
  onCustomDateSubmit,
  onCancelCustomDate,
}: Props) {

  // -----------------------------------
  // DATA SAFE ACCESS
  // -----------------------------------
  const petrolData = stats?.fuel_breakdown?.petrol || { litres: 0, amount: 0 };
  const dieselData = stats?.fuel_breakdown?.diesel || { litres: 0, amount: 0 };
  const totalSales = (petrolData.amount || 0) + (dieselData.amount || 0);

  return (
    <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 space-y-6 md:space-y-8">

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Section Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
        </div>
        <h2 className="text-gray-900 text-lg md:text-xl font-semibold">
          Performance Dashboard
        </h2>
      </div>

      {/* Date Filters */}
      <DateFilterTabs
        value={range}
        onChange={onChangeFilter}
      />

      {/* Custom Date Picker */}
      {showCustomDatePicker && (
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onSubmit={onCustomDateSubmit}
          onCancel={onCancelCustomDate}
        />
      )}

      {/* Selected Range Info */}
      {range === "custom" && !showCustomDatePicker && startDate && endDate && (
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-700">
            Showing data from <span className="font-medium">{startDate}</span> to{" "}
            <span className="font-medium">{endDate}</span>
          </p>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
        <PetrolCard litres={petrolData.litres} amount={petrolData.amount} />
        <DieselCard litres={dieselData.litres} amount={dieselData.amount} />
      </div>

      {/* Total Sales Card */}
      <TotalSalesCard amount={totalSales} />

      {/* Transaction Count */}
      {stats?.total_transactions !== undefined && (
        <TransactionCountCard count={stats.total_transactions} />
      )}
    </div>
  );
}
