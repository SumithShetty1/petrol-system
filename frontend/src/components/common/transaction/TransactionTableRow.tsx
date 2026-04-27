import { Droplet, MapPin } from "lucide-react";

type Props = {
  transaction: any;
  index: number;
};

export default function TransactionTableRow({
  transaction,
  index,
}: Props) {
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

  const { date, time } = formatDate(transaction.created_at);

  const isPetrol = transaction.fuel_type === "petrol";

  return (
    <tr
      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
        }`}
    >
      <td className="px-3 py-3 text-center text-xs">{index + 1}</td>

      <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">
        {transaction.customer_name || "—"}
      </td>

      <td className="px-3 py-3 text-xs whitespace-nowrap">
        {transaction.customer_mobile || "—"}
      </td>

      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <Droplet
            className={`w-3 h-3 ${isPetrol ? "text-blue-500" : "text-orange-500"
              }`}
          />
          <span
            className={`text-xs font-medium ${isPetrol ? "text-blue-700" : "text-orange-700"
              }`}
          >
            {isPetrol ? "Petrol" : "Diesel"}
          </span>
        </div>
      </td>

      <td className="px-3 py-3 text-right text-xs">
        {parseFloat(transaction.quantity || 0).toFixed(2)}
      </td>

      <td className="px-3 py-3 text-right text-xs">
        {parseFloat(transaction.points_used || 0) > 0
          ? `⭐ ${parseFloat(transaction.points_used).toFixed(2)}`
          : "—"}
      </td>

      <td className="px-3 py-3 text-right text-xs">
        {parseFloat(transaction.points_earned || 0) > 0
          ? `⭐ ${parseFloat(transaction.points_earned).toFixed(2)}`
          : "—"}
      </td>

      <td className="px-3 py-3 text-right text-xs text-blue-600 font-medium">
        ⭐ {transaction.remaining_points || 0}
      </td>

      <td className="px-3 py-3 text-right text-xs whitespace-nowrap">
        ₹{parseFloat(transaction.original_amount || 0).toFixed(2)}
      </td>

      <td className="px-3 py-3 text-right text-xs font-medium whitespace-nowrap">
        ₹{parseFloat(transaction.final_amount || 0).toFixed(2)}
      </td>

      <td className="px-3 py-3 text-xs font-medium whitespace-nowrap text-indigo-600">
        {transaction.pump_code || "—"}
      </td>

      <td className="px-3 py-3 text-xs whitespace-nowrap">
        {transaction.pump_name || "—"}
      </td>

      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1 text-xs">
          <MapPin className="w-3 h-3 text-gray-400" />
          {transaction.pump_location || "—"}
        </div>
      </td>

      <td className="px-3 py-3 text-xs whitespace-nowrap">
        {transaction.attendant_name || "—"}
      </td>

      <td className="px-3 py-3 text-xs whitespace-nowrap">
        {transaction.attendant_phone || "—"}
      </td>

      <td className="px-3 py-3 text-xs whitespace-nowrap">
        {transaction.manager_name || "—"}
      </td>

      <td className="px-3 py-3 text-xs whitespace-nowrap">
        {transaction.manager_phone || "—"}
      </td>

      <td className="px-3 py-3 whitespace-nowrap text-xs">
        <p>{date}</p>
        <p className="text-gray-500">{time}</p>
      </td>
    </tr>
  );
}
