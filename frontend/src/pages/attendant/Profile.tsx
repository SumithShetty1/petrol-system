import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getProfile } from "../../services/profileService";
import { getAttendantDashboard } from "../../services/dashboardService";

import PageHeader from "../../components/common/header/PageHeader";
import ProfileCard from "../../components/common/profile/ProfileCard";
import PerformanceDashboard from "../../components/common/performance/PerformanceDashboard";

export type DateFilter = "today" | "week" | "month" | "year" | "custom";

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [range, setRange] = useState<DateFilter>("today");
  const [loading, setLoading] = useState(true);

  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [profileError, setProfileError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);


  // -----------------------------------
  // LOAD DASHBOARD
  // -----------------------------------
  const loadDashboard = async (
    filter: DateFilter,
    customStart?: string,
    customEnd?: string
  ) => {
    try {
      setStatsError(null);

      const data = await getAttendantDashboard(
        filter,
        customStart,
        customEnd
      );

      setStats(data);
    } catch (err: any) {
      console.error(err);

      setStatsError(
        err?.response?.data?.detail ||
        "Failed to load dashboard data"
      );
    }
  };

  // -----------------------------------
  // LOAD PROFILE + INITIAL DASHBOARD
  // -----------------------------------
  const loadData = async () => {
    try {
      setLoading(true);
      setProfileError(null);

      const p = await getProfile();
      setProfile(p);

      await loadDashboard("today");
    } catch (err: any) {
      console.error(err);

      setProfileError(
        err?.response?.data?.detail ||
        "Failed to load profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
  }, []);

  // -----------------------------------
  // FILTER CHANGE
  // -----------------------------------
  const changeFilter = async (filter: DateFilter) => {
    setRange(filter);
    setStatsError(null);

    if (filter === "custom") {
      setShowCustomDatePicker(true);
      return;
    }

    setShowCustomDatePicker(false);
    await loadDashboard(filter);
  };

  // -----------------------------------
  // CUSTOM DATE SUBMIT
  // -----------------------------------
  const handleCustomDateSubmit = async () => {
    if (!startDate || !endDate) {
      setStatsError("Please select both start and end date");
      return;
    }

    await loadDashboard("custom", startDate, endDate);
    setShowCustomDatePicker(false);
  };

  // -----------------------------------
  // CANCEL CUSTOM DATE
  // -----------------------------------
  const handleCancelCustomDate = async () => {
    setShowCustomDatePicker(false);
    setRange("today");
    setStartDate("");
    setEndDate("");

    await loadDashboard("today");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  // -----------------------------------
  // PROFILE ERROR (BLOCK PAGE)
  // -----------------------------------
  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-red-500 text-md text-center">
          {profileError}
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

  return (
    <div className="min-h-screen bg-gray-50 pb-6 md:pb-8">
      <PageHeader title="Attendant Profile" />

      <div className="px-4 md:px-8 lg:px-12 -mt-10 md:-mt-12 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Profile Card - Left Column */}
            <div className="lg:col-span-1">
              <ProfileCard profile={profile} onLogout={handleLogout} showLogout={true} showManagerInfo={true} />
            </div>

            {/* DASHBOARD */}
            <div className="lg:col-span-2">

              {/* Dashboard Error */}
              {statsError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 flex justify-between">
                  <span>{statsError}</span>
                  <button
                    onClick={() =>
                      range === "custom"
                        ? loadDashboard("custom", startDate, endDate)
                        : loadDashboard(range)
                    }
                    className="text-blue-600 font-medium"
                  >
                    Retry
                  </button>
                </div>
              )}

              <PerformanceDashboard
                stats={stats}
                error={statsError}
                range={range}
                showCustomDatePicker={showCustomDatePicker}
                startDate={startDate}
                endDate={endDate}
                onChangeFilter={changeFilter}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onCustomDateSubmit={handleCustomDateSubmit}
                onCancelCustomDate={handleCancelCustomDate}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
