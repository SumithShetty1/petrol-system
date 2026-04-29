type Props = {
  customerPoints: number;
  isRedeemApplied: boolean;
  canRedeem: boolean;
  canRedeemWeekly: boolean;
  nextRedeemDate: string | null;
  onToggleRedeem: () => void;
};

export default function RedemptionCard({ customerPoints, isRedeemApplied, canRedeem, canRedeemWeekly, nextRedeemDate, onToggleRedeem }: Props) {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 md:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm md:text-base text-gray-700">
            Available Points: <span className="font-semibold">⭐ {customerPoints}</span>
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">1000 points = ₹100 discount</p>
        </div>
      </div>
      {canRedeem ? (
        <button
          onClick={() => {
            if (canRedeem) onToggleRedeem();
          }}
          className={`w-full py-3 md:py-4 rounded-xl transition-all font-medium ${isRedeemApplied
            ? "bg-orange-500 text-white shadow-md"
            : "bg-white border-2 border-orange-400 text-orange-600 hover:bg-orange-50"
            }`}
        >
          {isRedeemApplied ? "✓ Redeem Applied" : "Redeem ₹100"}
        </button>
      ) : (
        <div className="text-center">
          <button disabled className="w-full py-3 md:py-4 rounded-xl bg-gray-200 text-gray-400 cursor-not-allowed font-medium">
            Redeem ₹100
          </button>
          {!canRedeemWeekly && nextRedeemDate ? (
            <p className="text-xs md:text-sm text-red-500 mt-2">
              Already redeemed this week.
              Try again after{" "}
              {new Date(nextRedeemDate).toLocaleString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          ) : (
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              Minimum amount ₹100 required to redeem
            </p>
          )}
        </div>
      )}
    </div>
  );
}
