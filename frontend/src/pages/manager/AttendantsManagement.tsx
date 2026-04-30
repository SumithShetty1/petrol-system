import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import {
  getAttendants,
  getEmployeeById,
} from "../../services/employeeService";

import {
  getAttendantDashboardByPhone,
} from "../../services/dashboardService";

import PageHeader from "../../components/common/header/PageHeader";
import PeopleList from "../../components/common/peopleList/PeopleList";
import AttendantProfileView from "../../components/common/profile/AttendantProfileView";
import SearchBar from "../../components/common/search/SearchBar";

import AddUserModal from "../../components/modals/user/AddUserModal";
import EditUserModal from "../../components/modals/user/EditUserModal";
import DeleteUserModal from "../../components/modals/user/DeleteUserModal";

import { createAttendant, deleteUser, updateUser } from "../../services/authService";

export type DateFilter =
  | "today"
  | "week"
  | "month"
  | "year"
  | "custom";

export default function AttendantsManagement() {
  const [attendants, setAttendants] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [
    selectedAttendant,
    setSelectedAttendant,
  ] = useState<any>(null);

  const [search, setSearch] = useState("");

  const [attendantStats, setAttendantStats] =
    useState<any>(null);

  const [dateFilter, setDateFilter] =
    useState<DateFilter>("today");

  const [
    showCustomDatePicker,
    setShowCustomDatePicker,
  ] = useState(false);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [editModal, setEditModal] =
    useState(false);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [editAttendant, setEditAttendant] =
    useState<any>(null);

  const [
    deleteAttendantData,
    setDeleteAttendantData,
  ] = useState<any>(null);

    const [pageError, setPageError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);


  // -----------------------------------
  // LOAD ATTENDANTS
  // -----------------------------------
  const loadAttendants = async () => {
    try {
      setLoading(true);
            setPageError(null);

      setListError(null);

      const data =
        await getAttendants();

      setAttendants(data);
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.detail ||
        "Unable to load attendants.";

      setPageError(message);
      setListError(message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendants();
  }, []);

  // -----------------------------------
  // FETCH DASHBOARD USING PHONE
  // -----------------------------------
  const fetchStats = async (
    phone: string,
    range: DateFilter,
    start?: string,
    end?: string
  ) => {
    try {
      setStatsError(null);

      const stats =
        await getAttendantDashboardByPhone(
          phone,
          range,
          start,
          end
        );

      setAttendantStats(stats);
    } catch (err: any) {
      console.error(err);
      setStatsError(
        err?.response?.data?.detail ||
        "Unable to load statistics"
      );
    }
  };

  // -----------------------------------
  // OPEN PROFILE
  // -----------------------------------
  const loadAttendantDetails =
    async (attendant: any) => {
      try {
        setProfileLoading(true);
        setProfileError(null);

        const fullProfile =
          await getEmployeeById(
            attendant.id
          );

        setSelectedAttendant(
          fullProfile
        );

        setDateFilter("today");
        setStartDate("");
        setEndDate("");
        setShowCustomDatePicker(
          false
        );

        await fetchStats(
          attendant.phone,
          "today"
        );
      } catch (err: any) {
      console.error(err);
      setProfileError(
        err?.response?.data?.detail ||
        "Failed to load profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };


  const filteredAttendants = attendants.filter((attendant) => {
    const q = search.toLowerCase();

    const fullName = `${attendant.first_name || ""} ${attendant.last_name || ""}`.toLowerCase();
    const phone = (attendant.username || "").toLowerCase();
    const pump = (attendant.pump_name || "").toLowerCase();

    return (
      fullName.includes(q) ||
      phone.includes(q) ||
      pump.includes(q)
    );
  });

  // -----------------------------------
  // FILTER CHANGE
  // -----------------------------------
  const handleFilterChange =
    async (
      filter: DateFilter
    ) => {
      if (
        !selectedAttendant
      ) return;

      setDateFilter(filter);

      if (
        filter ===
        "custom"
      ) {
        setShowCustomDatePicker(
          true
        );
        return;
      }

      setShowCustomDatePicker(
        false
      );

      await fetchStats(
        selectedAttendant.phone,
        filter
      );
    };

  // -----------------------------------
  // CUSTOM DATE SUBMIT
  // -----------------------------------
  const handleCustomDateSubmit =
    async () => {
      if (
        !selectedAttendant ||
        !startDate ||
        !endDate
      ) {
        return;
      }

      await fetchStats(
        selectedAttendant.phone,
        "custom",
        startDate,
        endDate
      );

      setShowCustomDatePicker(
        false
      );
    };

  // -----------------------------------
  // BACK
  // -----------------------------------
  const handleBackToList =
    () => {
      setSelectedAttendant(
        null
      );

      setAttendantStats(
        null
      );

      setDateFilter("today");
      setStartDate("");
      setEndDate("");

      setShowCustomDatePicker(
        false
      );
    };

  // -----------------------------------
  // EDIT
  // -----------------------------------
  const handleEditClick =
    (
      attendant: any
    ) => {
      setEditAttendant(
        attendant
      );

      setEditModal(true);
    };

  // -----------------------------------
  // DELETE
  // -----------------------------------
  const handleDeleteClick =
    (
      attendant: any
    ) => {
      setDeleteAttendantData(
        attendant
      );

      setDeleteModal(true);
    };

  // -----------------------------------
  // PAGE LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading attendants...
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
          onClick={loadAttendants}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // -----------------------------------
  // PROFILE VIEW
  // -----------------------------------
  if (selectedAttendant) {
    return (
      <>
        {profileError && (
          <div className="p-3 text-red-600 text-center">
            {profileError}
          </div>
        )}

        <AttendantProfileView
          attendant={selectedAttendant}
          stats={attendantStats}
          dateFilter={dateFilter}
          showCustomDatePicker={showCustomDatePicker}
          startDate={startDate}
          endDate={endDate}
          onBack={handleBackToList}
          onFilterChange={handleFilterChange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onCustomDateSubmit={handleCustomDateSubmit}
          onCancelCustomDate={() =>
            setShowCustomDatePicker(false)
          }
          statsError={statsError}
        />
      </>
    );
  }

  // -----------------------------------
  // LIST VIEW
  // -----------------------------------
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title="Attendants"
        subtitle={`${attendants.length} attendant${attendants.length !== 1 ? "s" : ""}`}
        rightAction={
          <button
            onClick={() =>
              setShowAddModal(
                true
              )
            }
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-md hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search attendants..."
        resultCount={filteredAttendants.length}
      />

       {/* LIST ERROR (NON-BLOCKING) */}
      {listError && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border text-red-600 rounded-xl flex justify-between">
          <span>{listError}</span>
          <button onClick={loadAttendants} className="text-blue-600">
            Retry
          </button>
        </div>
      )}

      <PeopleList
        users={filteredAttendants.map((item) => ({
          ...item,
          subtitle:
            item.pump_name ||
            "—",
        })
        )}
        emptyText={
          search
            ? "No matching attendants found"
            : "No attendants found"
        }
        onSelect={
          loadAttendantDetails
        }
        onEdit={
          handleEditClick
        }
        onDelete={
          handleDeleteClick
        }
      />

      <AddUserModal
        isOpen={
          showAddModal
        }
        onClose={() =>
          setShowAddModal(
            false
          )
        }
        onSuccess={
          loadAttendants
        }
        role="attendant"
        onSubmit={
          createAttendant
        }
      />

      <EditUserModal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          setEditAttendant(null);
        }}
        onSuccess={loadAttendants}
        role="attendant"
        user={editAttendant}
        onSubmit={updateUser}
      />

      <DeleteUserModal
        isOpen={
          deleteModal
        }
        onClose={() => {
          setDeleteModal(
            false
          );
          setDeleteAttendantData(
            null
          );
        }}
        onSuccess={
          loadAttendants
        }
        role="attendant"
        user={
          deleteAttendantData
        }
        onSubmit={deleteUser}
      />
    </div>
  );
}