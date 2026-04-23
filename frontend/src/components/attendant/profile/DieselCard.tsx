import { Droplet } from "lucide-react";

type Props = {
  litres: number;
  amount: number;
};

export default function DieselCard({ litres, amount }: Props) {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-5 md:p-6 border border-orange-200">
      <div className="flex items-center gap-2 mb-4">
        <Droplet className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
        <span className="text-orange-700 text-base md:text-lg font-medium">Diesel</span>
      </div>
      <div className="space-y-3">
        <StatRow label="Litres" value={`${litres.toFixed(2)} L`} />
        <StatRow label="Amount" value={`₹${amount.toFixed(2)}`} />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-orange-600 text-sm md:text-base">{label}</span>
      <span className="text-orange-900 text-lg md:text-xl font-bold">{value}</span>
    </div>
  );
}
