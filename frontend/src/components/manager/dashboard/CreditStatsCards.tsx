import { Star } from "lucide-react";

type Props = {
  creditsEarned: number;
  creditsRedeemed: number;
};

export default function CreditStatsCards({ creditsEarned, creditsRedeemed }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Credits Earned */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <p className="text-gray-600 text-xs">Credits Earned</p>
        </div>
        <p className="text-gray-900">⭐ {creditsEarned.toFixed(2)}</p>
      </div>

      {/* Credits Redeemed */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-orange-500" />
          <p className="text-gray-600 text-xs">Credits Redeemed</p>
        </div>
        <p className="text-gray-900">⭐ {creditsRedeemed.toFixed(2)}</p>
      </div>
    </div>
  );
}
