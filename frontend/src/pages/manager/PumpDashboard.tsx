import { useEffect, useState } from "react";
import { getDashboard } from "../../services/dashboardService";
import { getMyPump } from "../../services/pumpService";

import PageHeader from "../../components/common/header/PageHeader";
import DateFilterTabs from "../../components/common/dateFilter/DateFilterTabs";
import DateRangePicker from "../../components/common/dateFilter/DateRangePicker";
import AmountFuelCards from "../../components/common/dashboard/AmountFuelCards";
import FuelStatsCards from "../../components/common/dashboard/FuelStatsCards";
import CreditStatsCards from "../../components/common/dashboard/CreditStatsCards";
import OverallAnalytics from "../../components/common/dashboard/OverallAnalytics";

export type DateFilter = "today" | "week" | "month" | "year" | "custom";

export default function PumpDashboard() {
  const [data, setData] = useState<any>(null);
  const [pump, setPump] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");

  // Custom date range state
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [pageError, setPageError] = useState<string | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // -----------------------------------
  // FETCH DASHBOARD
  // -----------------------------------
  const loadDashboardData = async (
    filter: DateFilter,
    customStart?: string,
    customEnd?: string
  ) => {
    try {
      setDashboardError(null);

      const dashboard = await getDashboard(filter, customStart, customEnd);
      setData(dashboard);

    } catch (err: any) {
      console.error(err);
      setDashboardError(
        err?.response?.data?.detail ||
        "Failed to load dashboard"
      );
    }
  };

  // -----------------------------------
  // INITIAL LOAD
  // -----------------------------------
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setPageError(null);

      const [pumpData, dashboardData] = await Promise.all([
        getMyPump(),
        getDashboard("today"),
      ]);

      setPump(pumpData);
      setData(dashboardData);

    } catch (err: any) {
      console.error(err);
      setPageError(
        err?.response?.data?.detail ||
        "Failed to load page data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // -----------------------------------
  // FILTER CHANGE
  // -----------------------------------
  const handleFilterChange = async (filter: DateFilter) => {
    setDateFilter(filter);

    if (filter === "custom") {
      setShowCustomDatePicker(true);
      return;
    }

    setShowCustomDatePicker(false);
    setStartDate("");
    setEndDate("");

    await loadDashboardData(filter);
  };

  // -----------------------------------
  // CUSTOM DATE SUBMIT
  // -----------------------------------
  const handleCustomDateSubmit = async () => {
    if (!startDate || !endDate) {
      setDashboardError("Please select both dates");
      return;
    }

    if (endDate < startDate) {
      setDashboardError("End date cannot be before start date");
      return;
    }

    await loadDashboardData("custom", startDate, endDate);
    setShowCustomDatePicker(false);
  };

  // -----------------------------------
  // CANCEL CUSTOM DATE
  // -----------------------------------
  const handleCancelCustomDate = async () => {
    setShowCustomDatePicker(false);
    setDateFilter("today");
    setStartDate("");
    setEndDate("");

    await loadDashboardData("today");
  };

  // -----------------------------------
  // INITIAL LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  // -----------------------------------
  // PAGE ERROR (BLOCKING)
  // -----------------------------------
  if (pageError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{pageError}</p>

        <button
          onClick={loadInitialData}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
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
        subtitle={`${pump.pump_name} - ${pump.location || ""}`}
      />

      {/* ERROR (NON-BLOCKING) */}
      {dashboardError && (
        <div className="px-6 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 flex justify-between">
            <span>{dashboardError}</span>
            <button
              onClick={() =>
                dateFilter === "custom"
                  ? loadDashboardData("custom", startDate, endDate)
                  : loadDashboardData(dateFilter)
              }
              className="text-blue-600 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

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
        <AmountFuelCards
          totalSales={totalSales}
          totalQuantity={totalQuantity}
        />

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
