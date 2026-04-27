type Props = {
  amount: number;
};

export default function TotalSalesCard({ amount }: Props) {
  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
      <p className="text-white/80 text-sm">Total Sales Amount</p>
      <p className="text-2xl mt-1">₹{amount.toFixed(2)}</p>
    </div>
  );
}
