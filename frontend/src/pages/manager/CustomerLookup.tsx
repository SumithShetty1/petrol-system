import { useState } from "react";
import { User } from "lucide-react";
import { getCustomerByMobile } from "../../services/customerService";
import { getCustomerTransactions } from "../../services/transactionService";

import PageHeader from "../../components/common/header/PageHeader";
import CustomerSearchCard from "../../components/manager/customers/CustomerSearchCard";
import CustomerOverviewCard from "../../components/manager/customers/CustomerOverviewCard";
import TransactionTable from "../../components/common/transaction/TransactionTable";

export default function CustomerLookup() {
  const [phone, setPhone] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // -----------------------------------
  // INPUT
  // -----------------------------------
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
  };

  // -----------------------------------
  // SEARCH CUSTOMER
  // -----------------------------------
  const handleSearch = async () => {
    if (phone.length !== 10) {
      alert("Enter valid phone number");
      return;
    }

    setLoading(true);
    setSearchPerformed(true);
    setPage(1);

    try {
      const customerData = await getCustomerByMobile(phone);

      if (customerData.length > 0) {
        const customer = customerData[0];
        setSelectedCustomer(customer);

        const txnRes = await getCustomerTransactions(phone, 1, 20);

        setTransactions(txnRes.data);
        setTotalCount(txnRes.total);
        setHasNext(txnRes.hasNext);

      } else {
        setSelectedCustomer(null);
        setTransactions([]);
        setTotalCount(0);
        setHasNext(false);
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");

      setSelectedCustomer(null);
      setTransactions([]);
      setTotalCount(0);
      setHasNext(false);

    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // PAGINATION
  // -----------------------------------
  const handleNext = async () => {
    const nextPage = page + 1;
    setPage(nextPage);

    const res = await getCustomerTransactions(phone, nextPage, 20);

    setTransactions(res.data);
    setTotalCount(res.total);
    setHasNext(res.hasNext);
  };

  const handlePrevious = async () => {
    const prevPage = page - 1;
    setPage(prevPage);

    const res = await getCustomerTransactions(phone, prevPage, 20);

    setTransactions(res.data);
    setTotalCount(res.total);
    setHasNext(res.hasNext);
  };

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title="Customer Lookup" />

      {/* Search */}
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

      {/* Loading */}
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
              <p className="text-gray-500">
                No customer found with this number
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Data */}
      {!loading && selectedCustomer && (
        <div className="px-4 md:px-8 mt-6">
          <div className="max-w-5xl mx-auto space-y-4">

            <CustomerOverviewCard customer={selectedCustomer} />

            <TransactionTable
              transactions={transactions}
              title="Transaction History"
              totalCount={totalCount}
              currentPage={page}
              pageSize={20}
              showHeader={true}
              emptyMessage="No transactions found for this customer"
            />

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={page === 1}
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {page}
              </span>

              <button
                disabled={!hasNext}
                onClick={handleNext}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
