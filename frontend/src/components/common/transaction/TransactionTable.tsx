import { Calendar } from "lucide-react";
import TransactionTableRow from "./TransactionTableRow";

type Props = {
  transactions: any[];
  title?: string;
  totalCount?: number;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  emptyMessage?: string;
  showHeader?: boolean;
};

export default function TransactionTable({
  transactions,
  title = "Transaction History",
  totalCount,
  hasActiveFilters = false,
  onClearFilters,
  emptyMessage = "No transactions found",
  showHeader = true,
}: Props) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {showHeader && (
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-gray-900 font-semibold">{title}</h3>
          </div>
        )}

        <div className="p-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>

          {hasActiveFilters && onClearFilters && (
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
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {showHeader && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />

          <h3 className="text-gray-900 font-semibold">
            {title}
          </h3>

        </div>
      )}

      {/* Table */}
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
              <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Pump ID</th>
              <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Pump Name</th>
              <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Location</th>
              <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Attendant Name</th>
              <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Attendant Mobile</th>
              <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Manager Name</th>
              <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Manager Mobile</th>
              <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Date & Time</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction, index) => (
              <TransactionTableRow
                key={transaction.id}
                transaction={transaction}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t-2 border-blue-500">
        <p className="text-xs text-gray-600">
          Showing {transactions.length} transaction
          {transactions.length !== 1 ? "s" : ""}

          {totalCount && totalCount !== transactions.length &&
            ` (filtered from ${totalCount})`}

          {" • "}Scroll horizontally to view all columns
        </p>
      </div>
    </div>
  );
}
