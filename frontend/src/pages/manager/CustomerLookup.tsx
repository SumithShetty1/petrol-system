import { useState } from "react";
import { User } from "lucide-react";
import { getCustomerByMobile, getCustomerTransactions } from "../../services/customerService";

import PageHeader from "../../components/common/PageHeader";
import CustomerSearchCard from "../../components/manager/customers/CustomerSearchCard";
import CustomerOverviewCard from "../../components/manager/customers/CustomerOverviewCard";
import TransactionTable from "../../components/common/TransactionTable";

export default function CustomerLookup() {
  const [phone, setPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerTransactions, setCustomerTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
  };

  const handleSearch = async () => {
    if (phone.length !== 10) {
      alert("Enter valid phone number");
      return;
    }

    setLoading(true);
    setSearchPerformed(true);

    try {
      const customerData = await getCustomerByMobile(phone);

      if (customerData.length > 0) {
        const customer = customerData[0];
        setSelectedCustomer(customer);

        const transactions = await getCustomerTransactions(phone);
        setCustomerTransactions(transactions);
      } else {
        setSelectedCustomer(null);
        setCustomerTransactions([]);
      }
    } catch (error) {
      console.error("Customer lookup failed:", error);
      alert("Something went wrong. Please try again.");
      setSelectedCustomer(null);
      setCustomerTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="Customer Lookup"
      />

      {/* Search Card */}
      <div className="px-4 md:px-8 -mt-10 md:-mt-12 relative z-20">
        <div className="max-w-5xl mx-auto">
          <CustomerSearchCard
            phone={phone}
            loading={loading}
            onPhoneChange={handlePhoneChange}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="px-4 md:px-8 mt-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <p className="text-gray-500">Searching customer...</p>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && searchPerformed && !selectedCustomer && (
        <div className="px-4 md:px-8 mt-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No customer found with this number</p>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details */}
      {!loading && selectedCustomer && (
        <div className="px-4 md:px-8 mt-6">
          <div className="max-w-5xl mx-auto space-y-4">
            <CustomerOverviewCard customer={selectedCustomer} />

            <TransactionTable
              transactions={customerTransactions}
              title="Transaction History"
              emptyMessage="No transactions found for this customer"
              showHeader={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
