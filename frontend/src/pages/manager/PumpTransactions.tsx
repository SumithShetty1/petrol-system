import { useEffect, useRef, useState } from "react";
import { Filter } from "lucide-react";

import {
  getTransactions,
} from "../../services/transactionService";

import {
  getAttendants,
} from "../../services/employeeService";

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
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [attendants, setAttendants] =
    useState<Attendant[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [tableLoading, setTableLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState<DateFilter>("today");

  const [showFilters, setShowFilters] =
    useState(false);

  // Applied filters
  const [attendantFilter, setAttendantFilter] =
    useState("all");

  const [fuelTypeFilter, setFuelTypeFilter] =
    useState("all");

  // Custom dates
  const [showCustomDatePicker, setShowCustomDatePicker] =
    useState(false);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  // Prevent stale responses
  const requestIdRef = useRef(0);

  // -----------------------------------
  // FETCH TRANSACTIONS
  // -----------------------------------
  const fetchTransactions = async (
    range: DateFilter = dateFilter,
    customStart: string = startDate,
    customEnd: string = endDate,
    attendant: string = attendantFilter,
    fuel: string = fuelTypeFilter
  ) => {
    const requestId =
      ++requestIdRef.current;

    try {
      setTableLoading(true);
      setError("");

      const data =
        await getTransactions(
          range,
          customStart,
          customEnd,
          attendant,
          fuel
        );

      if (
        requestId !==
        requestIdRef.current
      ) {
        return;
      }

      setTransactions(data);
    } catch (error) {
      console.error(error);
      setError(
        "Failed to load transactions."
      );
    } finally {
      if (
        requestId ===
        requestIdRef.current
      ) {
        setTableLoading(false);
      }
    }
  };

  // -----------------------------------
  // INITIAL LOAD
  // -----------------------------------
  useEffect(() => {
    const loadInitialData =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            txnData,
            attendantsData,
          ] =
            await Promise.all([
              getTransactions(
                "today"
              ),
              getAttendants(),
            ]);

          setTransactions(txnData);
          setAttendants(
            attendantsData
          );
        } catch (error) {
          console.error(error);
          setError(
            "Failed to load page data."
          );
        } finally {
          setLoading(false);
        }
      };

    loadInitialData();
  }, []);

  // -----------------------------------
  // DATE FILTER CHANGE
  // -----------------------------------
  const handleDateFilterChange =
    async (
      filter: DateFilter
    ) => {
      setDateFilter(filter);

      if (
        filter === "custom"
      ) {
        setShowCustomDatePicker(
          true
        );
        return;
      }

      setShowCustomDatePicker(
        false
      );

      await fetchTransactions(
        filter,
        "",
        "",
        attendantFilter,
        fuelTypeFilter
      );
    };

  // -----------------------------------
  // CUSTOM DATE SUBMIT
  // -----------------------------------
  const handleCustomDateSubmit =
    async () => {
      if (
        !startDate ||
        !endDate
      ) {
        setError(
          "Please select both dates."
        );
        return;
      }

      if (
        endDate < startDate
      ) {
        setError(
          "End date cannot be before start date."
        );
        return;
      }

      setDateFilter("custom");

      await fetchTransactions(
        "custom",
        startDate,
        endDate,
        attendantFilter,
        fuelTypeFilter
      );

      setShowCustomDatePicker(
        false
      );
    };

  // -----------------------------------
  // CANCEL CUSTOM
  // -----------------------------------
  const handleCancelCustomDate =
    async () => {
      setShowCustomDatePicker(
        false
      );

      setDateFilter("today");

      setStartDate("");
      setEndDate("");

      await fetchTransactions(
        "today",
        "",
        "",
        attendantFilter,
        fuelTypeFilter
      );
    };

  // -----------------------------------
  // APPLY FILTERS
  // -----------------------------------
  const handleApplyFilters =
    async (
      selectedAttendant: string,
      selectedFuel: string
    ) => {
      setAttendantFilter(
        selectedAttendant
      );

      setFuelTypeFilter(
        selectedFuel
      );

      await fetchTransactions(
        dateFilter,
        startDate,
        endDate,
        selectedAttendant,
        selectedFuel
      );

      setShowFilters(false);
    };

  // -----------------------------------
  // CLEAR FILTERS
  // -----------------------------------
  const clearFilters =
    async () => {
      setAttendantFilter(
        "all"
      );

      setFuelTypeFilter(
        "all"
      );

      setShowFilters(false);

      await fetchTransactions(
        dateFilter,
        startDate,
        endDate,
        "all",
        "all"
      );
    };

  // -----------------------------------
  // PAGE LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading
          transactions...
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
            onClick={() =>
              setShowFilters(
                !showFilters
              )
            }
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-md hover:bg-gray-100 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        }
      />

      {/* Error */}
      {error && (
        <div className="px-6 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <FilterPanel
          primaryLabel="Attendant"
          primaryValue={
            attendantFilter
          }
          primaryOptions={attendants.map(
            (attendant) => ({
              label: `${attendant.first_name} ${attendant.last_name}`,
              value:
                attendant.phone,
            })
          )}
          fuelTypeFilter={
            fuelTypeFilter
          }
          onApply={
            handleApplyFilters
          }
          onClearFilters={
            clearFilters
          }
        />
      )}

      {/* Date Tabs */}
      <DateFilterTabs
        className="px-6 mt-4"
        value={dateFilter}
        onChange={
          handleDateFilterChange
        }
      />

      {/* Custom Picker */}
      {showCustomDatePicker && (
        <DateRangePicker
          className="px-6 mt-4"
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={
            setStartDate
          }
          onEndDateChange={
            setEndDate
          }
          onSubmit={
            handleCustomDateSubmit
          }
          onCancel={
            handleCancelCustomDate
          }
        />
      )}

      {/* Selected Range */}
      {dateFilter ===
        "custom" &&
        !showCustomDatePicker &&
        startDate &&
        endDate && (
          <div className="px-6 mt-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-700">
                Showing data from{" "}
                <span className="font-medium">
                  {startDate}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {endDate}
                </span>
              </p>
            </div>
          </div>
        )}

      {/* Table */}
      <div className="px-6 mt-4">
        {tableLoading && (
          <div className="mb-3 text-sm text-gray-500">
            Refreshing
            transactions...
          </div>
        )}

        <TransactionTable
          transactions={
            transactions
          }
          totalCount={
            transactions.length
          }
          hasActiveFilters={
            attendantFilter !==
              "all" ||
            fuelTypeFilter !==
              "all"
          }
          onClearFilters={
            clearFilters
          }
          showHeader={false}
        />
      </div>
    </div>
  );
}
