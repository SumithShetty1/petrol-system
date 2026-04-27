import { Edit2, Trash2 } from "lucide-react";

type Person = {
  id: number | string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  subtitle?: string;
};

type Props = {
  user: Person;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PeopleListItem({
  user,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  const getInitials = (
    first?: string,
    last?: string
  ) => {
    const firstInitial = first?.[0] || "";
    const lastInitial = last?.[0] || "";

    if (!firstInitial && !lastInitial) {
      return "U";
    }

    return (
      firstInitial + lastInitial
    ).toUpperCase();
  };

  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    "Unknown User";

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-2xl p-4 shadow-md cursor-pointer hover:bg-blue-50 transition"
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
          <span className="text-sm font-medium">
            {getInitials(
              user.first_name,
              user.last_name
            )}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-medium truncate text-sm md:text-base">
            {fullName}
          </p>

          <p className="text-sm text-gray-500 truncate">
            {user.phone || "—"}
          </p>

          {user.subtitle && (
            <p className="text-xs text-blue-600 truncate mt-0.5">
              {user.subtitle}
            </p>
          )}
        </div>

        {/* Actions */}
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
