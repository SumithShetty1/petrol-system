import { useEffect, useRef, useState } from "react";
import { Filter } from "lucide-react";

import { getOwnerTransactions } from "../../services/transactionService";
import { getPumps } from "../../services/pumpService";

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

type Pump = {
  id: number;
  pump_name: string;
  pump_code: string;
};

export default function OwnerTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pumps, setPumps] = useState<Pump[]>([]);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  const [pageError, setPageError] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);

  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [showFilters, setShowFilters] = useState(false);

  const [pumpFilter, setPumpFilter] = useState("all");
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
      setTableError(null);

      const res = await getOwnerTransactions(
        dateFilter,
        page,
        20,
        startDate,
        endDate,
        pumpFilter,
        fuelTypeFilter
      );

      if (requestId !== requestIdRef.current) return;

      setTransactions(res.data);
      setTotalCount(res.total);
      setHasNext(!!res.next);

    } catch (err: any) {
      console.error(err);
      setTableError(
        err?.response?.data?.detail ||
        "Failed to load transactions."
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setTableLoading(false);
      }
    }
  };

  // -----------------------------------
  // INITIAL LOAD
  // -----------------------------------
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setPageError(null);

      const [txnRes, pumpsData] = await Promise.all([
        getOwnerTransactions("today", 1, 20, "", "", "all", "all"),
        getPumps(),
      ]);

      setTransactions(txnRes.data);
      setTotalCount(txnRes.total);
      setHasNext(!!txnRes.next);
      setPumps(pumpsData);

    } catch (err: any) {
      console.error(err);
      setPageError(
        err?.response?.data?.detail ||
        "Failed to load page data."
      );
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

    if (dateFilter === "custom" && (!startDate || !endDate)) {
      return;
    }

    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    fetchTransactions();
  }, [dateFilter, pumpFilter, fuelTypeFilter, page]);

  // -----------------------------------
  // DATE FILTER
  // -----------------------------------
  const handleDateFilterChange = (filter: DateFilter) => {
    skipNextFetch.current = false;
    setTableError(null);

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
  // -----------------------------------
  // CUSTOM DATE
  // -----------------------------------
  const handleCustomDateSubmit = () => {
    if (!startDate || !endDate) {
      setTableError("Please select both dates.");
      return;
    }

    if (endDate < startDate) {
      setTableError("End date cannot be before start date.");
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
    selectedPump: string,
    selectedFuel: string
  ) => {
    setPumpFilter(selectedPump);
    setFuelTypeFilter(selectedFuel);
    setPage(1);
    setShowFilters(false);
  };

  // -----------------------------------
  // CLEAR FILTERS
  // -----------------------------------
  const clearFilters = () => {
    setPumpFilter("all");
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
  // PAGE ERROR (BLOCKING)
  // -----------------------------------
  if (pageError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
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

      {/* TABLE ERROR */}
      {tableError && (
        <div className="px-6 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 flex justify-between">
            <span>{tableError}</span>
            <button
              onClick={fetchTransactions}
              className="text-blue-600 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {showFilters && (
        <FilterPanel
          primaryLabel="Pump"
          primaryValue={pumpFilter}
          primaryOptions={pumps.map((pump) => ({
            label: `${pump.pump_name} (${pump.pump_code})`,
            value: pump.pump_code,
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
          isLoading={tableLoading}
          hasActiveFilters={
            pumpFilter !== "all" ||
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
