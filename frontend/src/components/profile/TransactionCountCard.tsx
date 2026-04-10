type Props = {
  count: number;
};

export default function TransactionCountCard({ count }: Props) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 md:p-6">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-sm md:text-base">Total Transactions</span>
        <span className="text-gray-900 text-xl md:text-2xl font-bold">{count}</span>
      </div>
    </div>
  );
}
