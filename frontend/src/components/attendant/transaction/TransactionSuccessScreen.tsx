import { CheckCircle } from "lucide-react";
import PageHeader from "../../common/header/PageHeader";
import SuccessDetailRow from "./SuccessDetailRow";

type Props = {
  transactionDetails: any;
  onNewTransaction: () => void;
};

export default function TransactionSuccessScreen({
  transactionDetails,
  onNewTransaction,
}: Props) {
  const customerName = transactionDetails.customer_name || "—";
  const customerMobile = transactionDetails.customer_mobile || "—";
  const fuelType = transactionDetails.fuel_type || "—";

  const originalAmount = parseFloat(transactionDetails.original_amount) || 0;
  const finalAmount = parseFloat(transactionDetails.final_amount) || 0;
  const quantity = parseFloat(transactionDetails.quantity) || 0;

  const pointsUsed = parseFloat(transactionDetails.points_used) || 0;
  const pointsEarned = parseFloat(transactionDetails.points_earned) || 0;
  const remainingPoints = parseFloat(transactionDetails.remaining_points) || 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Transaction Complete" />

      <div className="px-4 md:px-8 -mt-10 md:-mt-12 relative z-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl md:rounded-4xl shadow-md p-6 md:p-8 space-y-6 md:space-y-8">
            
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 md:w-14 md:h-14 text-green-600" />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <SuccessDetailRow label="Customer Name" value={customerName} />
              <SuccessDetailRow label="Mobile Number" value={customerMobile} />

              <SuccessDetailRow label="Fuel Type" value={fuelType.toUpperCase()} />
              <SuccessDetailRow label="Quantity" value={`${quantity.toFixed(3)} L`} />

              <SuccessDetailRow
                label="Original Amount"
                value={`₹${originalAmount.toFixed(2)}`}
              />

              <SuccessDetailRow
                label="Final Amount Paid"
                value={`₹${finalAmount.toFixed(2)}`}
              />

              {pointsEarned > 0 && (
                <div className="md:col-span-2">
                  <SuccessDetailRow
                    label="Points Earned"
                    value={`⭐ ${pointsEarned.toFixed(2)}`}
                    bgColor="bg-green-50"
                    valueColor="text-green-600"
                  />
                </div>
              )}

              {pointsUsed > 0 && (
                <div className="md:col-span-2">
                  <SuccessDetailRow
                    label="Points Used"
                    value={`⭐ ${pointsUsed.toFixed(2)}`}
                    bgColor="bg-orange-50"
                    valueColor="text-orange-600"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <SuccessDetailRow
                  label="Remaining Points"
                  value={`⭐ ${remainingPoints.toFixed(2)}`}
                  bgColor="bg-blue-50"
                  valueColor="text-blue-700"
                  bold
                />
              </div>

            </div>

            <button
              onClick={onNewTransaction}
              className="w-full py-4 md:py-5 rounded-2xl bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors font-medium text-base md:text-lg"
            >
              New Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
