import { useEffect, useState } from "react";
import { getOwnerDashboard } from "../../services/dashboardService";

import PageHeader from "../../components/common/PageHeader";
import DateFilterTabs from "../../components/common/DateFilterTabs";
import DateRangePicker from "../../components/common/DateRangePicker";
import FuelStatsCards from "../../components/manager/dashboard/FuelStatsCards";
import CreditStatsCards from "../../components/manager/dashboard/CreditStatsCards";
import OverallAnalytics from "../../components/manager/dashboard/OverallAnalytics";

export type DateFilter = "today" | "week" | "month" | "year" | "custom";

export default function OwnerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");

  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadDashboardData = async (
    filter: DateFilter,
    customStart?: string,
    customEnd?: string
  ) => {
    try {
      const dashboard = await getOwnerDashboard(
        filter,
        customStart,
        customEnd
      );

      setData(dashboard);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const dashboardData = await getOwnerDashboard("today");
        setData(dashboardData);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleFilterChange = async (filter: DateFilter) => {
    setDateFilter(filter);

    if (filter === "custom") {
      setShowCustomDatePicker(true);
      return;
    }

    setShowCustomDatePicker(false);
    await loadDashboardData(filter);
  };

  const handleCustomDateSubmit = async () => {
    if (!startDate || !endDate) return;

    await loadDashboardData(
      "custom",
      startDate,
      endDate
    );

    setShowCustomDatePicker(false);
  };

  const handleCancelCustomDate = () => {
    setShowCustomDatePicker(false);
    setDateFilter("today");
    setStartDate("");
    setEndDate("");

    loadDashboardData("today");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          No dashboard data available
        </div>
      </div>
    );
  }

  const totalSales = data.total_sales || 0;
  const totalQuantity = data.total_quantity || 0;

  const petrolSales = data.petrol_sales || 0;
  const dieselSales = data.diesel_sales || 0;

  const petrolQuantity = data.petrol_quantity || 0;
  const dieselQuantity = data.diesel_quantity || 0;

  const creditsEarned = data.credits_earned || 0;
  const creditsRedeemed = data.credits_redeemed || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="Owner Dashboard"
        subtitle="Business Overview"
      />

      <DateFilterTabs
        className="px-6 mt-4"
        value={dateFilter}
        onChange={handleFilterChange}
      />

      {showCustomDatePicker && (
        <DateRangePicker
          className="px-6 mt-4"
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSubmit={handleCustomDateSubmit}
          onCancel={handleCancelCustomDate}
        />
      )}

      {dateFilter === "custom" &&
        !showCustomDatePicker &&
        startDate &&
        endDate && (
          <div className="px-6 mt-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-700">
                Showing data from{" "}
                <span className="font-medium">
                  {startDate}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {endDate}
                </span>
              </p>
            </div>
          </div>
        )}

      {/* KPI Cards */}
      <div className="px-6 mt-6 space-y-3">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
          <p className="text-white/80 text-sm">
            Total Revenue
          </p>

          <p className="text-2xl mt-1 font-semibold">
            ₹{totalSales.toFixed(2)}
          </p>
        </div>

        <FuelStatsCards
          petrolQuantity={petrolQuantity}
          petrolSales={petrolSales}
          dieselQuantity={dieselQuantity}
          dieselSales={dieselSales}
        />

        <CreditStatsCards
          creditsEarned={creditsEarned}
          creditsRedeemed={creditsRedeemed}
        />
      </div>

      {/* Overall Analytics */}
      <OverallAnalytics
        totalQuantity={totalQuantity}
        petrolQuantity={petrolQuantity}
        dieselQuantity={dieselQuantity}
        creditsEarned={creditsEarned}
        creditsRedeemed={creditsRedeemed}
      />
    </div>
  );
}
