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
  const [pageError, setPageError] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);

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
  // FETCH TRANSACTIONS
  // -----------------------------------
  const fetchTransactions = async () => {
    const requestId = ++requestIdRef.current;

    try {
      setTableError(null);

      const res = await getTransactions(
        dateFilter,
        page,
        20,
        startDate,
        endDate,
        attendantFilter,
        fuelTypeFilter,
        undefined
      );

      if (requestId !== requestIdRef.current) return;

      setTransactions(res.data);
      setTotalCount(res.total);
      setHasNext(res.hasNext);

    } catch (error) {
      console.error(error);
      setTableError("Failed to load transactions.");
    }
  };

  // -----------------------------------
  // INITIAL LOAD
  // -----------------------------------
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setPageError(null);

      const [txnRes, attendantsData] = await Promise.all([
        getTransactions("today", 1, 20, "", "", "all", "all", undefined),
        getAttendants(),
      ]);

      setTransactions(txnRes.data);
      setTotalCount(txnRes.total);
      setHasNext(txnRes.hasNext);
      setAttendants(attendantsData);

    } catch (error) {
      console.error(error);
      setPageError("Failed to load page data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // -----------------------------------
  // AUTO FETCH
  // -----------------------------------
  useEffect(() => {
    if (loading) return;

    if (dateFilter === "custom" && (!startDate || !endDate)) return;

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
      setFilterError("Please select both dates.");
      return;
    }

    if (endDate < startDate) {
      setFilterError("End date cannot be before start date.");
      return;
    }

    setFilterError(null);

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
    setFilterError(null);
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
  // LOADING (BLOCKING)
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading transactions...
      </div>
    );
  }

  // -----------------------------------
  // PAGE ERROR (BLOCKING)
  // -----------------------------------
  if (pageError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{pageError}</p>
        <button
          onClick={loadInitialData}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
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

      {/* FILTER ERROR */}
      {filterError && (
        <div className="px-6 mt-4 text-red-600 text-sm">
          {filterError}
        </div>
      )}

      {/* TABLE ERROR */}
      {tableError && (
        <div className="px-6 mt-4 bg-red-50 border text-red-600 rounded-lg p-3 flex justify-between">
          <span>{tableError}</span>
          <button onClick={fetchTransactions} className="text-blue-600">
            Retry
          </button>
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

        <TransactionTable
          transactions={transactions}
          totalCount={totalCount}
          currentPage={page}
          pageSize={20}
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
