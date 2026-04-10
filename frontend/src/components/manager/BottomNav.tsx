import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Search,
  User
} from "lucide-react";

export default function BottomNav() {

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/manager/dashboard"
    },
    {
      label: "Attendants",
      icon: Users,
      path: "/manager/attendants"
    },
    {
      label: "Transactions",
      icon: Receipt,
      path: "/manager/transactions"
    },
    {
      label: "Customers",
      icon: Search,
      path: "/manager/customers"
    },
    {
      label: "Profile",
      icon: User,
      path: "/manager/profile"
    }
  ];

  return (

    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm">

      <div className="flex justify-around py-2">

        {navItems.map((item) => {

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (

            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center text-xs"
            >

              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              />

              <span
                className={`${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </span>

            </button>

          );

        })}

      </div>

    </div>

  );

}
