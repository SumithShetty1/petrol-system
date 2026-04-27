import { useEffect, useState } from "react";
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
  const navigate =
    useNavigate();

  const { pumpCode } =
    useParams<{
      pumpCode: string;
    }>();

  const [pump, setPump] =
    useState<any>(null);

  const [stats, setStats] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [dateFilter, setDateFilter] =
    useState<DateFilter>(
      "today"
    );

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
  useEffect(() => {
    const loadData =
      async () => {
        if (!pumpCode)
          return;

        try {
          setLoading(true);

          const [
            pumpData,
            dashboardData,
          ] =
            await Promise.all([
              getPumpByCode(
                pumpCode
              ),

              getOwnerPumpDashboard(
                pumpCode,
                "today"
              ),
            ]);

          setPump(
            pumpData
          );

          setStats(
            dashboardData
          );
        } catch (error) {
          console.error(
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadData();
  }, [pumpCode]);

  // -----------------------------------
  // FETCH DASHBOARD
  // -----------------------------------
  const fetchStats =
    async (
      range: DateFilter,
      start?: string,
      end?: string
    ) => {
      if (!pumpCode)
        return;

      try {
        const data =
          await getOwnerPumpDashboard(
            pumpCode,
            range,
            start,
            end
          );

        setStats(data);
      } catch (error) {
        console.error(
          error
        );
      }
    };

  // -----------------------------------
  // FILTER CHANGE
  // -----------------------------------
  const handleFilterChange =
    async (
      filter: DateFilter
    ) => {
      setDateFilter(
        filter
      );

      if (
        filter ===
        "custom"
      ) {
        setShowCustomDatePicker(
          true
        );

        return;
      }

      setShowCustomDatePicker(
        false
      );

      await fetchStats(
        filter
      );
    };

  // -----------------------------------
  // CUSTOM DATE SUBMIT
  // -----------------------------------
  const handleCustomDateSubmit =
    async () => {
      if (
        !startDate ||
        !endDate
      ) {
        return;
      }

      await fetchStats(
        "custom",
        startDate,
        endDate
      );

      setShowCustomDatePicker(
        false
      );
    };

  // -----------------------------------
  // CANCEL CUSTOM DATE
  // -----------------------------------
  const handleCancelCustomDate =
    async () => {
      setShowCustomDatePicker(
        false
      );

      setDateFilter(
        "today"
      );

      setStartDate(
        ""
      );

      setEndDate(
        ""
      );

      await fetchStats(
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
          Loading pump
          details...
        </div>
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
          navigate(
            "/owner/pumps"
          )
        }
      />

      <div className="px-4 md:px-8 lg:px-12 mt-6 md:mt-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

          {/* LEFT SIDE */}
          <div className="space-y-6 md:space-y-8">

            <PumpDetailsCard
              pump={pump}
            />

            <OwnerInfoCard
              pump={pump}
            />

            <ManagerInfoCard
              pump={pump}
            />

            <FuelRatesCard
              pump={pump}
            />

          </div>

          {/* RIGHT SIDE */}
          <div>
            <PumpDashboardCard
              stats={stats}
              dateFilter={
                dateFilter
              }
              showCustomDatePicker={
                showCustomDatePicker
              }
              startDate={
                startDate
              }
              endDate={
                endDate
              }
              onFilterChange={
                handleFilterChange
              }
              onStartDateChange={
                setStartDate
              }
              onEndDateChange={
                setEndDate
              }
              onSubmitCustomDate={
                handleCustomDateSubmit
              }
              onCancelCustomDate={
                handleCancelCustomDate
              }
            />
          </div>

        </div>
      </div>
    </div>
  );
}
