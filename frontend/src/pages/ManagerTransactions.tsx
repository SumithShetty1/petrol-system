import { useEffect, useState } from "react";
import { getTransactions } from "../services/managerService";
import { getPumpId } from "../utils/pump";

export default function ManagerTransactions() {

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadTransactions = async () => {

      try {

        const pumpId = getPumpId();

        if (!pumpId) {
          console.error("Pump ID not found");
          return;
        }

        const data = await getTransactions(pumpId);

        setTransactions(data);

      } catch (error) {

        console.error("Error loading transactions:", error);

      } finally {

        setLoading(false);

      }

    };

    loadTransactions();

  }, []);

  if (loading) {
    return <div className="p-6">Loading transactions...</div>;
  }

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Pump Transactions
      </h1>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found</p>
      ) : (

        <div className="space-y-4">

          {transactions.map((t) => (

            <div
              key={t.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between"
            >

              <div>

                <p className="font-semibold">
                  {t.customer_name || t.name}
                </p>

                <p className="text-sm text-gray-500">
                  {t.mobile_number}
                </p>

                <p className="text-xs text-gray-400">
                  Fuel: {t.fuel_type}
                </p>

              </div>

              <div className="text-right">

                <p className="font-bold text-blue-600">
                  ₹{t.amount}
                </p>

                <p className="text-sm text-gray-500">
                  {t.quantity} L
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}
