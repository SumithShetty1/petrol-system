import { useEffect, useState, useRef } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getPumpByCode,
} from "../../services/pumpService";

import {
  getOwnerPumpDashboard,
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

export default function OwnerPumpDetails() {
  const navigate = useNavigate();
  const { pumpCode } = useParams<{ pumpCode: string }>();

  const [pump, setPump] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [dateFilter, setDateFilter] = useState<DateFilter>("today");

  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const requestIdRef = useRef(0);

  // -----------------------------------
  // INITIAL LOAD
  // -----------------------------------
  const loadData = async () => {
    if (!pumpCode) return;

    try {
      setLoading(true);
      setError(null);

      const [pumpData, dashboardData] = await Promise.all([
        getPumpByCode(pumpCode),
        getOwnerPumpDashboard(pumpCode, "today"),
      ]);

      setPump(pumpData);
      setStats(dashboardData);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
        "Failed to load pump details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pumpCode) return;
    loadData();
  }, [pumpCode]);

  // -----------------------------------
  // FETCH DASHBOARD (NON-BLOCKING)
  // -----------------------------------
  const fetchStats = async (
    range: DateFilter,
    start?: string,
    end?: string
  ) => {
    if (!pumpCode) return;

    const requestId = ++requestIdRef.current;

    try {

      const data = await getOwnerPumpDashboard(
        pumpCode,
        range,
        start,
        end
      );

      // Prevent stale updates
      if (requestId !== requestIdRef.current) return;

      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------------
  // FILTER CHANGE
  // -----------------------------------
  const handleFilterChange = (filter: DateFilter) => {
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
  const handleCustomDateSubmit = () => {
    if (!startDate || !endDate) return;
    if (endDate < startDate) return;

    fetchStats("custom", startDate, endDate);
    setShowCustomDatePicker(false);
  };

  // -----------------------------------
  // CANCEL CUSTOM DATE
  // -----------------------------------
  const handleCancelCustomDate = () => {
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
  // ERROR
  // -----------------------------------
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-red-500 text-lg text-center">
          {error}
        </div>

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

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="Pump Overview"
        subtitle={pump.pump_code}
        showBack={true}
        onBack={() => navigate("/owner/pumps")}
      />

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
