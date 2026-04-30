import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import {
  getManagers,
  getEmployeeById,
} from "../../services/employeeService";

import { getAvailablePumps } from "../../services/pumpService";

import PageHeader from "../../components/common/header/PageHeader";
import PeopleList from "../../components/common/peopleList/PeopleList";
import ManagerProfileView from "../../components/owner/managers/ManagerProfileView";

import AddUserModal from "../../components/modals/user/AddUserModal";
import EditUserModal from "../../components/modals/user/EditUserModal";
import DeleteUserModal from "../../components/modals/user/DeleteUserModal";

import { createManager, updateUser, deleteUser } from "../../services/authService";

import SearchBar from "../../components/common/search/SearchBar";

export default function ManagersManagement() {
  const [managers, setManagers] =
    useState<any[]>([]);

  const [pumps, setPumps] = useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [
    selectedManager,
    setSelectedManager,
  ] = useState<any>(null);

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [editModal, setEditModal] =
    useState(false);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [editManager, setEditManager] =
    useState<any>(null);

  const [deleteManagerData, setDeleteManagerData] =
    useState<any>(null);

  const [pageError, setPageError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [pumpError, setPumpError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // -----------------------------------
  // LOAD MANAGERS + PUMPS (INITIAL)
  // -----------------------------------
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setPageError(null);

      const [managerData, pumpData] = await Promise.all([
        getManagers(),
        getAvailablePumps(),
      ]);

      setManagers(managerData);
      setPumps(pumpData);

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
  // LOAD MANAGERS ONLY
  // -----------------------------------
  const loadManagers = async () => {
    try {
      setListError(null);

      const data = await getManagers();
      setManagers(data);

    } catch (err: any) {
      console.error(err);
      setListError(
        err?.response?.data?.detail ||
        "Failed to load managers"
      );
    }
  };

  // -----------------------------------
  // LOAD PUMPS ONLY
  // -----------------------------------
  const loadPumps = async () => {
    try {
      setPumpError(null);

      const data = await getAvailablePumps();
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
  // LOAD FULL MANAGER PROFILE
  // -----------------------------------
  const loadManagerDetails = async (manager: any) => {
    try {
      setProfileLoading(true);
      setProfileError(null);

      const fullProfile = await getEmployeeById(manager.id);
      setSelectedManager(fullProfile);

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
  // SEARCH FILTER
  // -----------------------------------
  const filteredManagers = managers.filter((manager) => {
    const q = search.toLowerCase();

    const fullName =
      `${manager.first_name || ""} ${manager.last_name || ""}`.toLowerCase();

    const phone = (manager.username || "").toLowerCase();
    const pump = (manager.pump_name || "").toLowerCase();

    return (
      fullName.includes(q) ||
      phone.includes(q) ||
      pump.includes(q)
    );
  });

  // -----------------------------------
  // ACTIONS
  // -----------------------------------
  const handleEditClick =
    (manager: any) => {
      setEditManager(
        manager
      );

      setEditModal(true);
    };

  const handleDeleteClick =
    (manager: any) => {
      setDeleteManagerData(
        manager
      );

      setDeleteModal(true);
    };

  const handleBack =
    () => {
      setSelectedManager(
        null
      );
    };

  // -----------------------------------
  // INITIAL LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading managers...
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
  if (selectedManager) {
    return (
      <>
        {profileError && (
          <div className="p-3 text-red-600 text-center">
            {profileError}
          </div>
        )}

        {profileLoading && (
          <div className="text-center py-4 text-gray-500">
            Loading profile...
          </div>
        )}

        <ManagerProfileView
          manager={selectedManager}
          onBack={handleBack}
        />
      </>
    );
  }

  // -----------------------------------
  // PROFILE ERROR (BLOCK)
  // -----------------------------------
  if (profileError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{profileError}</p>
        <button
          onClick={() => setSelectedManager(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back
        </button>
      </div>
    );
  }

  // -----------------------------------
  // PROFILE VIEW
  // -----------------------------------
  if (
    selectedManager
  ) {
    return (
      <ManagerProfileView
        manager={
          selectedManager
        }
        onBack={
          handleBack
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
        title="Managers"
        subtitle={`${managers.length} manager${managers.length !== 1 ? "s" : ""}`}
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

      {/* LIST ERROR */}
      {listError && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl flex justify-between">
          <span>{listError}</span>
          <button onClick={loadManagers} className="text-blue-600">
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
        placeholder="Search managers..."
        resultCount={filteredManagers.length}
      />

      <PeopleList
        users={filteredManagers.map((item) => ({
          ...item,
          subtitle:
            item.pump_name ||
            "No Pump Assigned",
        })
        )}
        emptyText={
          search
            ? "No matching managers found"
            : "No managers found"
        }
        onSelect={
          loadManagerDetails
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
        onSuccess={async () => {
          await loadManagers();
          await loadPumps();
        }}
        role="manager"
        onSubmit={
          createManager
        }
        pumps={pumps}
      />

      <EditUserModal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          setEditManager(null);
        }}
        onSuccess={async () => {
          await loadManagers();
          await loadPumps();
        }}
        role="manager"
        user={editManager}
        onSubmit={updateUser}
        pumps={pumps}
      />

      <DeleteUserModal
        isOpen={
          deleteModal
        }
        onClose={() => {
          setDeleteModal(
            false
          );
          setDeleteManagerData(
            null
          );
        }}
        onSuccess={async () => {
          await loadManagers();
          await loadPumps();
        }}
        onSubmit={deleteUser}
        role="manager"
        user={
          deleteManagerData
        }
      />
    </div>
  );
}
