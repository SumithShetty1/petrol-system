import { Edit2, Trash2 } from "lucide-react";

type Props = {
  attendant: any;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function AttendantListItem({ attendant, onSelect, onEdit, onDelete }: Props) {
  const getInitials = (first: string, last: string) => {
    const firstInitial = first?.[0] || "";
    const lastInitial = last?.[0] || "";
    if (!firstInitial && !lastInitial) return "U";
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-2xl p-4 shadow-md cursor-pointer hover:bg-blue-50 transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
          <span className="text-sm font-medium">
            {getInitials(attendant.first_name, attendant.last_name)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-medium truncate">
            {attendant.first_name} {attendant.last_name}
          </p>
          <p className="text-sm text-gray-500 truncate">{attendant.phone}</p>
          <p className="text-xs text-blue-600 truncate">{attendant.pump_name || "—"}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
