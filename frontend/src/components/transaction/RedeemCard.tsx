type Props = {
  redeemPoints: string;
  setRedeemPoints: (value: string) => void;
};

export default function RedeemCard({
  redeemPoints,
  setRedeemPoints,
}: Props) {

  return (
    <div className="bg-orange-50 rounded-xl p-4">

      <label className="text-sm text-gray-700">
        Redeem Points
      </label>

      <input
        type="number"
        value={redeemPoints}
        onChange={(e) => setRedeemPoints(e.target.value)}
        className="w-full mt-2 border-b pb-2 outline-none"
      />

    </div>
  );
}
