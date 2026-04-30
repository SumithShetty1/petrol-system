import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProfile } from "../../services/profileService";
import { getFuelRates, updateFuelRate } from "../../services/fuelService";
import { useAuth } from "../../context/AuthContext";

import PageHeader from "../../components/common/header/PageHeader";
import AccountSection from "../../components/manager/settings/AccountSection";
import FuelPriceSettings from "../../components/manager/settings/FuelPriceSettings";

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

  const [pageError, setPageError] = useState<string | null>(null);
  const [fuelError, setFuelError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // -----------------------------------
  // LOAD DATA
  // -----------------------------------
  const loadData = async () => {
    try {
      setLoading(true);
      setPageError(null);
      setFuelError(null);

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

    } catch (error: any) {
      console.error(error);

      setPageError(
        error?.response?.data?.detail ||
        "Failed to load settings."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  // Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Edit prices
  const handleEditPrices = () => {
    setSaveError(null);

    setTempFuelPrices({
      petrol: Number(fuelRates.petrol?.price_per_litre ?? 0),
      diesel: Number(fuelRates.diesel?.price_per_litre ?? 0),
    });
    setIsEditingPrices(true);
  };

  const handlePriceChange = (type: "petrol" | "diesel", value: string) => {
    const parsed = value.trim() === "" ? NaN : Number(value);

    setTempFuelPrices((prev) => ({
      ...prev,
      [type]: parsed,
    }));
  };

  // Save prices
  const handleSavePrices = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      if (!fuelRates.petrol || !fuelRates.diesel) {
        throw new Error("Fuel rates not initialized. Contact admin.");
      }

      if (
        isNaN(tempFuelPrices.petrol) ||
        isNaN(tempFuelPrices.diesel)
      ) {
        throw new Error("Please enter valid numbers");
      }

      if (tempFuelPrices.petrol < 0 || tempFuelPrices.diesel < 0) {
        throw new Error("Fuel price cannot be negative");
      }

      const tasks = [];

      if (fuelRates.petrol) {
        tasks.push(updateFuelRate(fuelRates.petrol.id, tempFuelPrices.petrol));
      }
      if (fuelRates.diesel) {
        tasks.push(updateFuelRate(fuelRates.diesel.id, tempFuelPrices.diesel));
      }

      await Promise.all(tasks);

      const updatedRates = await getFuelRates();

      const rates: any = {};
      updatedRates.forEach((rate: any) => {
        rates[rate.fuel_type] = rate;
      });

      setFuelRates(rates);
      setIsEditingPrices(false);

    } catch (error: any) {
      console.error(error);

      setSaveError(
        error?.response?.data?.detail ||
        error.message ||
        "Failed to save fuel prices"
      );

    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingPrices(false);
    setTempFuelPrices({
      petrol: Number(fuelRates.petrol?.price_per_litre ?? 0),
      diesel: Number(fuelRates.diesel?.price_per_litre ?? 0),
    });
  };

  // -----------------------------------
  // INITIAL LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading settings...
      </div>
    );
  }

  // -----------------------------------
  // PAGE ERROR (BLOCKING)
  // -----------------------------------
  if (pageError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{pageError}</p>

        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="Settings"
      />

      <div className="px-4 md:px-8 -mt-10 md:-mt-12 relative z-20 space-y-6">

        {/* ACCOUNT */}
        {profile ? (
          <AccountSection profile={profile} onLogout={handleLogout} />
        ) : (
          <div className="bg-white p-6 rounded-xl text-gray-500 text-center">
            Profile unavailable
          </div>
        )}

        {/* FUEL ERROR */}
        {fuelError && (
          <div className="p-3 bg-red-50 border text-red-600 rounded-xl flex justify-between">
            <span>{fuelError}</span>
            <button onClick={loadData} className="text-blue-600">
              Retry
            </button>
          </div>
        )}

        <FuelPriceSettings
          fuelRates={fuelRates}
          isEditing={isEditingPrices}
          tempPrices={tempFuelPrices}
          isSaving={isSaving}
          onEdit={handleEditPrices}
          onPriceChange={handlePriceChange}
          onSave={handleSavePrices}
          onCancel={handleCancelEdit}
          error={saveError}
        />
      </div>
    </div>
  );
}
