type Props = {
  amount: string;
  redeemDiscount: number;
  finalPayable: number;
};

export default function AmountBreakdown({ amount, redeemDiscount, finalPayable }: Props) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 md:p-5 space-y-3">
      <div className="flex justify-between text-sm md:text-base">
        <span className="text-gray-600">Amount Entered:</span>
        <span className="text-gray-900 font-medium">₹{parseFloat(amount).toFixed(2)}</span>
      </div>
      {redeemDiscount > 0 && (
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-gray-600">Redeem Discount:</span>
          <span className="text-green-600 font-medium">-₹{redeemDiscount.toFixed(2)}</span>
        </div>
      )}
      <div className="border-t border-gray-300 my-2"></div>
      <div className="flex justify-between items-center">
        <span className="text-gray-900 font-semibold text-sm md:text-base">Final Payable:</span>
        <span className="text-gray-900 font-bold text-lg md:text-xl">₹{finalPayable.toFixed(2)}</span>
      </div>
    </div>
  );
}
