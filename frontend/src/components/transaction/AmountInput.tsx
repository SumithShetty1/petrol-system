type Props = {
  amount: string;
  setAmount: (value: string) => void;
};

export default function AmountInput({ amount, setAmount }: Props) {

  return (
    <div className="space-y-2">

      <label className="text-gray-700 text-sm">
        Amount (₹)
      </label>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="w-full border-b-2 border-gray-200 pb-2 outline-none"
      />

    </div>
  );
}
