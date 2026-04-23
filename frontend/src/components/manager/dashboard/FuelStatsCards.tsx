import { Droplet } from "lucide-react";

type Props = {
  petrolQuantity: number;
  petrolSales: number;
  dieselQuantity: number;
  dieselSales: number;
};

export default function FuelStatsCards({
  petrolQuantity,
  petrolSales,
  dieselQuantity,
  dieselSales,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Petrol Card */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Droplet className="w-4 h-4 text-blue-500" />
          <p className="text-gray-600 text-xs">Petrol Sold</p>
        </div>
        <p className="text-gray-900">{petrolQuantity.toFixed(2)} L</p>
        <p className="text-blue-600 text-sm">₹{petrolSales.toFixed(2)}</p>
      </div>

      {/* Diesel Card */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Droplet className="w-4 h-4 text-orange-500" />
          <p className="text-gray-600 text-xs">Diesel Sold</p>
        </div>
        <p className="text-gray-900">{dieselQuantity.toFixed(2)} L</p>
        <p className="text-orange-600 text-sm">₹{dieselSales.toFixed(2)}</p>
      </div>
    </div>
  );
}
