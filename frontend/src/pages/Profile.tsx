import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProfile } from "../services/profileService";
import { getAttendantDashboard } from "../services/dashboardService";

export default function Profile() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const [range, setRange] = useState("today");

  const loadDashboard = async (filter:string) => {
    const d = await getAttendantDashboard(filter);
    setStats(d);
  };

  useEffect(() => {

    const load = async () => {

      const p = await getProfile();

      setProfile(p);

      await loadDashboard(range);

    };

    load();

  }, []);

  const changeFilter = async (filter:string) => {

    setRange(filter);
    await loadDashboard(filter);

  };

  const handleLogout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/");

  };

  if (!profile || !stats) {
    return <div className="p-6">Loading...</div>;
  }

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Attendant Profile
      </h1>

      {/* Profile Card */}

      <div className="bg-white p-4 rounded-xl shadow space-y-2">

        <p><b>Name:</b> {profile.name}</p>
        <p><b>Role:</b> {profile.role}</p>
        <p><b>Phone:</b> {profile.phone}</p>

        <hr/>

        <p><b>Pump ID:</b> {profile.pump_id}</p>
        <p><b>Pump Name:</b> {profile.pump_name}</p>
        <p><b>Location:</b> {profile.location}</p>

        <button
          onClick={handleLogout}
          className="w-full mt-3 bg-red-500 text-white py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

      {/* Filters */}

      <div className="flex gap-2">

        {["today","week","month","year"].map((f)=>(
          <button
            key={f}
            onClick={()=>changeFilter(f)}
            className={`px-3 py-1 rounded-lg text-sm ${
              range === f
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}

      </div>

      {/* Total Sales */}

      <div className="bg-white p-4 rounded-xl shadow">

        <p className="text-sm text-gray-500">
          Total Sales
        </p>

        <p className="text-2xl font-bold text-blue-600">
          ₹{stats.total_sales.toFixed(2)}
        </p>

      </div>

      {/* Fuel Breakdown */}

      <div className="grid grid-cols-2 gap-4">

        {Object.entries(stats.fuel_breakdown).map(([type,fuel]:any)=>(
          
          <div
            key={type}
            className="bg-white p-4 rounded-xl shadow"
          >

            <p className="font-semibold">
              {type.toUpperCase()}
            </p>

            <p className="text-sm">
              {fuel.litres.toFixed(2)} L
            </p>

            <p className="text-sm text-gray-600">
              ₹{fuel.amount.toFixed(2)}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}
