import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProfile } from "../../services/profileService";
import { getFuelRates, updateFuelRate } from "../../services/fuelService";
import { useAuth } from "../../context/AuthContext";

import PageHeader from "../../components/common/PageHeader";
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
      <PageHeader
        title="Settings"
      />

      <div className="px-4 md:px-8 -mt-10 md:-mt-12 relative z-20">
        <AccountSection profile={profile} onLogout={handleLogout} />

        <FuelPriceSettings
          fuelRates={fuelRates}
          isEditing={isEditingPrices}
          tempPrices={tempFuelPrices}
          isSaving={isSaving}
          onEdit={handleEditPrices}
          onPriceChange={handlePriceChange}
          onSave={handleSavePrices}
          onCancel={handleCancelEdit}
        />
      </div>
    </div>
  );
}
