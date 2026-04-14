import { useEffect, useState } from "react";
import { Droplet, Star, Calendar } from "lucide-react";
import { getDashboard } from "../services/dashboardService";
import { getProfile } from "../services/profileService";


type DateFilter = "today" | "week" | "month" | "year" | "custom";

export default function ManagerDashboard() {
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
        // Load profile and dashboard data
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

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];

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
  const netActiveCredits = creditsEarned - creditsRedeemed;

  const FILTERS: DateFilter[] = ["today", "week", "month", "year", "custom"];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-8 pb-8 px-6 rounded-b-[2rem]">
        <div className="min-h-[60px] flex flex-col justify-center">

          <h1 className="text-white text-center text-lg md:text-2xl font-medium relative z-10">
            Pump Dashboard
          </h1>

          <p className="text-white/80 text-center mt-1 text-sm">
            {profile.pump_name} - {profile.location || "Main Location"}
          </p>

        </div>
      </div>

      {/* Date Filter */}
      <div className="px-6 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${dateFilter === filter
                  ? "bg-blue-500 text-white shadow-md"
                  : "border border-blue-500 text-blue-600 hover:bg-blue-50"
                }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Picker */}
      {showCustomDatePicker && (
        <div className="px-6 mt-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Select Date Range</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate || today}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={today}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCustomDateSubmit}
                disabled={!startDate || !endDate}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Apply
              </button>
              <button
                onClick={handleCancelCustomDate}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
        {/* Total Sales */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
          <p className="text-white/80 text-sm">
            Total Sales Amount
          </p>
          <p className="text-2xl mt-1">
            ₹{totalSales.toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Total Petrol */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="w-4 h-4 text-blue-500" />
              <p className="text-gray-600 text-xs">
                Petrol Sold
              </p>
            </div>
            <p className="text-gray-900">
              {petrolQuantity.toFixed(2)} L
            </p>
            <p className="text-blue-600 text-sm">
              ₹{petrolSales.toFixed(2)}
            </p>
          </div>

          {/* Total Diesel */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="w-4 h-4 text-orange-500" />
              <p className="text-gray-600 text-xs">
                Diesel Sold
              </p>
            </div>
            <p className="text-gray-900">
              {dieselQuantity.toFixed(2)} L
            </p>
            <p className="text-orange-600 text-sm">
              ₹{dieselSales.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Credits Earned */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <p className="text-gray-600 text-xs">
                Credits Earned
              </p>
            </div>
            <p className="text-gray-900">
              ⭐ {creditsEarned.toFixed(2)}
            </p>
          </div>

          {/* Credits Redeemed */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-orange-500" />
              <p className="text-gray-600 text-xs">
                Credits Redeemed
              </p>
            </div>
            <p className="text-gray-900">
              ⭐ {creditsRedeemed.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Overall Analytics */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h2 className="text-gray-900 mb-4 font-semibold">
            Overall Analytics
          </h2>

          <div className="space-y-4">
            {/* Fuel Summary */}
            <div>
              <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                <Droplet className="w-4 h-4" />
                Fuel Summary
              </p>
              <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Petrol Quantity:
                  </span>
                  <span className="text-gray-900">
                    {petrolQuantity.toFixed(2)} L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Diesel Quantity:
                  </span>
                  <span className="text-gray-900">
                    {dieselQuantity.toFixed(2)} L
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-medium">
                      Total Fuel:
                    </span>
                    <span className="text-gray-900 font-medium">
                      {totalQuantity.toFixed(2)} L
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Credit Summary */}
            <div>
              <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                Credit Summary
              </p>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Total Earned:
                  </span>
                  <span className="text-gray-900">
                    ⭐ {creditsEarned.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Total Redeemed:
                  </span>
                  <span className="text-gray-900">
                    ⭐ {creditsRedeemed.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-orange-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-medium">
                      Net Active Credits:
                    </span>
                    <span className="text-green-600 font-medium">
                      ⭐ {netActiveCredits.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
