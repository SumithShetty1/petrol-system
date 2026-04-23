import { User } from "lucide-react";
import AttendantListItem from "./AttendantListItem";

type Props = {
  attendants: any[];
  onSelectAttendant: (attendant: any) => void;
  onEdit: (attendant: any) => void;
  onDelete: (attendant: any) => void;
};

export default function AttendantsList({
  attendants,
  onSelectAttendant,
  onEdit,
  onDelete,
}: Props) {
  if (attendants.length === 0) {
    return (
      <div className="px-6 mt-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-md">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No attendants found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 mt-4 space-y-3">
      {attendants.map((attendant) => (
        <AttendantListItem
          key={attendant.id}
          attendant={attendant}
          onSelect={() => onSelectAttendant(attendant)}
          onEdit={() => onEdit(attendant)}
          onDelete={() => onDelete(attendant)}
        />
      ))}
    </div>
  );
}
