import { useEffect, useState } from "react";
import { Droplet, Calendar, X, MapPin, Filter } from "lucide-react";
import { getTransactions, getAttendants } from "../services/managerService";


type DateFilter = "today" | "week" | "month" | "year" | "custom";

export default function ManagerTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [showFilters, setShowFilters] = useState(false);

  const [attendants, setAttendants] = useState<any[]>([]);
  const [attendantFilter, setAttendantFilter] = useState<string>("all");

  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>("all");

  // Custom date range state
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const [txnData, attendantsData] = await Promise.all([
          getTransactions("today"),
          getAttendants(),
        ]);

        setTransactions(txnData);
        setFilteredTransactions(txnData);
        setAttendants(attendantsData);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const handleAttendantChange = async (value: string) => {
    setAttendantFilter(value);

    const data = await getTransactions(
      dateFilter,
      startDate,
      endDate,
      value,
      fuelTypeFilter
    );

    setTransactions(data);
    setFilteredTransactions(data);
  };

  const handleFuelChange = async (value: string) => {
    setFuelTypeFilter(value);

    const data = await getTransactions(
      dateFilter,
      startDate,
      endDate,
      attendantFilter,
      value
    );

    setTransactions(data);
    setFilteredTransactions(data);
  };

  const handleFilterChange = async (filter: DateFilter) => {
    setDateFilter(filter);

    if (filter === "custom") {
      setShowCustomDatePicker(true);
      return;
    }

    const data = await getTransactions(
      filter,
      startDate,
      endDate,
      attendantFilter,
      fuelTypeFilter
    );

    setTransactions(data);
    setFilteredTransactions(data);
  };

  const handleCustomDateSubmit = async () => {
    if (!startDate || !endDate) return;

    const data = await getTransactions(
      "custom",
      startDate,
      endDate,
      attendantFilter,
      fuelTypeFilter
    );

    setTransactions(data);
    setFilteredTransactions(data);
    setShowCustomDatePicker(false);
  };

  const handleCancelCustomDate = () => {
    setShowCustomDatePicker(false);
    setDateFilter("today");
    setStartDate("");
    setEndDate("");
  };

  const clearFilters = async () => {
    setAttendantFilter("all");
    setFuelTypeFilter("all");

    const data = await getTransactions(
      dateFilter,
      startDate,
      endDate,
      "all",
      "all"
    );

    setTransactions(data);
    setFilteredTransactions(data);

    setShowFilters(false);
  };

  const today = new Date().toISOString().split('T')[0];

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return { date: "—", time: "—" };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Helper function to get fuel type display name
  const getFuelTypeDisplay = (fuelType: string) => {
    return fuelType === "petrol" ? "Petrol" : fuelType === "diesel" ? "Diesel" : fuelType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading transactions...</div>
      </div>
    );
  }

  const FILTERS: DateFilter[] = ["today", "week", "month", "year", "custom"];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-lg font-medium">
              Transactions
            </h1>
            <p className="text-white/80 text-xs">
              {filteredTransactions.length} transactions
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="px-6 mt-4">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 font-medium">Filters</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-2">
                  Attendant
                </label>

                <select
                  value={attendantFilter}
                  onChange={(e) => handleAttendantChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="all">All Attendants</option>

                  {attendants.map((att) => (
                    <option key={att.id} value={att.id}>
                      {att.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-2">
                  Fuel Type
                </label>
                <select
                  value={fuelTypeFilter}
                  onChange={(e) => handleFuelChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full py-2 text-sm text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Filter */}
      <div className="px-6 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${dateFilter === filter
                ? "bg-blue-500 text-white shadow-md"
                : "border border-blue-500 text-blue-600 hover:bg-blue-50"
                }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Picker */}
      {showCustomDatePicker && (
        <div className="px-6 mt-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Select Date Range</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate || today}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={today}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCustomDateSubmit}
                disabled={!startDate || !endDate}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Apply
              </button>
              <button
                onClick={handleCancelCustomDate}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Range Info */}
      {dateFilter === "custom" && !showCustomDatePicker && startDate && endDate && (
        <div className="px-6 mt-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-sm text-blue-700">
              Showing data from <span className="font-medium">{startDate}</span> to{" "}
              <span className="font-medium">{endDate}</span>
            </p>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="px-6 mt-4">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <p className="text-gray-500">No transactions found</p>
            {(fuelTypeFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-2 text-blue-500 text-sm hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1800px]">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-3 py-3 text-center text-xs whitespace-nowrap">Sl No</th>
                    <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Customer Name</th>
                    <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Customer Mobile</th>
                    <th className="px-3 py-3 text-left text-xs whitespace-nowrap">Fuel Type</th>
                    <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Amount (₹)</th>
                    <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Quantity (L)</th>
                    <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Credit Redeemed</th>
                    <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Credit Earned</th>
                    <th className="px-3 py-3 text-right text-xs whitespace-nowrap">Remaining Points</th>
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
                  {filteredTransactions.map((transaction, index) => {
                    const { date, time } = formatDate(transaction.created_at);
                    return (
                      <tr
                        key={transaction.id}
                        className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                      >
                        {/* Serial Number */}
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <span className="text-gray-500 text-xs">{index + 1}</span>
                        </td>

                        {/* Customer Name */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className="text-gray-900 font-medium text-xs">
                            {transaction.customer_name || "—"}
                          </p>
                        </td>

                        {/* Customer Mobile */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className="text-gray-500 text-xs">
                            {transaction.customer_mobile || "—"}
                          </p>
                        </td>

                        {/* Fuel Type */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Droplet
                              className={`w-3 h-3 ${transaction.fuel_type === "petrol"
                                ? "text-blue-500"
                                : "text-orange-500"
                                }`}
                            />
                            <span
                              className={`text-xs font-medium ${transaction.fuel_type === "petrol"
                                ? "text-blue-700"
                                : "text-orange-700"
                                }`}
                            >
                              {getFuelTypeDisplay(transaction.fuel_type)}
                            </span>
                          </div>
                        </td>

                        {/* Amount (Final Amount) */}
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <span className="text-gray-900 font-medium text-xs">
                            ₹{parseFloat(transaction.final_amount || 0).toFixed(2)}
                          </span>
                        </td>

                        {/* Quantity */}
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <span className="text-gray-700 text-xs">
                            {parseFloat(transaction.quantity || 0).toFixed(2)}
                          </span>
                        </td>

                        {/* Credit Redeemed */}
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          {parseFloat(transaction.points_used || 0) > 0 ? (
                            <span className="text-orange-600 font-medium text-xs">
                              ⭐ {parseFloat(transaction.points_used).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>

                        {/* Credit Earned */}
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          {parseFloat(transaction.points_earned || 0) > 0 ? (
                            <span className="text-green-600 font-medium text-xs">
                              ⭐ {parseFloat(transaction.points_earned).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>

                        {/* Remaining Credit Points */}
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <span className="text-blue-600 font-medium text-xs">
                            ⭐ {transaction.remaining_points || 0}
                          </span>
                        </td>

                        {/* Original Amount */}
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <span className="text-gray-500 text-xs">
                            ₹{parseFloat(transaction.original_amount || 0).toFixed(2)}
                          </span>
                        </td>

                        {/* Final Amount */}
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <span className="text-gray-900 font-medium text-xs">
                            ₹{parseFloat(transaction.final_amount || 0).toFixed(2)}
                          </span>
                        </td>

                        {/* Pump Name */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className="text-gray-700 text-xs">
                            {transaction.pump_name || "—"}
                          </p>
                        </td>

                        {/* Location */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600 text-xs">
                              {transaction.pump_location || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Attendant Name */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className="text-gray-700 text-xs">
                            {transaction.attendant_name || "—"}
                          </p>
                        </td>

                        {/* Attendant Phone */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className="text-gray-500 text-xs">
                            {transaction.attendant_phone || "—"}
                          </p>
                        </td>

                        {/* Manager Name */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className="text-gray-700 text-xs">
                            {transaction.manager_name || "—"}
                          </p>
                        </td>

                        {/* Manager Number */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className="text-gray-500 text-xs">
                            {transaction.manager_phone || "—"}
                          </p>
                        </td>

                        {/* Date & Time */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-xs">
                            <p className="text-gray-700">{date}</p>
                            <p className="text-gray-500">{time}</p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer - Summary */}
            <div className="bg-gray-50 px-4 py-3 border-t-2 border-blue-500">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-gray-600">
                  Showing {filteredTransactions.length} transaction
                  {filteredTransactions.length !== 1 ? "s" : ""}
                  {transactions.length !== filteredTransactions.length &&
                    ` (filtered from ${transactions.length})`
                  }
                  {" • "}Scroll horizontally to view all columns
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
