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
  // -----------------------------------
  // EMPTY STATE
  // -----------------------------------
  if (users.length === 0) {
    return (
      <div className="px-4 sm:px-6 mt-4 flex justify-center">
        <div
          className="
            w-full
            max-w-full
            sm:max-w-lg
            md:max-w-xl
            lg:max-w-2xl
            xl:max-w-3xl
            2xl:max-w-4xl
          "
        >
          <div className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-md">
            <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />

            <p className="text-gray-500 text-sm sm:text-base">
              {emptyText}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------
  // LIST VIEW
  // -----------------------------------
  return (
    <div className="px-4 sm:px-6 mt-4 flex justify-center">
      <div
        className="
          w-full
          max-w-full
          sm:max-w-lg
          md:max-w-xl
          lg:max-w-2xl
          xl:max-w-3xl
          2xl:max-w-4xl
          space-y-2 sm:space-y-3 md:space-y-4
        "
      >
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
    </div>
  );
}
