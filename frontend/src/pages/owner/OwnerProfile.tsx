import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getMyProfile } from "../../services/profileService";

import PageHeader from "../../components/common/header/PageHeader";
import ProfileCard from "../../components/common/profile/ProfileCard";


export default function OwnerProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">
          Loading...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">
          No profile data available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6 md:pb-8">
      <PageHeader title="Owner Profile" />

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
