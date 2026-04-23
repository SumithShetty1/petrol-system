import { Droplet, Star } from "lucide-react";

type Props = {
  totalQuantity: number;
  petrolQuantity: number;
  dieselQuantity: number;
  creditsEarned: number;
  creditsRedeemed: number;
};

export default function OverallAnalytics({
  totalQuantity,
  petrolQuantity,
  dieselQuantity,
  creditsEarned,
  creditsRedeemed,
}: Props) {
  const netActiveCredits = creditsEarned - creditsRedeemed;

  return (
    <div className="px-6 mt-6">
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h2 className="text-gray-900 mb-4 font-semibold">Overall Analytics</h2>

        <div className="space-y-4">
          {/* Fuel Summary */}
          <div>
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <Droplet className="w-4 h-4" />
              Fuel Summary
            </p>
            <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Petrol Quantity:</span>
                <span className="text-gray-900">{petrolQuantity.toFixed(2)} L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diesel Quantity:</span>
                <span className="text-gray-900">{dieselQuantity.toFixed(2)} L</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-900 font-medium">Total Fuel:</span>
                  <span className="text-gray-900 font-medium">{totalQuantity.toFixed(2)} L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Summary */}
          <div>
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              Credit Summary
            </p>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Earned:</span>
                <span className="text-gray-900">⭐ {creditsEarned.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Redeemed:</span>
                <span className="text-gray-900">⭐ {creditsRedeemed.toFixed(2)}</span>
              </div>
              <div className="border-t border-orange-200 pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-900 font-medium">Net Active Credits:</span>
                  <span className="text-green-600 font-medium">⭐ {netActiveCredits.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
