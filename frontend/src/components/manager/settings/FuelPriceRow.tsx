import { Droplet } from "lucide-react";

type Props = {
  type: "petrol" | "diesel";
  label: string;
  iconColor: string;
  price: number;
  isEditing: boolean;
  tempValue: number;
  onPriceChange: (type: "petrol" | "diesel", value: string) => void;
  noBorder?: boolean;
};

export default function FuelPriceRow({
  type,
  label,
  iconColor,
  price,
  isEditing,
  tempValue,
  onPriceChange,
  noBorder = false,
}: Props) {
  return (
    <div className={`flex items-center justify-between ${!noBorder ? "pb-3 border-b border-gray-100" : ""}`}>
      <div className="flex items-center gap-2">
        <Droplet className={`w-4 h-4 ${iconColor}`} />
        <span className="text-gray-700">{label}</span>
      </div>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">₹</span>
          <input
            type="number"
            step="0.1"
            min="0"
            value={tempValue || ""}
            onChange={(e) => onPriceChange(type, e.target.value)}
            className="w-20 px-2 py-1 text-sm rounded-lg border border-blue-500 focus:border-blue-600 outline-none text-right"
          />
          <span className="text-gray-500 text-sm">/L</span>
        </div>
      ) : (
        <span className="text-gray-900 font-medium">
          ₹{price.toFixed(2)} /L
        </span>
      )}
    </div>
  );
}
