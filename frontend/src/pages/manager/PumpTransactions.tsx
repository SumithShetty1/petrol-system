import { useEffect, useRef, useState } from "react";
import { Filter } from "lucide-react";

import { getTransactions } from "../../services/transactionService";
import { getAttendants } from "../../services/employeeService";

import PageHeader from "../../components/common/header/PageHeader";
import DateFilterTabs from "../../components/common/dateFilter/DateFilterTabs";
import DateRangePicker from "../../components/common/dateFilter/DateRangePicker";
import TransactionTable from "../../components/common/transaction/TransactionTable";
import FilterPanel from "../../components/common/filterPanel/FilterPanel";

export type DateFilter =
  | "today"
  | "week"
  | "month"
  | "year"
  | "custom";

type Transaction = {
  id: number;
  fuel_type: string;
  amount?: number;
};

type Attendant = {
  first_name: string;
  last_name: string;
  phone: string;
};

export default function PumpTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [attendants, setAttendants] = useState<Attendant[]>([]);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState("");

  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [showFilters, setShowFilters] = useState(false);

  const [attendantFilter, setAttendantFilter] = useState("all");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("all");

  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const requestIdRef = useRef(0);
  const skipNextFetch = useRef(false);

  // -----------------------------------
  // FETCH TRANSACTIONS (SINGLE SOURCE)
  // -----------------------------------
  const fetchTransactions = async () => {
    const requestId = ++requestIdRef.current;

    try {
      setTableLoading(true);
      setError("");

      const res = await getTransactions(
        dateFilter,
        page,
        20,
        startDate,
        endDate,
        attendantFilter,
        fuelTypeFilter,
        undefined // no pump filter here
      );

      if (requestId !== requestIdRef.current) return;

      setTransactions(res.data);
      setTotalCount(res.total);
      setHasNext(res.hasNext);

    } catch (error) {
      console.error(error);
      setError("Failed to load transactions.");
    } finally {
      if (requestId === requestIdRef.current) {
        setTableLoading(false);
      }
    }
  };

  // -----------------------------------
  // INITIAL LOAD
  // -----------------------------------
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const [txnRes, attendantsData] = await Promise.all([
          getTransactions(
            "today",
            1,
            20,
            "",
            "",
            "all",
            "all",
            undefined
          ),
          getAttendants(),
        ]);

        setTransactions(txnRes.data);
        setTotalCount(txnRes.total);
        setHasNext(txnRes.hasNext);
        setAttendants(attendantsData);

      } catch (error) {
        console.error(error);
        setError("Failed to load page data.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // -----------------------------------
  // AUTO FETCH
  // -----------------------------------
  useEffect(() => {
    if (loading) return;

    if (dateFilter === "custom" && (!startDate || !endDate)) {
      return;
    }

    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    fetchTransactions();
  }, [dateFilter, attendantFilter, fuelTypeFilter, page]);

  // -----------------------------------
  // DATE FILTER
  // -----------------------------------
  const handleDateFilterChange = (filter: DateFilter) => {
    skipNextFetch.current = false;
    
    setDateFilter(filter);

    if (filter === "custom") {
      setShowCustomDatePicker(true);
      return;
    }

    setShowCustomDatePicker(false);
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // -----------------------------------
  // CUSTOM DATE SUBMIT
  // -----------------------------------
  const handleCustomDateSubmit = () => {
    if (!startDate || !endDate) {
      setError("Please select both dates.");
      return;
    }

    if (endDate < startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    setDateFilter("custom");
    setPage(1);
    setShowCustomDatePicker(false);

    skipNextFetch.current = true;
    fetchTransactions();
  };

  // -----------------------------------
  // CANCEL CUSTOM
  // -----------------------------------
  const handleCancelCustomDate = () => {
    setShowCustomDatePicker(false);
    setDateFilter("today");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // -----------------------------------
  // APPLY FILTERS
  // -----------------------------------
  const handleApplyFilters = (
    selectedAttendant: string,
    selectedFuel: string
  ) => {
    setAttendantFilter(selectedAttendant);
    setFuelTypeFilter(selectedFuel);
    setPage(1);
    setShowFilters(false);
  };

  // -----------------------------------
  // CLEAR FILTERS
  // -----------------------------------
  const clearFilters = () => {
    setAttendantFilter("all");
    setFuelTypeFilter("all");
    setPage(1);
    setShowFilters(false);
  };

  // -----------------------------------
  // LOADING UI
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading transactions...
        </div>
      </div>
    );
  }

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="Transaction History"
        rightAction={
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-md hover:bg-gray-100"
          >
            <Filter className="w-5 h-5" />
          </button>
        }
      />

      {error && (
        <div className="px-6 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        </div>
      )}

      {showFilters && (
        <FilterPanel
          primaryLabel="Attendant"
          primaryValue={attendantFilter}
          primaryOptions={attendants.map((attendant) => ({
            label: `${attendant.first_name} ${attendant.last_name}`,
            value: attendant.phone,
          }))}
          fuelTypeFilter={fuelTypeFilter}
          onApply={handleApplyFilters}
          onClearFilters={clearFilters}
        />
      )}

      <DateFilterTabs
        className="px-6 mt-4"
        value={dateFilter}
        onChange={handleDateFilterChange}
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

      <div className="px-6 mt-4">
        {tableLoading && (
          <div className="mb-3 text-sm text-gray-500">
            Refreshing transactions...
          </div>
        )}

        <TransactionTable
          transactions={transactions}
          totalCount={totalCount}
          currentPage={page}
          pageSize={20}
          isLoading={tableLoading}
          hasActiveFilters={
            attendantFilter !== "all" ||
            fuelTypeFilter !== "all"
          }
          onClearFilters={clearFilters}
          showHeader={false}
        />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page}
          </span>

          <button
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}