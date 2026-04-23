import { useEffect, useState } from "react";
import { getTransactions } from "../../services/transactionService";
import { getAttendants } from "../../services/employeeService";

import PageHeader from "../../components/common/PageHeader";
import DateFilterTabs from "../../components/common/DateFilterTabs";
import DateRangePicker from "../../components/common/DateRangePicker";

import { Filter } from "lucide-react"; 
import FilterPanel from "../../components/manager/transactions/FilterPanel";
import TransactionTable from "../../components/common/TransactionTable";

export type DateFilter = "today" | "week" | "month" | "year" | "custom";

export default function PumpTransactions() {
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

  const fetchFilteredTransactions = async (
    range: DateFilter,
    customStart?: string,
    customEnd?: string,
    attendant?: string,
    fuel?: string
  ) => {
    const data = await getTransactions(
      range,
      customStart,
      customEnd,
      attendant || attendantFilter,
      fuel || fuelTypeFilter
    );

    setTransactions(data);
    setFilteredTransactions(data);
  };

  const handleAttendantChange = async (value: string) => {
    setAttendantFilter(value);
    await fetchFilteredTransactions(dateFilter, startDate, endDate, value, fuelTypeFilter);
  };

  const handleFuelChange = async (value: string) => {
    setFuelTypeFilter(value);
    await fetchFilteredTransactions(dateFilter, startDate, endDate, attendantFilter, value);
  };

  const handleFilterChange = async (filter: DateFilter) => {
    setDateFilter(filter);

    if (filter === "custom") {
      setShowCustomDatePicker(true);
      return;
    }

    setShowCustomDatePicker(false);
    await fetchFilteredTransactions(filter, startDate, endDate, attendantFilter, fuelTypeFilter);
  };

  const handleCustomDateSubmit = async () => {
    if (!startDate || !endDate) return;

    await fetchFilteredTransactions("custom", startDate, endDate, attendantFilter, fuelTypeFilter);
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
    setShowFilters(false);
    await fetchFilteredTransactions(dateFilter, startDate, endDate, "all", "all");
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
      <PageHeader
        title="Transaction History"
        rightAction={
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-md hover:bg-gray-100 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        }
      />

      {showFilters && (
        <FilterPanel
          attendants={attendants}
          attendantFilter={attendantFilter}
          fuelTypeFilter={fuelTypeFilter}
          onAttendantChange={handleAttendantChange}
          onFuelChange={handleFuelChange}
          onClearFilters={clearFilters}
        />
      )}

      <DateFilterTabs
        className="px-6 mt-4"
        value={dateFilter}
        onChange={handleFilterChange}
      />

      {showCustomDatePicker && (
        <DateRangePicker
          className="px-6 mt-4"
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSubmit={handleCustomDateSubmit}
          onCancel={handleCancelCustomDate}
        />
      )}

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

      <div className="px-6 mt-4">
        <TransactionTable
          transactions={filteredTransactions}
          totalCount={transactions.length}
          hasActiveFilters={fuelTypeFilter !== "all" || attendantFilter !== "all"}
          onClearFilters={clearFilters}
          showHeader={false}
        />
      </div>
    </div>
  );
}
