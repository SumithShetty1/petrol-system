import { useEffect, useState } from "react";
import { getDashboard } from "../../services/dashboardService";
import { getProfile } from "../../services/profileService";

import PageHeader from "../../components/common/PageHeader";
import DateFilterTabs from "../../components/common/DateFilterTabs";
import DateRangePicker from "../../components/common/DateRangePicker";
import TotalSalesCard from "../../components/manager/dashboard/TotalSalesCard";
import FuelStatsCards from "../../components/manager/dashboard/FuelStatsCards";
import CreditStatsCards from "../../components/manager/dashboard/CreditStatsCards";
import OverallAnalytics from "../../components/manager/dashboard/OverallAnalytics";

export type DateFilter = "today" | "week" | "month" | "year" | "custom";

export default function PumpDashboard() {
  const [data, setData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");

  // Custom date range state
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadDashboardData = async (
    filter: DateFilter,
    customStart?: string,
    customEnd?: string
  ) => {
    try {
      const dashboard = await getDashboard(filter, customStart, customEnd);
      setData(dashboard);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [profileData, dashboardData] = await Promise.all([
          getProfile(),
          getDashboard("today"),
        ]);

        setProfile(profileData);
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
    } else {
      setShowCustomDatePicker(false);
      await loadDashboardData(filter);
    }
  };

  const handleCustomDateSubmit = async () => {
    if (startDate && endDate) {
      await loadDashboardData("custom", startDate, endDate);
      setShowCustomDatePicker(false);
    }
  };

  const handleCancelCustomDate = () => {
    setShowCustomDatePicker(false);
    setDateFilter("today");
    loadDashboardData("today");
    setStartDate("");
    setEndDate("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (!data || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">No dashboard data available</div>
      </div>
    );
  }

  // Extract data from API response
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
      {/* Header */}
      <PageHeader
        title="Pump Dashboard"
        subtitle={`${profile.pump_name} - ${profile.location || ""}`}
      />

      {/* Date Filter */}
      <DateFilterTabs
        className="px-6 mt-4"
        value={dateFilter}
        onChange={handleFilterChange}
      />

      {/* Custom Date Picker */}
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

      {/* Selected Range Info */}
      {dateFilter === "custom" && !showCustomDatePicker && startDate && endDate && (
        <div className="px-6 mt-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-sm text-blue-700">
              Showing data from <span className="font-medium">{startDate}</span> to{" "}
              <span className="font-medium">{endDate}</span>
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="px-6 mt-6 space-y-3">
        <TotalSalesCard amount={totalSales} />

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
