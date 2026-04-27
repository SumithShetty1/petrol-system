import { useEffect, useState } from "react";
import { getOwnerDashboard } from "../../services/dashboardService";

import PageHeader from "../../components/common/header/PageHeader";
import DateFilterTabs from "../../components/common/dateFilter/DateFilterTabs";
import DateRangePicker from "../../components/common/dateFilter/DateRangePicker";
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
      const dashboard =
        await getOwnerDashboard(
          filter,
          customStart,
          customEnd
        );

      setData(dashboard);
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );
    }
  };

  // -----------------------------------
  // INITIAL LOAD
  // -----------------------------------
  useEffect(() => {
    const loadInitialData =
      async () => {
        try {
          const dashboardData =
            await getOwnerDashboard(
              "today"
            );

          setData(
            dashboardData
          );
        } catch (error) {
          console.error(
            "Dashboard error:",
            error
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
  const handleFilterChange =
    async (
      filter: DateFilter
    ) => {
      setDateFilter(filter);

      if (
        filter === "custom"
      ) {
        setShowCustomDatePicker(
          true
        );
        return;
      }

      setShowCustomDatePicker(
        false
      );

      await loadDashboardData(
        filter
      );
    };

  // -----------------------------------
  // CUSTOM DATE APPLY
  // -----------------------------------
  const handleCustomDateSubmit =
    async () => {
      if (
        !startDate ||
        !endDate
      )
        return;

      await loadDashboardData(
        "custom",
        startDate,
        endDate
      );

      setShowCustomDatePicker(
        false
      );
    };

  // -----------------------------------
  // CUSTOM DATE CANCEL
  // -----------------------------------
  const handleCancelCustomDate =
    () => {
      setShowCustomDatePicker(
        false
      );

      setDateFilter(
        "today"
      );

      setStartDate("");
      setEndDate("");

      loadDashboardData(
        "today"
      );
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

        {/* Revenue + Pumps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
            <p className="text-white/80 text-sm">
              Total Revenue
            </p>

            <p className="text-2xl mt-1 font-semibold">
              ₹
              {totalSales.toFixed(
                2
              )}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <p className="text-gray-500 text-sm">
              Total Pumps
            </p>

            <p className="text-2xl mt-1 font-semibold text-gray-800">
              {
                totalPumps
              }
            </p>
          </div>
        </div>

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
