import { useState, useEffect } from "react";

import CustomerLookup from "../components/transaction/CustomerLookup";
import FuelSelector from "../components/transaction/FuelSelector";
import AmountInput from "../components/transaction/AmountInput";

import { createTransaction } from "../services/transactionService";
import { fetchCustomer } from "../services/customerService";
import { getFuelRates } from "../services/fuelService";

export default function Transaction() {

  const [pumpId, setPumpId] = useState<number | null>(null);

  const [phone, setPhone] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPoints, setCustomerPoints] = useState(0);

  const [isExisting, setIsExisting] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [fuelType, setFuelType] = useState("");
  const [amount, setAmount] = useState("");

  const [fuelRates, setFuelRates] = useState<any>({});
  const [quantity, setQuantity] = useState(0);

  const [isRedeemApplied, setIsRedeemApplied] = useState(false);

  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  // -----------------------------
  // Load Pump ID from localStorage
  // -----------------------------

  useEffect(() => {

    const storedPump = localStorage.getItem("pump_id");

    if (storedPump) {
      setPumpId(Number(storedPump));
    }

  }, []);

  // -----------------------------
  // Fetch Fuel Rates
  // -----------------------------

  useEffect(() => {

    const fetchRates = async () => {

      if (!pumpId) return;

      try {

        const data = await getFuelRates(pumpId);

        const rates: any = {};

        data.forEach((item: any) => {
          rates[item.fuel_type] = item.price_per_litre;
        });

        setFuelRates(rates);

      } catch {

        console.log("Error fetching fuel rates");

      }

    };

    fetchRates();

  }, [pumpId]);

  // -----------------------------
  // Auto Quantity Calculation
  // -----------------------------

  useEffect(() => {

    if (amount && fuelType && fuelRates[fuelType]) {

      const price = fuelRates[fuelType];

      const qty = parseFloat(amount) / price;

      setQuantity(qty);

    } else {

      setQuantity(0);

    }

  }, [amount, fuelType, fuelRates]);

  // -----------------------------
  // Redeem Logic
  // -----------------------------

  const getRedeemDiscount = () => {
    if (isRedeemApplied && customerPoints >= 1000) {
      return 100;
    }
    return 0;
  };

  const getFinalPayable = () => {
    const enteredAmount = parseFloat(amount) || 0;
    return Math.max(0, enteredAmount - getRedeemDiscount());
  };

  const getPointsEarned = () => {
    return Math.floor(getFinalPayable() * 0.1);
  };

  // -----------------------------
  // Fetch Customer
  // -----------------------------

  const handleFetchCustomer = async () => {

    if (phone.length !== 10) {
      alert("Enter valid phone number");
      return;
    }

    try {

      const data = await fetchCustomer(phone);

      if (data.length > 0) {

        setCustomerName(data[0].name);
        setCustomerPoints(data[0].total_points);
        setIsExisting(true);

      } else {

        setCustomerName("");
        setCustomerPoints(0);
        setIsExisting(false);

      }

      setHasFetched(true);

    } catch {

      alert("Error fetching customer");

    }

  };

  // -----------------------------
  // Submit Transaction
  // -----------------------------

  const handleSubmit = async () => {

    if (!pumpId) {
      alert("Pump not found for attendant");
      return;
    }

    try {

      const data = {

        mobile_number: phone,
        name: customerName,
        pump: pumpId,
        fuel_type: fuelType,
        amount: getFinalPayable(),
        redeem_points: isRedeemApplied ? 1000 : 0

      };

      const res = await createTransaction(data);

      setTransactionDetails(res);
      setTransactionSuccess(true);

    } catch {

      alert("Transaction failed");

    }

  };

  // -----------------------------
  // Reset Transaction
  // -----------------------------

  const handleNewTransaction = () => {

    setPhone("");

    setCustomerName("");
    setCustomerPoints(0);

    setIsExisting(false);
    setHasFetched(false);

    setFuelType("");
    setAmount("");

    setQuantity(0);

    setIsRedeemApplied(false);

    setTransactionSuccess(false);
    setTransactionDetails(null);

  };

  // -----------------------------
  // Receipt Screen
  // -----------------------------

  if (transactionSuccess && transactionDetails) {

    return (

      <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">

        <div className="w-full max-w-[420px] bg-white rounded-2xl p-6 shadow-lg space-y-6">

          <h1 className="text-2xl font-bold text-green-600 text-center">
            Transaction Successful
          </h1>

          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Customer</span>
              <span>{customerName}</span>
            </div>

            <div className="flex justify-between">
              <span>Fuel Type</span>
              <span>{fuelType}</span>
            </div>

            <div className="flex justify-between">
              <span>Quantity</span>
              <span>{transactionDetails.quantity}</span>
            </div>

            <div className="flex justify-between">
              <span>Amount Paid</span>
              <span>₹{transactionDetails.amount}</span>
            </div>

            <div className="flex justify-between">
              <span>Points Used</span>
              <span>{transactionDetails.points_used}</span>
            </div>

            <div className="flex justify-between">
              <span>Points Earned</span>
              <span>{transactionDetails.points_earned}</span>
            </div>

          </div>

          <button
            onClick={handleNewTransaction}
            className="w-full bg-blue-500 text-white py-3 rounded-xl"
          >
            New Transaction
          </button>

        </div>

      </div>

    );

  }

  // -----------------------------
  // Main Screen
  // -----------------------------

  return (

    <div className="min-h-screen flex justify-center bg-gray-100 p-6">

      <div className="w-full max-w-[420px] bg-white p-6 rounded-2xl shadow-lg space-y-6">

        <h1 className="text-2xl font-bold">
          Fuel Transaction
        </h1>

        <CustomerLookup
          phone={phone}
          setPhone={setPhone}
          onFetch={handleFetchCustomer}
        />

        {hasFetched && (

          <div className="bg-blue-50 rounded-xl p-4">

            <div className="flex justify-between">

              <p className="text-sm text-gray-700">
                Customer: {isExisting ? customerName : "New Customer"}
              </p>

              <p className="text-sm text-orange-500">
                ⭐ {customerPoints} points
              </p>

            </div>

          </div>

        )}

        {hasFetched && !isExisting && (

          <input
            value={customerName}
            onChange={(e)=>setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="w-full border-b pb-2 outline-none"
          />

        )}

        <FuelSelector
          fuelType={fuelType}
          setFuelType={setFuelType}
        />

        {fuelType && fuelRates[fuelType] && (

          <div className="bg-blue-50 rounded-xl p-4 space-y-2">

            <div className="flex justify-between text-sm">

              <span>Fuel Price</span>
              <span>₹{fuelRates[fuelType]} / L</span>

            </div>

            <div className="flex justify-between text-sm">

              <span>Quantity</span>
              <span>{quantity.toFixed(2)} L</span>

            </div>

          </div>

        )}

        <AmountInput
          amount={amount}
          setAmount={setAmount}
        />

        {hasFetched && customerPoints >= 1000 && (

          <div className="bg-orange-50 rounded-xl p-4 space-y-2">

            <p className="text-sm text-gray-700">
              Available Points: ⭐ {customerPoints}
            </p>

            <p className="text-xs text-gray-500">
              1000 points = ₹100
            </p>

            <button
              onClick={()=>setIsRedeemApplied(!isRedeemApplied)}
              className={`w-full py-2 rounded-lg ${
                isRedeemApplied
                  ? "bg-orange-500 text-white"
                  : "border border-orange-500 text-orange-600"
              }`}
            >

              {isRedeemApplied ? "Redeem Applied ✓" : "Redeem ₹100"}

            </button>

          </div>

        )}

        {amount && (

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">

            <div className="flex justify-between text-sm">

              <span>Entered Amount</span>
              <span>₹{parseFloat(amount).toFixed(2)}</span>

            </div>

            {getRedeemDiscount() > 0 && (

              <div className="flex justify-between text-sm">

                <span>Redeem Discount</span>

                <span className="text-green-600">
                  - ₹{getRedeemDiscount()}
                </span>

              </div>

            )}

            <div className="border-t pt-2 flex justify-between">

              <span className="font-medium">
                Final Payable
              </span>

              <span className="font-medium">
                ₹{getFinalPayable().toFixed(2)}
              </span>

            </div>

          </div>

        )}

        {amount && (

          <div className="bg-green-50 rounded-xl p-4 text-center">

            <p className="text-sm text-gray-700">
              Points Earned
            </p>

            <p className="text-green-700 font-semibold">
              ⭐ +{getPointsEarned()} points
            </p>

          </div>

        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600"
        >
          Submit Transaction
        </button>

      </div>

    </div>

  );

}
