import {
  Shield,
  User,
  Phone,
} from "lucide-react";

import SectionCard from "./SectionCard";
import InfoRow from "./InfoRow";

type Props = {
  pump: any;
};

export default function OwnerInfoCard({
  pump,
}: Props) {
  return (
    <SectionCard
      title="Owner Information"
      icon={
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-50 flex items-center justify-center">
          <Shield className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
        </div>
      }
    >
      <div className="space-y-3">
        <InfoRow
          icon={
            <User className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
          }
          label="Name"
          value={
            pump.owner_name ||
            "Not Assigned"
          }
        />

        <InfoRow
          icon={
            <Phone className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          }
          label="Phone"
          value={
            pump.owner_phone ||
            "—"
          }
        />
      </div>
    </SectionCard>
  );
}
