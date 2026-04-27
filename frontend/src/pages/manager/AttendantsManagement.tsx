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
import AttendantProfileView from "../../components/manager/attendants/AttendantProfileView";

import AddUserModal from "../../components/modals/AddUserModal";
import EditUserModal from "../../components/modals/EditUserModal";
import DeleteUserModal from "../../components/modals/DeleteUserModal";

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

  // -----------------------------------
  // LOAD ATTENDANTS
  // -----------------------------------
  const loadAttendants = async () => {
    try {
      setLoading(true);

      const data =
        await getAttendants();

      setAttendants(data);
    } catch (error) {
      console.error(error);
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
      const stats =
        await getAttendantDashboardByPhone(
          phone,
          range,
          start,
          end
        );

      setAttendantStats(stats);
    } catch (error) {
      console.error(error);
    }
  };

  // -----------------------------------
  // OPEN PROFILE
  // -----------------------------------
  const loadAttendantDetails =
    async (attendant: any) => {
      try {
        setProfileLoading(true);

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
      } catch (error) {
        console.error(error);
      } finally {
        setProfileLoading(false);
      }
    };

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
  // LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading attendants...
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading profile...
        </div>
      </div>
    );
  }

  // -----------------------------------
  // PROFILE VIEW
  // -----------------------------------
  if (
    selectedAttendant
  ) {
    return (
      <AttendantProfileView
        attendant={
          selectedAttendant
        }
        stats={
          attendantStats
        }
        dateFilter={
          dateFilter
        }
        showCustomDatePicker={
          showCustomDatePicker
        }
        startDate={
          startDate
        }
        endDate={
          endDate
        }
        onBack={
          handleBackToList
        }
        onFilterChange={
          handleFilterChange
        }
        onStartDateChange={
          setStartDate
        }
        onEndDateChange={
          setEndDate
        }
        onCustomDateSubmit={
          handleCustomDateSubmit
        }
        onCancelCustomDate={() =>
          setShowCustomDatePicker(
            false
          )
        }
      />
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

      <PeopleList
        users={attendants.map(
          (item) => ({
            ...item,
            subtitle:
              item.pump_name ||
              "—",
          })
        )}
        emptyText="No attendants found"
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
