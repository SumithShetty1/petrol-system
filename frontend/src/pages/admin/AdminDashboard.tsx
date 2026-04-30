import { useEffect, useState } from "react";

import { getAdminDashboard } from "../../services/dashboardService";

import PageHeader from "../../components/common/header/PageHeader";
import DateFilterTabs from "../../components/common/dateFilter/DateFilterTabs";
import DateRangePicker from "../../components/common/dateFilter/DateRangePicker";
import AmountFuelCards from "../../components/common/dashboard/AmountFuelCards";
import EntityStatsCards from "../../components/common/dashboard/EntityStatsCards";
import FuelStatsCards from "../../components/common/dashboard/FuelStatsCards";
import CreditStatsCards from "../../components/common/dashboard/CreditStatsCards";

export type DateFilter =
  | "today"
  | "week"
  | "month"
  | "year"
  | "custom";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [pageError, setPageError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);


  const [dateFilter, setDateFilter] =
    useState<DateFilter>("today");

  const [showCustomDatePicker, setShowCustomDatePicker] =
    useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // -----------------------------------
  // LOAD DATA
  // -----------------------------------
  const loadDashboardData = async (
    filter: DateFilter,
    customStart?: string,
    customEnd?: string,
    isInitial = false
  ) => {
    try {
      if (isInitial) {
        setLoading(true);
        setPageError(null);
      } else {
        setStatsError(null);
      }

      const dashboard = await getAdminDashboard(
        filter,
        customStart,
        customEnd
      );

      setData(dashboard);
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.detail ||
        "Failed to load dashboard";

      if (isInitial) {
        setPageError(message);
      } else {
        setStatsError(message);
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  };

  // -----------------------------------
  // INITIAL LOAD 
  // -----------------------------------
  useEffect(() => {
    loadDashboardData("today", undefined, undefined, true);
  }, []);

  // -----------------------------------
  // FILTER CHANGE
  // -----------------------------------
  const handleFilterChange = (filter: DateFilter) => {
    setValidationError(null);
    setStatsError(null);

    setDateFilter(filter);

    if (filter === "custom") {
      setShowCustomDatePicker(true);
      return;
    }

    setShowCustomDatePicker(false);

    loadDashboardData(filter);
  };

  // -----------------------------------
  // CUSTOM DATE APPLY
  // -----------------------------------
  const handleCustomDateSubmit = () => {
    setValidationError(null);
    setStatsError(null);

    if (!startDate || !endDate) {
      setValidationError("Please select both dates");
      return;
    }

    if (endDate < startDate) {
      setValidationError("End date cannot be before start date");
      return;
    }

    loadDashboardData("custom", startDate, endDate);
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
    setValidationError(null);

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
  // INITIAL ERROR (BLOCKING)
  // -----------------------------------
  if (pageError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{pageError}</p>

        <button
          onClick={() =>
            loadDashboardData("today", undefined, undefined, true)
          }
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }


  // -----------------------------------
  // VALUES
  // -----------------------------------
  const totalSales = data.total_sales ?? 0;
  const totalQuantity = data.total_quantity ?? 0;

  const petrolSales = data.petrol_sales ?? 0;
  const dieselSales = data.diesel_sales ?? 0;

  const petrolQuantity = data.petrol_quantity ?? 0;
  const dieselQuantity = data.diesel_quantity ?? 0;

  const creditsEarned = data.credits_earned ?? 0;
  const creditsRedeemed = data.credits_redeemed ?? 0;

  const totalPumps = data.total_pumps ?? 0;
  const totalOwners = data.total_owners ?? 0;

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Global Overview"
      />

      {/* NON-BLOCKING ERRORS */}
      {(validationError || statsError) && (
        <div className="px-6 mt-4 space-y-2">
          {validationError && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded">
              {validationError}
            </div>
          )}

          {statsError && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded flex justify-between">
              <span>{statsError}</span>

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
          )}
        </div>
      )}

      <DateFilterTabs
        className="px-6 mt-4"
        value={dateFilter}
        onChange={handleFilterChange}
      />

      {/* CUSTOM DATE PICKER */}
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

      {/* CUSTOM RANGE LABEL */}
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

      {/* KPI SECTION */}
      <div className="px-6 mt-6 space-y-4">

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

        <EntityStatsCards
          totalPumps={totalPumps}
          totalOwners={totalOwners}
        />
      </div>

    </div>
  );
}
