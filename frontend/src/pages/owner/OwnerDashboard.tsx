import { useEffect, useState } from "react";
import { getOwnerDashboard } from "../../services/dashboardService";

import PageHeader from "../../components/common/header/PageHeader";
import DateFilterTabs from "../../components/common/dateFilter/DateFilterTabs";
import DateRangePicker from "../../components/common/dateFilter/DateRangePicker";
import AmountFuelCards from "../../components/common/dashboard/AmountFuelCards";
import EntityStatsCards from "../../components/common/dashboard/EntityStatsCards";
import FuelStatsCards from "../../components/common/dashboard/FuelStatsCards";
import CreditStatsCards from "../../components/common/dashboard/CreditStatsCards";
import OverallAnalytics from "../../components/common/dashboard/OverallAnalytics";


export type DateFilter =
  | "today"
  | "week"
  | "month"
  | "year"
  | "custom";

export default function OwnerDashboard() {
  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dateFilter, setDateFilter] =
    useState<DateFilter>("today");

  const [
    showCustomDatePicker,
    setShowCustomDatePicker,
  ] = useState(false);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  // -----------------------------------
  // LOAD DASHBOARD DATA
  // -----------------------------------
  const loadDashboardData = async (
    filter: DateFilter,
    customStart?: string,
    customEnd?: string
  ) => {
    try {
      setError(null);

      const dashboard = await getOwnerDashboard(
        filter,
        customStart,
        customEnd
      );

      setData(dashboard);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
        "Failed to load dashboard"
      );
    }
  };

  // -----------------------------------
  // INITIAL LOAD
  // -----------------------------------
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setError(null);

        const dashboardData = await getOwnerDashboard("today");
        setData(dashboardData);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.response?.data?.detail ||
          "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

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
    await loadDashboardData(filter);
  };

  // -----------------------------------
  // CUSTOM DATE APPLY
  // -----------------------------------
  const handleCustomDateSubmit = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end date");
      return;
    }

    await loadDashboardData("custom", startDate, endDate);
    setShowCustomDatePicker(false);
  };

  // -----------------------------------
  // CUSTOM DATE CANCEL
  // -----------------------------------
  const handleCancelCustomDate = () => {
    setShowCustomDatePicker(false);
    setDateFilter("today");
    setStartDate("");
    setEndDate("");

    loadDashboardData("today");
  };

  // -----------------------------------
  // LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading dashboard...
        </div>
      </div>
    );
  }

  // -----------------------------------
  // ERROR STATE
  // -----------------------------------
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-red-500 text-md text-center">
          {error}
        </div>

        <button
          onClick={() =>
            dateFilter === "custom"
              ? loadDashboardData("custom", startDate, endDate)
              : loadDashboardData(dateFilter)
          }
          className="px-5 py-2 bg-blue-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // -----------------------------------
  // NO DATA
  // -----------------------------------
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          No dashboard data available
        </div>
      </div>
    );
  }

  // -----------------------------------
  // VALUES
  // -----------------------------------
  const totalSales =
    data.total_sales || 0;

  const totalQuantity =
    data.total_quantity || 0;

  const petrolSales =
    data.petrol_sales || 0;

  const dieselSales =
    data.diesel_sales || 0;

  const petrolQuantity =
    data.petrol_quantity || 0;

  const dieselQuantity =
    data.diesel_quantity || 0;

  const creditsEarned =
    data.credits_earned || 0;

  const creditsRedeemed =
    data.credits_redeemed || 0;

  const totalPumps =
    data.total_pumps || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="Owner Dashboard"
        subtitle="Business Overview"
      />

      <DateFilterTabs
        className="px-6 mt-4"
        value={dateFilter}
        onChange={
          handleFilterChange
        }
      />

      {showCustomDatePicker && (
        <DateRangePicker
          className="px-6 mt-4"
          startDate={
            startDate
          }
          endDate={
            endDate
          }
          onStartDateChange={
            setStartDate
          }
          onEndDateChange={
            setEndDate
          }
          onSubmit={
            handleCustomDateSubmit
          }
          onCancel={
            handleCancelCustomDate
          }
        />
      )}

      {dateFilter ===
        "custom" &&
        !showCustomDatePicker &&
        startDate &&
        endDate && (
          <div className="px-6 mt-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-700">
                Showing data
                from{" "}
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

        {/* AMOUNT & FUEL */}
        <AmountFuelCards
          totalSales={totalSales}
          totalQuantity={totalQuantity}
        />

        {/* Fuel Stats */}
        <FuelStatsCards
          petrolQuantity={
            petrolQuantity
          }
          petrolSales={
            petrolSales
          }
          dieselQuantity={
            dieselQuantity
          }
          dieselSales={
            dieselSales
          }
        />

        {/* Credits */}
        <CreditStatsCards
          creditsEarned={
            creditsEarned
          }
          creditsRedeemed={
            creditsRedeemed
          }
        />
        {/* ENTITY STATS */}
        <EntityStatsCards
          totalPumps={totalPumps}
        />

      </div>

      {/* Overall Analytics */}
      <OverallAnalytics
        totalQuantity={
          totalQuantity
        }
        petrolQuantity={
          petrolQuantity
        }
        dieselQuantity={
          dieselQuantity
        }
        creditsEarned={
          creditsEarned
        }
        creditsRedeemed={
          creditsRedeemed
        }
      />
    </div>
  );
}
