import {
  Building2,
  Hash,
  Fuel,
  MapPin,
} from "lucide-react";

import SectionCard from "./SectionCard";
import InfoRow from "./InfoRow";

export default function PumpDetailsCard({
  pump,
}: any) {
  return (
    <SectionCard
      title="Pump Details"
      icon={
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-indigo-600" />
        </div>
      }
    >
      <div className="space-y-3">
        <InfoRow
          icon={<Hash className="w-5 h-5 text-indigo-600" />}
          label="Pump ID"
          value={pump.pump_code}
        />

        <InfoRow
          icon={<Fuel className="w-5 h-5 text-green-600" />}
          label="Pump Name"
          value={pump.pump_name}
        />

        <InfoRow
          icon={<MapPin className="w-5 h-5 text-orange-600" />}
          label="Location"
          value={pump.location}
        />
      </div>
    </SectionCard>
  );
}
