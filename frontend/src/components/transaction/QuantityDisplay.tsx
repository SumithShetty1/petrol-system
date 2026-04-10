type Props = {
  quantity: number;
};

export default function QuantityDisplay({ quantity }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-gray-700 text-sm md:text-base font-medium">Quantity (Litres)</label>
      <div className="relative">
        <input
          type="text"
          value={quantity.toFixed(2)}
          readOnly
          placeholder="Auto-calculated"
          className="w-full px-2 py-3 md:py-4 border-b-2 border-gray-200 outline-none text-gray-500 bg-gray-50 cursor-not-allowed placeholder:text-gray-400 text-sm md:text-base"
        />
      </div>
      <p className="text-xs md:text-sm text-gray-500">Calculated automatically based on amount and fuel rate</p>
    </div>
  );
}
