import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
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
      icon: FileText,
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? "text-blue-500" : "text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
