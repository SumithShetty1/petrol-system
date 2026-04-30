import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getMyProfile } from "../../services/profileService";

import PageHeader from "../../components/common/header/PageHeader";
import ProfileCard from "../../components/common/profile/ProfileCard";

export default function AdminProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------------
  // LOAD PROFILE
  // -----------------------------------
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getMyProfile();
      setProfile(data);

    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
        "Failed to load profile"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);


  // -----------------------------------
  // LOGOUT
  // -----------------------------------
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // -----------------------------------
  // LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">
          Loading...
        </div>
      </div>
    );
  }

  // -----------------------------------
  // ERROR
  // -----------------------------------
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-md">
          {error}
        </p>

        <button
          onClick={loadProfile}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // -----------------------------------
  // NO DATA
  // -----------------------------------
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">
          No profile data available
        </div>
      </div>
    );
  }

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div className="min-h-screen bg-gray-50 pb-6 md:pb-8">
      <PageHeader title="Admin Profile" />

      <div className="px-4 md:px-8 lg:px-12 -mt-10 md:-mt-12 relative z-20">
        <div className="max-w-5xl mx-auto">
          <ProfileCard
            profile={profile}
            onLogout={handleLogout}
            showLogout={true}
            showManagerInfo={false}
          />
        </div>
      </div>
    </div>
  );
}
