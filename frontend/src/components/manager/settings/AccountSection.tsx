import {
  Phone,
  MapPin,
  Droplet,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Hash,
} from "lucide-react";

import ProfileInfoRow from "./ProfileInfoRow";

type Props = {
  profile: any;
  onLogout: () => void;
};

export default function AccountSection({
  profile,
  onLogout,
}: Props) {
  const getInitials = (
    first: string,
    last: string
  ) => {
    const firstInitial =
      first?.[0] || "";

    const lastInitial =
      last?.[0] || "";

    if (
      !firstInitial &&
      !lastInitial
    ) {
      return "U";
    }

    return (
      firstInitial + lastInitial
    ).toUpperCase();
  };

  const fullName = `${
    profile?.first_name || ""
  } ${
    profile?.last_name || ""
  }`.trim();

  const isActive =
    profile?.is_active === true;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      {/* Header */}
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
            {getInitials(
              profile.first_name,
              profile.last_name
            )}
          </span>
        </div>

        <h3 className="text-gray-900 text-lg font-semibold text-center">
          {fullName ||
            "Unknown User"}
        </h3>

        <p className="text-sm text-blue-600 font-medium capitalize">
          {profile.role}
        </p>

        {/* Status */}
        <div
          className={`mt-2 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}

          {isActive
            ? "Active"
            : "Inactive"}
        </div>
      </div>

      {/* Info Rows */}
      <div className="space-y-4">
        <ProfileInfoRow
          icon={
            <Phone className="w-4 h-4 text-blue-500" />
          }
          iconBgColor="bg-blue-50"
          label="Phone Number"
          value={
            profile.phone || "—"
          }
        />

        <ProfileInfoRow
          icon={
            <Hash className="w-4 h-4 text-indigo-500" />
          }
          iconBgColor="bg-indigo-50"
          label="Pump ID"
          value={
            profile.pump_code || "—"
          }
        />

        <ProfileInfoRow
          icon={
            <Droplet className="w-4 h-4 text-green-500" />
          }
          iconBgColor="bg-green-50"
          label="Pump Name"
          value={
            profile.pump_name || "—"
          }
        />

        <ProfileInfoRow
          icon={
            <MapPin className="w-4 h-4 text-orange-500" />
          }
          iconBgColor="bg-orange-50"
          label="Location"
          value={
            profile.location || "—"
          }
        />

        <ProfileInfoRow
          icon={
            <Shield className="w-4 h-4 text-red-500" />
          }
          iconBgColor="bg-purple-50"
          label="Owner"
          value={
            profile.owner_name || "—"
          }
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
