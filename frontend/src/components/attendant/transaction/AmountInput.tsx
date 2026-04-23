type Props = {
  amount: string;
  onAmountChange: (value: string) => void;
};

export default function AmountInput({ amount, onAmountChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-gray-700 text-sm md:text-base font-medium">Amount (₹)</label>
      <div className="relative">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-base md:text-lg">₹</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="Enter amount"
          className="w-full pl-6 md:pl-8 pr-2 py-3 md:py-4 border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
        />
      </div>
    </div>
  );
}
