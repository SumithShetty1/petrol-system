import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getPumpByCode,
} from "../../services/pumpService";

import {
  getAdminPumpDashboard,
} from "../../services/dashboardService";

import PageHeader from "../../components/common/header/PageHeader";

import PumpDetailsCard from "../../components/owner/pump-details/PumpDetailsCard";
import OwnerInfoCard from "../../components/owner/pump-details/OwnerInfoCard";
import ManagerInfoCard from "../../components/owner/pump-details/ManagerInfoCard";
import FuelRatesCard from "../../components/owner/pump-details/FuelRatesCard";
import PumpDashboardCard from "../../components/owner/pump-details/PumpDashboardCard";

export type DateFilter =
  | "today"
  | "week"
  | "month"
  | "year"
  | "custom";

export default function AdminPumpDetails() {
  const navigate = useNavigate();

  const { pumpCode } = useParams<{
    pumpCode: string;
  }>();

  const [pump, setPump] =
    useState<any>(null);

  const [stats, setStats] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [pageError, setPageError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

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
  // INITIAL LOAD
  // -----------------------------------
  const loadData = async () => {
    if (!pumpCode) return;

    try {
      setLoading(true);
      setPageError(null);

      const [pumpData, dashboardData] = await Promise.all([
        getPumpByCode(pumpCode),
        getAdminPumpDashboard(pumpCode, "today"),
      ]);

      setPump(pumpData);
      setStats(dashboardData);
    } catch (err: any) {
      console.error(err);

      setPageError(
        err?.response?.data?.detail ||
        "Failed to load pump details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pumpCode]);

  // -----------------------------------
  // FETCH DASHBOARD
  // -----------------------------------
  const fetchStats = async (
    range: DateFilter,
    start?: string,
    end?: string
  ) => {
    if (!pumpCode) return;

    try {
      setStatsError(null);

      const data =
        await getAdminPumpDashboard(
          pumpCode,
          range,
          start,
          end
        );

      setStats(data);
    } catch (err: any) {
      console.error(err);

      setStatsError(
        err?.response?.data?.detail ||
        "Failed to update dashboard"
      );
    }
  };

  // -----------------------------------
  // FILTER CHANGE
  // -----------------------------------
  const handleFilterChange = async (
    filter: DateFilter
  ) => {
    setDateFilter(filter);

    if (filter === "custom") {
      setShowCustomDatePicker(true);
      return;
    }

    setShowCustomDatePicker(false);

    fetchStats(filter);
  };

  // -----------------------------------
  // CUSTOM DATE SUBMIT
  // -----------------------------------
  const handleCustomDateSubmit =
    async () => {
      if (!startDate || !endDate) return;
      if (endDate < startDate) return;

      await fetchStats(
        "custom",
        startDate,
        endDate
      );

      setShowCustomDatePicker(false);
    };

  // -----------------------------------
  // CANCEL CUSTOM DATE
  // -----------------------------------
  const handleCancelCustomDate =
    async () => {
      setShowCustomDatePicker(false);
      setDateFilter("today");
      setStartDate("");
      setEndDate("");

      fetchStats("today");
    };

  // -----------------------------------
  // LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading pump details...
        </div>
      </div>
    );
  }

  // -----------------------------------
  // PAGE ERROR
  // -----------------------------------
  if (pageError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-lg">{pageError}</p>

        <button
          onClick={loadData}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // -----------------------------------
  // NOT FOUND
  // -----------------------------------
  if (!pump) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Pump not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="Pump Overview"
        subtitle={pump.pump_code}
        showBack={true}
        onBack={() =>
          navigate("/admin/pumps")
        }
      />

      {/* STATS ERROR */}
      {statsError && (
        <div className="px-6 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 flex justify-between items-center">
            <span>{statsError}</span>

            <button
              onClick={() =>
                dateFilter === "custom"
                  ? fetchStats("custom", startDate, endDate)
                  : fetchStats(dateFilter)
              }
              className="text-blue-600 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="px-4 md:px-8 lg:px-12 mt-6 md:mt-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

          {/* LEFT */}
          <div className="space-y-6 md:space-y-8">

            <PumpDetailsCard pump={pump} />

            <OwnerInfoCard pump={pump} />

            <ManagerInfoCard pump={pump} />

            <FuelRatesCard pump={pump} />

          </div>

          {/* RIGHT */}
          <div>
            <PumpDashboardCard
              stats={stats}
              dateFilter={dateFilter}
              showCustomDatePicker={showCustomDatePicker}
              startDate={startDate}
              endDate={endDate}
              onFilterChange={handleFilterChange}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onSubmitCustomDate={handleCustomDateSubmit}
              onCancelCustomDate={handleCancelCustomDate}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
