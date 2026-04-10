import { NavLink } from "react-router-dom";
import { Droplet, User } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <NavLink
          to="/transaction"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full ${
              isActive ? "text-blue-500" : "text-gray-400"
            }`
          }
        >
          <Droplet className="w-5 h-5" />
          <span className="text-xs mt-1">Transaction</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full ${
              isActive ? "text-blue-500" : "text-gray-400"
            }`
          }
        >
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Profile</span>
        </NavLink>
      </div>
    </div>
  );
}
