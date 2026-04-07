import { useState } from "react";

import CustomerLookup from "../components/transaction/CustomerLookup";
import FuelSelector from "../components/transaction/FuelSelector";
import AmountInput from "../components/transaction/AmountInput";
import TransactionSummary from "../components/transaction/TransactionSummary";

import { createTransaction } from "../services/transactionService";
import { fetchCustomer } from "../services/customerService";

export default function Transaction() {

  const [phone, setPhone] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPoints, setCustomerPoints] = useState(0);

  const [isExisting, setIsExisting] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [fuelType, setFuelType] = useState("");
  const [amount, setAmount] = useState("");

  const [isRedeemApplied, setIsRedeemApplied] = useState(false);

  const [result, setResult] = useState<any>(null);

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

    try {

      const data = {

        mobile_number: phone,
        name: customerName,
        pump: 1,
        fuel_type: fuelType,
        amount: amount,
        redeem_points: isRedeemApplied ? 1000 : 0

      };

      const res = await createTransaction(data);

      setResult(res);

    } catch {

      alert("Transaction failed");

    }

  };

  return (

    <div className="min-h-screen flex justify-center bg-gray-100 p-6">

      <div className="w-full max-w-[420px] bg-white p-6 rounded-2xl shadow-lg space-y-6">

        <h1 className="text-2xl font-bold">
          Fuel Transaction
        </h1>

        {/* Customer Lookup */}

        <CustomerLookup
          phone={phone}
          setPhone={setPhone}
          onFetch={handleFetchCustomer}
        />

        {/* Customer Card */}

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

        {/* Name Input for New Customer */}

        {hasFetched && !isExisting && (

          <input
            value={customerName}
            onChange={(e)=>setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="w-full border-b pb-2 outline-none"
          />

        )}

        {/* Fuel Selection */}

        <FuelSelector
          fuelType={fuelType}
          setFuelType={setFuelType}
        />

        {/* Amount */}

        <AmountInput
          amount={amount}
          setAmount={setAmount}
        />

        {/* Redeem UI */}

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

        {/* Final Payable */}

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

        {/* Points Earned */}

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

        {/* Submit */}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600"
        >
          Submit Transaction
        </button>

        {/* Result */}

        <TransactionSummary result={result} />

      </div>

    </div>

  );
}
