import { useState, useEffect } from "react";
import { createTransaction } from "../../services/transactionService";
import { getCustomerByMobile } from "../../services/customerService";
import { getFuelRates } from "../../services/fuelService";

import PageHeader from "../../components/common/header/PageHeader";
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
  const [canRedeemWeekly, setCanRedeemWeekly] = useState(true);
  const [nextRedeemDate, setNextRedeemDate] = useState<string | null>(null);

  const [isExisting, setIsExisting] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [fuelType, setFuelType] = useState("");
  const [amount, setAmount] = useState("");
  const [fuelRates, setFuelRates] = useState<any>({});
  const [quantity, setQuantity] = useState(0);

  const [isRedeemApplied, setIsRedeemApplied] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

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

  useEffect(() => {
    const amountValue = parseFloat(amount || "0");

    if (
      isRedeemApplied &&
      (
        amountValue < 100 ||
        customerPoints < 1000 ||
        !canRedeemWeekly
      )
    ) {
      setIsRedeemApplied(false);
    }
  }, [amount, customerPoints, canRedeemWeekly, isRedeemApplied]);

  // Redeem Logic
  const getRedeemDiscount = () => {
    const amountValue = parseFloat(amount || "0");

    if (
      isRedeemApplied &&
      amountValue >= 100 &&
      customerPoints >= 1000 &&
      canRedeemWeekly
    ) {
      return 100;
    }
    return 0;
  };

  const getFinalPayable = () => {
    const enteredAmount = parseFloat(amount) || 0;
    return Math.max(0, enteredAmount - getRedeemDiscount());
  };

  const getPointsEarned = () => {
    return Number((getFinalPayable() * 0.1).toFixed(2));
  };

  const canShowRedeem = () => {
    return (
      parseFloat(amount || "0") >= 100 &&
      customerPoints >= 1000 &&
      canRedeemWeekly
    );
  };

  // Fetch Customer
  const handleFetchCustomer = async () => {
    setFetchError("");
    setIsFetching(true);

    if (phone.length !== 10) {
      setFetchError("Enter a valid 10-digit phone number");
      return;
    }

    try {
      const data = await getCustomerByMobile(phone);

      if (data.length > 0) {
        const customer = data[0];

        setCustomerName(customer.name);
        setCustomerPoints(customer.total_points);
        setCanRedeemWeekly(customer.can_redeem);
        setNextRedeemDate(customer.next_redeem_at);
        setIsRedeemApplied(false);
        setIsExisting(true);
      } else {
        setCustomerName("");
        setCustomerPoints(0);
        setIsExisting(false);
        setCanRedeemWeekly(true);
        setNextRedeemDate(null);
        setIsRedeemApplied(false);
      }

      setHasFetched(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        "Failed to fetch customer. Try again.";

      setFetchError(message);
    } finally {
      setIsFetching(false);
    }
  };

  // Submit Transaction
  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const data = {
        mobile_number: phone,
        name: customerName,
        fuel_type: fuelType,
        amount: amount,
        redeem_points:
          isRedeemApplied &&
            canRedeemWeekly &&
            parseFloat(amount || "0") >= 100
            ? 1000
            : 0,
      };

      const res = await createTransaction(data);

      setTransactionDetails(res);
      setTransactionSuccess(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Transaction failed. Please try again.";

      setError(message);
    } finally {
      setIsSubmitting(false);
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

  const isSubmitDisabled =
    !customerName ||
    !fuelType ||
    !amount ||
    (isRedeemApplied && !canRedeemWeekly);

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
              onPhoneChange={(val) => {
                setPhone(val);
                setFetchError("");
                setError("");
              }}
              onFetch={handleFetchCustomer}
              loading={isFetching}
            />

            {fetchError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                {fetchError}
              </div>
            )}

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
                onNameChange={(val) => {
                  setCustomerName(val);
                  setError("");
                }}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {hasFetched && (
                <FuelTypeSelector
                  fuelType={fuelType}
                  onFuelTypeChange={(val) => {
                    setFuelType(val);
                    setError("");
                  }}
                  fuelRates={fuelRates}
                />
              )}

              {hasFetched && (
                <AmountInput
                  amount={amount}
                  onAmountChange={(val) => {
                    setAmount(val);
                    setError("");
                  }}
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
                nextRedeemDate={nextRedeemDate}
                canRedeemWeekly={canRedeemWeekly}
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


            {hasFetched && error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {hasFetched && (
              <SubmitButton
                onClick={handleSubmit}
                disabled={isSubmitDisabled || isSubmitting}
                loading={isSubmitting}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
