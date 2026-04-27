import {
  Briefcase,
  User,
  Phone,
} from "lucide-react";

import SectionCard from "./SectionCard";
import InfoRow from "./InfoRow";

type Props = {
  pump: any;
};

export default function ManagerInfoCard({
  pump,
}: Props) {
  return (
    <SectionCard
      title="Manager Information"
      icon={
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 flex items-center justify-center">
          <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
        </div>
      }
    >
      <div className="space-y-3">
        <InfoRow
          icon={
            <User className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
          }
          label="Name"
          value={
            pump.manager_name ||
            "Not Assigned"
          }
        />

        <InfoRow
          icon={
            <Phone className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          }
          label="Phone"
          value={
            pump.manager_phone ||
            "—"
          }
        />
      </div>
    </SectionCard>
  );
}
