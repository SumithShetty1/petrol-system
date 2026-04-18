import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MapPin, Droplet, Edit2, User } from "lucide-react";

import { getProfile } from "../services/profileService";
import { getFuelRates, updateFuelRate } from "../services/fuelService";
import { useAuth } from "../context/AuthContext";

export default function ManagerSettings() {
  const [profile, setProfile] = useState<any>(null);
  const [fuelRates, setFuelRates] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const [isEditingPrices, setIsEditingPrices] = useState(false);
  const [tempFuelPrices, setTempFuelPrices] = useState({
    petrol: 0,
    diesel: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Load profile + fuel rates
  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, fuelRatesData] = await Promise.all([
          getProfile(),
          getFuelRates(),
        ]);

        setProfile(profileData);

        const rates: any = {};
        fuelRatesData.forEach((rate: any) => {
          rates[rate.fuel_type] = rate;
        });

        setFuelRates(rates);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Edit prices
  const handleEditPrices = () => {
    setTempFuelPrices({
      petrol: parseFloat(fuelRates.petrol?.price_per_litre || 0),
      diesel: parseFloat(fuelRates.diesel?.price_per_litre || 0),
    });
    setIsEditingPrices(true);
  };

  const handlePriceChange = (type: "petrol" | "diesel", value: string) => {
    setTempFuelPrices((prev) => ({
      ...prev,
      [type]: value === "" ? 0 : parseFloat(value),
    }));
  };

  // Save prices
  const handleSavePrices = async () => {
    setIsSaving(true);
    try {
      if (fuelRates.petrol) {
        await updateFuelRate(fuelRates.petrol.id, tempFuelPrices.petrol);
      }

      if (fuelRates.diesel) {
        await updateFuelRate(fuelRates.diesel.id, tempFuelPrices.diesel);
      }

      // Refresh
      const updatedRates = await getFuelRates();

      const rates: any = {};
      updatedRates.forEach((rate: any) => {
        rates[rate.fuel_type] = rate;
      });

      setFuelRates(rates);
      setIsEditingPrices(false);
    } catch (error) {
      console.error("Error saving fuel prices:", error);
      alert("Failed to save fuel prices");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingPrices(false);
    setTempFuelPrices({ petrol: 0, diesel: 0 });
  };

  // Avatar initials
  const getInitials = (first: string, last: string) => {
    const firstInitial = first?.[0] || "";
    const lastInitial = last?.[0] || "";

    if (!firstInitial && !lastInitial) return "U";

    return (firstInitial + lastInitial).toUpperCase();
  };

  const fullName = `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">No data found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-8 pb-8 px-6 rounded-b-[2rem]">
        <div className="min-h-[60px] flex flex-col justify-center">
          <h1 className="text-white text-center text-lg md:text-2xl font-medium flex items-center justify-center gap-2">
            Settings
          </h1>
          <p className="text-white/0 text-sm mt-2 md:mt-5">placeholder</p>
        </div>
      </div>

      {/* Settings Content */}
      <div className="px-4 md:px-8 -mt-10 md:-mt-12 relative z-20">
        {/* Account Section */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Account
          </h2>

          {/* Avatar & Name */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white mb-3 shadow-md">
              <span className="text-2xl font-medium">
                {getInitials(profile.first_name, profile.last_name)}
              </span>
            </div>
            <h3 className="text-gray-900 text-lg font-semibold">
              {fullName || "Unknown User"}
            </h3>
            <p className="text-sm text-blue-600 font-medium capitalize">
              {profile.role}
            </p>
          </div>

          {/* Info Rows */}
          <div className="space-y-4">
            {/* Phone */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <Phone className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="text-gray-900 text-sm font-medium">
                  {profile.phone || "—"}
                </p>
              </div>
            </div>

            {/* Pump Name */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                <Droplet className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pump Name</p>
                <p className="text-gray-900 text-sm font-medium">
                  {profile.pump_name || "—"}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-gray-900 text-sm font-medium">
                  {profile.location || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Fuel Price Settings */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" />
              Fuel Price Settings
            </h3>
            {!isEditingPrices && (
              <button
                onClick={handleEditPrices}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Petrol Price */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">Petrol Price</span>
              </div>
              {isEditingPrices ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">₹</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={tempFuelPrices.petrol || ""}
                    onChange={(e) => handlePriceChange("petrol", e.target.value)}
                    className="w-20 px-2 py-1 text-sm rounded-lg border border-blue-500 focus:border-blue-600 outline-none text-right"
                  />
                  <span className="text-gray-500 text-sm">/L</span>
                </div>
              ) : (
                <span className="text-gray-900 font-medium">
                  ₹{parseFloat(fuelRates.petrol?.price_per_litre || 0).toFixed(2)} /L
                </span>
              )}
            </div>

            {/* Diesel Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-orange-500" />
                <span className="text-gray-700">Diesel Price</span>
              </div>
              {isEditingPrices ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">₹</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={tempFuelPrices.diesel || ""}
                    onChange={(e) => handlePriceChange("diesel", e.target.value)}
                    className="w-20 px-2 py-1 text-sm rounded-lg border border-blue-500 focus:border-blue-600 outline-none text-right"
                  />
                  <span className="text-gray-500 text-sm">/L</span>
                </div>
              ) : (
                <span className="text-gray-900 font-medium">
                  ₹{parseFloat(fuelRates.diesel?.price_per_litre || 0).toFixed(2)} /L
                </span>
              )}
            </div>
          </div>

          {/* Edit Mode Actions */}
          {isEditingPrices && (
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="flex-1 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrices}
                disabled={isSaving}
                className="flex-1 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
