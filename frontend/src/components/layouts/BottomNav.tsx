import { NavLink } from "react-router-dom";
import { Droplet, User } from "lucide-react";

export default function BottomNav() {

  const base =
    "flex flex-col items-center text-xs flex-1 py-2";

  const active =
    "text-blue-600";

  const inactive =
    "text-gray-400";

  return (

    <div className="fixed bottom-0 left-0 right-0 flex bg-white border-t">

      <NavLink
        to="/transaction"
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        <Droplet size={20} />
        Transaction
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        <User size={20} />
        Profile
      </NavLink>

    </div>

  );

}
