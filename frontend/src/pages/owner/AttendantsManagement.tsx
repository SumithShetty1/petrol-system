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

  // -----------------------------------
  // LOAD ATTENDANTS
  // -----------------------------------
  const loadAttendants = async () => {
    try {
      setLoading(true);
      const data = await getAttendants();
      setAttendants(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // LOAD PUMPS
  // -----------------------------------
  const loadPumps = async () => {
    try {
      const data = await getPumps();
      setPumps(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAttendants();
    loadPumps();
  }, []);

  // -----------------------------------
  // OPEN PROFILE
  // -----------------------------------
  const loadAttendantDetails = async (attendant: any) => {
    try {
      setProfileLoading(true);

      const fullProfile = await getEmployeeById(
        attendant.id
      );

      setSelectedAttendant(fullProfile);
    } catch (error) {
      console.error(error);
    } finally {
      setProfileLoading(false);
    }
  };

  const filteredAttendants = attendants.filter((attendant) => {
    const searchValue = search.toLowerCase();

    const fullName = `${attendant.first_name || ""} ${attendant.last_name || ""}`.toLowerCase();
    const phone = (attendant.username || "").toLowerCase();
    const pump = (attendant.pump_name || "").toLowerCase();

    return (
      fullName.includes(searchValue) ||
      phone.includes(searchValue) ||
      pump.includes(searchValue)
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
  if (selectedAttendant) {
    return (
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
