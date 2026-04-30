import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import {
  getAttendants,
  getEmployeeById,
} from "../../services/employeeService";

import { getPumps } from "../../services/pumpService";

import PageHeader from "../../components/common/header/PageHeader";
import PeopleList from "../../components/common/peopleList/PeopleList";
import AttendantProfileView from "../../components/common/profile/AttendantProfileView";

import AddUserModal from "../../components/modals/user/AddUserModal";
import EditUserModal from "../../components/modals/user/EditUserModal";
import DeleteUserModal from "../../components/modals/user/DeleteUserModal";

import {
  createAttendant,
  deleteUser,
  updateUser,
} from "../../services/authService";
import SearchBar from "../../components/common/search/SearchBar";

export default function AttendantsManagement() {
  const [attendants, setAttendants] = useState<any[]>([]);
  const [pumps, setPumps] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const [selectedAttendant, setSelectedAttendant] =
    useState<any>(null);

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [editModal, setEditModal] =
    useState(false);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [editAttendant, setEditAttendant] =
    useState<any>(null);

  const [deleteAttendantData, setDeleteAttendantData] =
    useState<any>(null);

  const [pageError, setPageError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [pumpError, setPumpError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // -----------------------------------
  // INITIAL LOAD (BOTH)
  // -----------------------------------
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setPageError(null);

      const [attendantsData, pumpsData] = await Promise.all([
        getAttendants(),
        getPumps(),
      ]);

      setAttendants(attendantsData);
      setPumps(pumpsData);

    } catch (err: any) {
      console.error(err);
      setPageError(
        err?.response?.data?.detail ||
        "Failed to load page data"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // LOAD ATTENDANTS ONLY
  // -----------------------------------
  const loadAttendants = async () => {
    try {
      setListError(null);

      const data = await getAttendants();
      setAttendants(data);

    } catch (err: any) {
      console.error(err);
      setListError(
        err?.response?.data?.detail ||
        "Failed to load attendants"
      );
    }
  };

  // -----------------------------------
  // LOAD PUMPS ONLY
  // -----------------------------------
  const loadPumps = async () => {
    try {
      setPumpError(null);

      const data = await getPumps();
      setPumps(data);

    } catch (err: any) {
      console.error(err);
      setPumpError(
        err?.response?.data?.detail ||
        "Failed to load pumps"
      );
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // -----------------------------------
  // LOAD PROFILE
  // -----------------------------------
  const loadAttendantDetails = async (attendant: any) => {
    try {
      setProfileLoading(true);
      setProfileError(null);

      const fullProfile = await getEmployeeById(attendant.id);
      setSelectedAttendant(fullProfile);

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

  // -----------------------------------
  // FILTER
  // -----------------------------------
  const filteredAttendants = attendants.filter((attendant) => {
    const q = search.toLowerCase();

    const fullName =
      `${attendant.first_name || ""} ${attendant.last_name || ""}`.toLowerCase();

    const phone = (attendant.username || "").toLowerCase();
    const pump = (attendant.pump_name || "").toLowerCase();

    return (
      fullName.includes(q) ||
      phone.includes(q) ||
      pump.includes(q)
    );
  });


  // -----------------------------------
  // BACK
  // -----------------------------------
  const handleBackToList = () => {
    setSelectedAttendant(null);
  };

  // -----------------------------------
  // EDIT
  // -----------------------------------
  const handleEditClick = (attendant: any) => {
    setEditAttendant(attendant);
    setEditModal(true);
  };

  // -----------------------------------
  // DELETE
  // -----------------------------------
  const handleDeleteClick = (attendant: any) => {
    setDeleteAttendantData(attendant);
    setDeleteModal(true);
  };

  // -----------------------------------
  // INITIAL LOADING
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
          onClick={loadInitialData}
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

        {profileLoading && (
          <div className="text-center py-3 text-gray-500">
            Loading profile...
          </div>
        )}

        <AttendantProfileView
          attendant={selectedAttendant}
          stats={null}
          dateFilter={"today"}
          showCustomDatePicker={false}
          startDate=""
          endDate=""
          onBack={handleBackToList}
          onFilterChange={() => { }}
          onStartDateChange={() => { }}
          onEndDateChange={() => { }}
          onCustomDateSubmit={() => { }}
          onCancelCustomDate={() => { }}
          showPerformance={false}
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
        subtitle={`${attendants.length} attendant${attendants.length !== 1 ? "s" : ""
          }`}
        rightAction={
          <button
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-md hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      {/* LIST ERROR */}
      {listError && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl flex justify-between">
          <span>{listError}</span>
          <button onClick={loadAttendants} className="text-blue-600">
            Retry
          </button>
        </div>
      )}

      {/* PUMP ERROR */}
      {pumpError && (
        <div className="mx-4 mt-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl flex justify-between">
          <span>{pumpError}</span>
          <button onClick={loadPumps} className="text-blue-600">
            Retry
          </button>
        </div>
      )}

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search attendants..."
        resultCount={filteredAttendants.length}
      />

      <PeopleList
        users={filteredAttendants.map((item) => ({
          ...item,
          subtitle: item.pump_name || "—",
        }))}
        emptyText="No attendants found"
        onSelect={loadAttendantDetails}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* ADD */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadAttendants}
        role="attendant"
        onSubmit={createAttendant}
        pumps={pumps}
      />

      {/* EDIT */}
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
        pumps={pumps}
      />

      {/* DELETE */}
      <DeleteUserModal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setDeleteAttendantData(null);
        }}
        onSuccess={loadAttendants}
        role="attendant"
        user={deleteAttendantData}
        onSubmit={deleteUser}
      />
    </div>
  );
}
