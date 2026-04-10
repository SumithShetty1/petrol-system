import { BarChart3 } from "lucide-react";

type Props = {
  amount: number;
};

export default function TotalSalesCard({ amount }: Props) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 md:p-6 border border-green-200">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
        <span className="text-green-700 text-base md:text-lg font-medium">Total Sales</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-green-600 text-sm md:text-base">Total Amount</span>
        <span className="text-green-900 text-2xl md:text-3xl font-bold">
          ₹{amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
