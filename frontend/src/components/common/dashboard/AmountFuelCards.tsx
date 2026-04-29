import { IndianRupee, Fuel } from "lucide-react";

type Props = {
  totalSales: number;
  totalQuantity: number;
};

export default function AmountFuelCards({
  totalSales,
  totalQuantity,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">

      {/* TOTAL SALES */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <IndianRupee className="w-4 h-4 text-white/90" />
          <p className="text-white/80 text-sm">
            Total Sales Amount
          </p>
        </div>

        <p className="text-white text-2xl mt-1 font-semibold">
          ₹{totalSales.toFixed(2)}
        </p>
      </div>

      {/* TOTAL FUEL */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Fuel className="w-4 h-4 text-white/90" />
          <p className="text-white/80 text-sm">
            Total Fuel Sold
          </p>
        </div>

        <p className="text-white text-2xl mt-1 font-semibold">
          {totalQuantity} L
        </p>
      </div>

    </div>
  );
}
