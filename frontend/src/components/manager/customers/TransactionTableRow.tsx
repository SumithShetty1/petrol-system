import { Droplet, MapPin } from "lucide-react";

type Props = {
  transaction: any;
  index: number;
};

export default function TransactionTableRow({ transaction, index }: Props) {
  const formatDate = (dateString: string) => {
    if (!dateString) return { date: "—", time: "—" };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getFuelTypeDisplay = (fuelType: string) => {
    return fuelType === "petrol" ? "Petrol" : "Diesel";
  };

  const { date, time } = formatDate(transaction.created_at);

  return (
    <tr
      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }`}
    >
      {/* Serial Number */}
      <td className="px-3 py-3 text-center whitespace-nowrap">
        <span className="text-gray-500 text-xs">{index + 1}</span>
      </td>

      {/* Customer Name */}
      <td className="px-3 py-3 whitespace-nowrap">
        <p className="text-gray-900 font-medium text-xs">
          {transaction.customer_name || "—"}
        </p>
      </td>

      {/* Customer Mobile */}
      <td className="px-3 py-3 whitespace-nowrap">
        <p className="text-gray-500 text-xs">
          {transaction.customer_mobile || "—"}
        </p>
      </td>

      {/* Fuel Type */}
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <Droplet
            className={`w-3 h-3 ${
              transaction.fuel_type === "petrol"
                ? "text-blue-500"
                : "text-orange-500"
            }`}
          />
          <span
            className={`text-xs font-medium ${
              transaction.fuel_type === "petrol"
                ? "text-blue-700"
                : "text-orange-700"
            }`}
          >
            {getFuelTypeDisplay(transaction.fuel_type)}
          </span>
        </div>
      </td>

      {/* Quantity */}
      <td className="px-3 py-3 text-right whitespace-nowrap">
        <span className="text-gray-700 text-xs">
          {parseFloat(transaction.quantity || 0).toFixed(2)}
        </span>
      </td>

      {/* Credit Redeemed */}
      <td className="px-3 py-3 text-right whitespace-nowrap">
        {parseFloat(transaction.points_used || 0) > 0 ? (
          <span className="text-orange-600 font-medium text-xs">
            ⭐ {parseFloat(transaction.points_used).toFixed(2)}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>

      {/* Credit Earned */}
      <td className="px-3 py-3 text-right whitespace-nowrap">
        {parseFloat(transaction.points_earned || 0) > 0 ? (
          <span className="text-green-600 font-medium text-xs">
            ⭐ {parseFloat(transaction.points_earned).toFixed(2)}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>

      {/* Remaining Credit Points */}
      <td className="px-3 py-3 text-right whitespace-nowrap">
        <span className="text-blue-600 font-medium text-xs">
          ⭐ {transaction.remaining_points || 0}
        </span>
      </td>

      {/* Original Amount */}
      <td className="px-3 py-3 text-right whitespace-nowrap">
        <span className="text-gray-500 text-xs">
          ₹{parseFloat(transaction.original_amount || 0).toFixed(2)}
        </span>
      </td>

      {/* Final Amount */}
      <td className="px-3 py-3 text01-right whitespace-nowrap">
        <span className="text-gray-900 font-medium text-xs">
          ₹{parseFloat(transaction.final_amount || 0).toFixed(2)}
        </span>
      </td>

      {/* Pump Name */}
      <td className="px-3 py-3 whitespace-nowrap">
        <p className="text-gray-700 text-xs">{transaction.pump_name || "—"}</p>
      </td>

      {/* Location */}
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-gray-600 text-xs">
            {transaction.pump_location || "—"}
          </span>
        </div>
      </td>

      {/* Attendant Name */}
      <td className="px-3 py-3 whitespace-nowrap">
        <p className="text-gray-700 text-xs">{transaction.attendant_name || "—"}</p>
      </td>

      {/* Attendant Phone */}
      <td className="px-3 py-3 whitespace-nowrap">
        <p className="text-gray-500 text-xs">{transaction.attendant_phone || "—"}</p>
      </td>

      {/* Manager Name */}
      <td className="px-3 py-3 whitespace-nowrap">
        <p className="text-gray-700 text-xs">{transaction.manager_name || "—"}</p>
      </td>

      {/* Manager Number */}
      <td className="px-3 py-3 whitespace-nowrap">
        <p className="text-gray-500 text-xs">{transaction.manager_phone || "—"}</p>
      </td>

      {/* Date & Time */}
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="text-xs">
          <p className="text-gray-700">{date}</p>
          <p className="text-gray-500">{time}</p>
        </div>
      </td>
    </tr>
  );
}
