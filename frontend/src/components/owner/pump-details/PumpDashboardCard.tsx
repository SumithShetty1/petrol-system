// components/owner/pump-details/PumpDashboardCard.tsx

import { BarChart3 } from "lucide-react";

import SectionCard from "./SectionCard";

import DateFilterTabs from "../../common/dateFilter/DateFilterTabs";
import DateRangePicker from "../../common/dateFilter/DateRangePicker";

import TotalSalesCard from "../../common/dashboard/TotalSalesCard";
import FuelStatsCards from "../../common/dashboard/FuelStatsCards";
import CreditStatsCards from "../../common/dashboard/CreditStatsCards";
import OverallAnalytics from "../../common/dashboard/OverallAnalytics";

export type DateFilter =
  | "today"
  | "week"
  | "month"
  | "year"
  | "custom";

type Props = {
  stats: any;

  dateFilter: DateFilter;

  showCustomDatePicker: boolean;

  startDate: string;
  endDate: string;

  onFilterChange: (
    filter: DateFilter
  ) => void;

  onStartDateChange: (
    value: string
  ) => void;

  onEndDateChange: (
    value: string
  ) => void;

  onSubmitCustomDate: () => void;

  onCancelCustomDate: () => void;
};

export default function PumpDashboardCard({
  stats,
  dateFilter,
  showCustomDatePicker,
  startDate,
  endDate,
  onFilterChange,
  onStartDateChange,
  onEndDateChange,
  onSubmitCustomDate,
  onCancelCustomDate,
}: Props) {
  const totalSales =
    stats?.total_sales || 0;

  const petrolQty =
    stats?.petrol_quantity || 0;

  const dieselQty =
    stats?.diesel_quantity || 0;

  const creditsEarned =
    stats?.credits_earned || 0;

  const creditsRedeemed =
    stats?.credits_redeemed || 0;

  return (
    <SectionCard
      title="Performance Dashboard"
      icon={
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-50 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
        </div>
      }
    >
      <DateFilterTabs
        className="mb-4"
        value={dateFilter}
        onChange={
          onFilterChange
        }
      />

      {showCustomDatePicker && (
        <DateRangePicker
          className="mb-4"
          startDate={
            startDate
          }
          endDate={
            endDate
          }
          onStartDateChange={
            onStartDateChange
          }
          onEndDateChange={
            onEndDateChange
          }
          onSubmit={
            onSubmitCustomDate
          }
          onCancel={
            onCancelCustomDate
          }
        />
      )}

      <div className="space-y-4">
        <TotalSalesCard
          amount={totalSales}
        />

        <FuelStatsCards
          petrolQuantity={
            petrolQty
          }
          petrolSales={
            stats?.petrol_sales ||
            0
          }
          dieselQuantity={
            dieselQty
          }
          dieselSales={
            stats?.diesel_sales ||
            0
          }
        />

        <CreditStatsCards
          creditsEarned={
            creditsEarned
          }
          creditsRedeemed={
            creditsRedeemed
          }
        />

        <OverallAnalytics
          totalQuantity={
            Number(
              petrolQty
            ) +
            Number(
              dieselQty
            )
          }
          petrolQuantity={
            petrolQty
          }
          dieselQuantity={
            dieselQty
          }
          creditsEarned={
            creditsEarned
          }
          creditsRedeemed={
            creditsRedeemed
          }
          compact={true}
        />
      </div>
    </SectionCard>
  );
}
