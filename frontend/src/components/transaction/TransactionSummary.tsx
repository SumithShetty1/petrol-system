type Props = {
  result: any;
};

export default function TransactionSummary({ result }: Props) {

  if (!result) return null;

  return (
    <div className="bg-green-50 p-4 rounded-xl space-y-2">

      <p>Quantity: {result.quantity}</p>

      <p>Points Earned: {result.points_earned}</p>

      <p>Points Used: {result.points_used}</p>

    </div>
  );
}
