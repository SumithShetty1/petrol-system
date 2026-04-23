import { useState, useEffect } from "react";
import { createTransaction } from "../../services/transactionService";
import { fetchCustomer } from "../../services/customerService";
import { getFuelRates } from "../../services/fuelService";

import PageHeader from "../../components/common/PageHeader";
import PhoneInputSection from "../../components/attendant/transaction/PhoneInputSection";
import CustomerInfoCard from "../../components/attendant/transaction/CustomerInfoCard";
import CustomerNameInput from "../../components/attendant/transaction/CustomerNameInput";
import FuelTypeSelector from "../../components/attendant/transaction/FuelTypeSelector";
import AmountInput from "../../components/attendant/transaction/AmountInput";
import QuantityDisplay from "../../components/attendant/transaction/QuantityDisplay";
import RedemptionCard from "../../components/attendant/transaction/RedemptionCard";
import AmountBreakdown from "../../components/attendant/transaction/AmountBreakdown";
import PointsEarnedCard from "../../components/attendant/transaction/PointsEarnedCard";
import SubmitButton from "../../components/attendant/transaction/SubmitButton";
import TransactionSuccessScreen from "../../components/attendant/transaction/TransactionSuccessScreen";

export default function Transaction() {
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


  // Fetch Fuel Rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await getFuelRates();
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
  }, []);

  // Auto Quantity Calculation
  useEffect(() => {
    if (amount && fuelType && fuelRates[fuelType]) {
      const price = fuelRates[fuelType];
      const qty = parseFloat(amount) / price;
      setQuantity(qty);
    } else {
      setQuantity(0);
    }
  }, [amount, fuelType, fuelRates]);

  // Redeem Logic
  const getRedeemDiscount = () => {
    if (isRedeemApplied && customerPoints >= 1000) return 100;
    return 0;
  };

  const getFinalPayable = () => {
    const enteredAmount = parseFloat(amount) || 0;
    return Math.max(0, enteredAmount - getRedeemDiscount());
  };

  const getPointsEarned = () => {
    return Math.floor(getFinalPayable() * 0.1);
  };

  const canShowRedeem = () => {
    return parseFloat(amount || "0") >= 100;
  };

  // Fetch Customer
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

  // Submit Transaction
  const handleSubmit = async () => {
    try {
      const data = {
        mobile_number: phone,
        name: customerName,
        fuel_type: fuelType,
        amount: amount,
        redeem_points: isRedeemApplied ? 1000 : 0,
      };

      const res = await createTransaction(data);
      setTransactionDetails(res);
      setTransactionSuccess(true);
    } catch {
      alert("Transaction failed");
    }
  };

  // Reset Transaction
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

  const isSubmitDisabled = !customerName || !fuelType || !amount || getFinalPayable() < 0;

  // Success Screen
  if (transactionSuccess && transactionDetails) {
    return (
      <TransactionSuccessScreen
        transactionDetails={transactionDetails}
        onNewTransaction={handleNewTransaction}
      />
    );
  }

  // Main Transaction Screen
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Fuel Transaction" />

      <div className="px-4 md:px-8 -mt-10 md:-mt-12 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl md:rounded-4xl shadow-md p-6 md:p-8 space-y-3 md:space-y-3">

            <PhoneInputSection
              phone={phone}
              onPhoneChange={setPhone}
              onFetch={handleFetchCustomer}
            />

            {hasFetched && (
              <CustomerInfoCard
                customerName={customerName}
                customerPoints={customerPoints}
                isExisting={isExisting}
              />
            )}

            {hasFetched && !isExisting && (
              <CustomerNameInput
                customerName={customerName}
                onNameChange={setCustomerName}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {hasFetched && (
                <FuelTypeSelector
                  fuelType={fuelType}
                  onFuelTypeChange={setFuelType}
                  fuelRates={fuelRates}
                />
              )}

              {hasFetched && (
                <AmountInput
                  amount={amount}
                  onAmountChange={setAmount}
                />
              )}
            </div>

            {hasFetched && fuelType && fuelRates[fuelType] && (
              <QuantityDisplay quantity={quantity} />
            )}

            {hasFetched && customerPoints >= 1000 && (
              <RedemptionCard
                customerPoints={customerPoints}
                isRedeemApplied={isRedeemApplied}
                canRedeem={canShowRedeem()}
                onToggleRedeem={() => setIsRedeemApplied(!isRedeemApplied)}
              />
            )}

            {hasFetched && amount && (
              <AmountBreakdown
                amount={amount}
                redeemDiscount={getRedeemDiscount()}
                finalPayable={getFinalPayable()}
              />
            )}

            {hasFetched && amount && getFinalPayable() > 0 && (
              <PointsEarnedCard pointsEarned={getPointsEarned()} />
            )}

            {hasFetched && (
              <SubmitButton
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
