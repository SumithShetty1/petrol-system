import { User } from "lucide-react";
import PeopleListItem from "./PeopleListItem";

type Person = {
  id: number | string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  subtitle?: string;
};

type Props = {
  users: Person[];
  emptyText?: string;
  onSelect: (user: Person) => void;
  onEdit: (user: Person) => void;
  onDelete: (user: Person) => void;
};

export default function PeopleList({
  users,
  emptyText = "No records found",
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  if (users.length === 0) {
    return (
      <div className="px-6 mt-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-md">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />

          <p className="text-gray-500 text-sm md:text-base">
            {emptyText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 mt-4 space-y-3">
      {users.map((user) => (
        <PeopleListItem
          key={user.id}
          user={user}
          onSelect={() => onSelect(user)}
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user)}
        />
      ))}
    </div>
  );
}
