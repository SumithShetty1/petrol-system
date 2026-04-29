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

    return (firstInitial + lastInitial).toUpperCase();
  };

  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    "Unknown User";

  return (
    <div
      onClick={onSelect}
      className="
        bg-white
        rounded-xl sm:rounded-2xl
        p-3 sm:p-4
        shadow-sm sm:shadow-md
        cursor-pointer
        transition-all duration-200

        hover:bg-blue-50
        hover:shadow-md sm:hover:shadow-lg
      "
    >
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Avatar */}
        <div className="
          w-10 h-10 sm:w-12 sm:h-12
          rounded-full
          bg-blue-500
          flex items-center justify-center
          text-white
          flex-shrink-0
          shadow-sm
        ">
          <span className="text-xs sm:text-sm font-semibold">
            {getInitials(user.first_name, user.last_name)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="
            text-gray-900
            font-medium
            truncate
            text-sm sm:text-base md:text-lg
          ">
            {fullName}
          </p>

          <p className="
            text-gray-500
            truncate
            text-xs sm:text-sm
          ">
            {user.phone || "—"}
          </p>

          {user.subtitle && (
            <p className="
              text-blue-600
              truncate
              mt-0.5
              text-[11px] sm:text-xs
            ">
              {user.subtitle}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="
              p-2 sm:p-2.5
              rounded-lg
              text-blue-600
              hover:bg-blue-100
              transition-all
              active:scale-95
            "
          >
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="
              p-2 sm:p-2.5
              rounded-lg
              text-red-600
              hover:bg-red-100
              transition-all
              active:scale-95
            "
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

        </div>
      </div>
    </div>
  );
}
