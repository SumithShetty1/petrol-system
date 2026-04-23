import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProfile } from "../../services/profileService";
import { getAttendantDashboard } from "../../services/dashboardService";

import PageHeader from "../../components/common/PageHeader";
import ProfileCard from "../../components/attendant/profile/ProfileCard";
import PerformanceDashboard from "../../components/attendant/profile/PerformanceDashboard";

export type DateFilter = "today" | "week" | "month" | "year" | "custom";

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [range, setRange] = useState<DateFilter>("today");
  const [loading, setLoading] = useState(true);

  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadDashboard = async (filter: string, customStart?: string, customEnd?: string) => {
    try {
      const data = await getAttendantDashboard(filter, customStart, customEnd);
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const p = await getProfile();
        setProfile(p);
        await loadDashboard(range);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const changeFilter = async (filter: DateFilter) => {
    setRange(filter);

    if (filter === "custom") {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
      await loadDashboard(filter);
    }
  };

  const handleCustomDateSubmit = async () => {
    if (startDate && endDate) {
      await loadDashboard("custom", startDate, endDate);
      setShowCustomDatePicker(false);
    }
  };

  const handleCancelCustomDate = () => {
    setShowCustomDatePicker(false);
    setRange("today");
    loadDashboard("today");
    setStartDate("");
    setEndDate("");
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">No data available</div>
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
              <ProfileCard profile={profile} onLogout={handleLogout} showLogout={true} />
            </div>

            {/* Performance Dashboard - Right Column */}
            <div className="lg:col-span-2">
              <PerformanceDashboard
                stats={stats}
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
