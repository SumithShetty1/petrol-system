import { Phone, MapPin, Droplet, User } from "lucide-react";
import ProfileInfoRow from "./ProfileInfoRow";

type Props = {
  profile: any;
  onLogout: () => void;
};

export default function AccountSection({ profile, onLogout }: Props) {
  const getInitials = (first: string, last: string) => {
    const firstInitial = first?.[0] || "";
    const lastInitial = last?.[0] || "";
    if (!firstInitial && !lastInitial) return "U";
    return (firstInitial + lastInitial).toUpperCase();
  };

  const fullName = `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h2 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-4 h-4 text-blue-500" />
        </div>
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
        <ProfileInfoRow
          icon={<Phone className="w-4 h-4 text-blue-500" />}
          iconBgColor="bg-blue-50"
          label="Phone Number"
          value={profile.phone || "—"}
        />

        <ProfileInfoRow
          icon={<Droplet className="w-4 h-4 text-green-500" />}
          iconBgColor="bg-green-50"
          label="Pump Name"
          value={profile.pump_name || "—"}
        />

        <ProfileInfoRow
          icon={<MapPin className="w-4 h-4 text-orange-500" />}
          iconBgColor="bg-orange-50"
          label="Location"
          value={profile.location || "—"}
          noBorder
        />
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full mt-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-md"
      >
        Logout
      </button>
    </div>
  );
}
