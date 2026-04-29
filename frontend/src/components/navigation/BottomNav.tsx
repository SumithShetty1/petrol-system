import { NavLink } from "react-router-dom";

type Props = {
  items: {
    label: string;
    path: string;
    icon: any;
  }[];
};

export default function BottomNav({ items }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full transition ${isActive ? "text-blue-500" : "text-gray-400"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />

                  {/* Show label only if active */}
                  {isActive && (
                    <span className="text-[10px] mt-1">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
