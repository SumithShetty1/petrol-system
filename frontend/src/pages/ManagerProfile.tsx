import { useEffect, useState } from "react";
import { getProfile } from "../services/profileService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ManagerProfile() {

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const data = await getProfile();

        setProfile(data);

      } catch (error) {

        console.error("Profile error:", error);

      } finally {

        setLoading(false);

      }

    };

    loadProfile();

  }, []);

  const handleLogout = () => {

    logout();
    navigate("/");

  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-6">No profile data</div>;
  }

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Manager Profile
      </h1>

      {/* Profile Card */}

      <div className="bg-white p-4 rounded-xl shadow space-y-2">

        <p><b>Name:</b> {profile.name}</p>
        <p><b>Role:</b> {profile.role}</p>
        <p><b>Phone:</b> {profile.phone}</p>

        <hr />

        <p><b>Pump ID:</b> {profile.pump_id}</p>
        <p><b>Pump Name:</b> {profile.pump_name}</p>
        <p><b>Location:</b> {profile.location}</p>

      </div>

      {/* Logout Button */}

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600"
      >
        Logout
      </button>

    </div>

  );

}
