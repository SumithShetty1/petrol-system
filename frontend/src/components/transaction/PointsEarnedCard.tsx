import { Star } from "lucide-react";

type Props = {
  pointsEarned: number;
};

export default function PointsEarnedCard({ pointsEarned }: Props) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 md:p-5 border-2 border-green-200">
      <div className="text-center space-y-2">
        <p className="text-sm md:text-base text-gray-700">Points Earned on this Transaction</p>
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 md:w-6 md:h-6 text-green-600 fill-green-600" />
          <span className="text-green-700 text-xl md:text-2xl font-bold">+{pointsEarned} points</span>
        </div>
        <p className="text-xs md:text-sm text-gray-500">
          Calculated on final payable amount (₹1 = 0.1 points)
        </p>
      </div>
    </div>
  );
}
