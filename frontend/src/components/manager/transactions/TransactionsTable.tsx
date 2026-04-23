import TransactionTableRow from "./TransactionTableRow";

type Props = {
  transactions: any[];
  filteredTransactions: any[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export default function TransactionsTable({
  transactions,
  filteredTransactions,
  hasActiveFilters,
  onClearFilters,
}: Props) {
  if (filteredTransactions.length === 0) {
    return (
      <div className="px-6 mt-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-md">
          <p className="text-gray-500">No transactions found</p>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="mt-2 text-blue-500 text-sm hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 mt-4">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1800px]">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-3 py-3 text-center text-xs whitespace-nowrap">Sl No</th>
                <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Customer Name</th>
                <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Customer Mobile</th>
                <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Fuel Type</th>
                <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Quantity (L)</th>
                <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Credit Redeemed</th>
                <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Credit Earned</th>
                <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Remaining Credit</th>
                <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Original Amt (₹)</th>
                <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Final Amt (₹)</th>
                <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Pump Name</th>
                <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Location</th>
                <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Attendant Name</th>
                <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Attendant Phone</th>
                <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Manager Name</th>
                <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Manager Number</th>
                <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <TransactionTableRow
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-4 py-3 border-t-2 border-blue-500">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-gray-600">
              Showing {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1 ? "s" : ""}
              {transactions.length !== filteredTransactions.length &&
                ` (filtered from ${transactions.length})`}
              {" • "}Scroll horizontally to view all columns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
