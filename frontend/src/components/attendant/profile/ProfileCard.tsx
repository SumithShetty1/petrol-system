import { Phone, Droplet, MapPin, LogOut } from "lucide-react";

type Props = {
  profile: any;
  onLogout?: () => void;
  showLogout?: boolean;
};

export default function ProfileCard({
  profile,
  onLogout,
  showLogout,
}: Props) {
  const getInitials = (first: string, last: string) => {
    const firstInitial = first?.[0] || "";
    const lastInitial = last?.[0] || "";

    if (!firstInitial && !lastInitial) return "U";

    return (firstInitial + lastInitial).toUpperCase();
  };

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

  const hasPumpInfo =
    profile.pump_name || profile.location;

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6 md:mb-8">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-500 flex items-center justify-center text-white mb-3 shadow-md">
          <span className="text-2xl md:text-3xl font-medium">
            {getInitials(profile.first_name, profile.last_name)}
          </span>
        </div>

        <h2 className="text-gray-900 text-lg md:text-xl font-semibold">
          {fullName || "Unknown User"}
        </h2>

        <p className="text-sm md:text-base text-blue-600 font-medium capitalize">
          {profile.role}
        </p>
      </div>

      {/* Info */}
      <div className="space-y-4 md:space-y-5">
        <InfoRow
          icon={<Phone className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />}
          iconBgColor="bg-blue-50"
          label="Phone Number"
          value={profile.phone || "—"}
          noBorder={!hasPumpInfo}
        />

        {profile.pump_name && (
          <InfoRow
            icon={<Droplet className="w-4 h-4 md:w-5 md:h-5 text-green-500" />}
            iconBgColor="bg-green-50"
            label="Pump Name"
            value={profile.pump_name}
          />
        )}

        {profile.location && (
          <InfoRow
            icon={<MapPin className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />}
            iconBgColor="bg-orange-50"
            label="Location"
            value={profile.location}
            noBorder={true}
          />
        )}
      </div>

      {/* Logout */}
      {showLogout && onLogout && (
        <button
          onClick={onLogout}
          className="w-full mt-6 md:mt-8 py-3 md:py-4 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          <span>Logout</span>
        </button>
      )}
    </div>
  );
}

type InfoRowProps = {
  icon: React.ReactNode;
  iconBgColor: string;
  label: string;
  value: string;
  noBorder?: boolean;
};

function InfoRow({
  icon,
  iconBgColor,
  label,
  value,
  noBorder = false,
}: InfoRowProps) {
  return (
    <div
      className={`flex items-center gap-3 md:gap-4 ${!noBorder
          ? "pb-3 md:pb-4 border-b border-gray-100"
          : ""
        }`}
    >
      <div
        className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${iconBgColor} flex items-center justify-center`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-xs md:text-sm text-gray-500">
          {label}
        </p>

        <p className="text-gray-900 text-sm md:text-base font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}
