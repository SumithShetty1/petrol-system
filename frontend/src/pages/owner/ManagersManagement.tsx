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

import AddUserModal from "../../components/modals/AddUserModal";
import EditUserModal from "../../components/modals/EditUserModal";
import DeleteUserModal from "../../components/modals/DeleteUserModal";

import { createManager, updateUser, deleteUser } from "../../services/authService";

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

  // -----------------------------------
  // LOAD MANAGERS LIST
  // -----------------------------------
  const loadManagers = async () => {
    try {
      setLoading(true);

      const data =
        await getManagers();

      setManagers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadPumps = async () => {
    try {
      const data = await getAvailablePumps();
      setPumps(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadManagers();
    loadPumps();
  }, []);

  // -----------------------------------
  // LOAD FULL MANAGER PROFILE
  // -----------------------------------
  const loadManagerDetails =
    async (manager: any) => {
      try {
        setProfileLoading(true);

        const fullProfile =
          await getEmployeeById(
            manager.id
          );

        setSelectedManager(
          fullProfile
        );
      } catch (error) {
        console.error(error);
      } finally {
        setProfileLoading(false);
      }
    };

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
  // PAGE LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading managers...
        </div>
      </div>
    );
  }

  // -----------------------------------
  // PROFILE LOADING
  // -----------------------------------
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

      <PeopleList
        users={managers.map(
          (item) => ({
            ...item,
            subtitle:
              item.pump_name ||
              "No Pump Assigned",
          })
        )}
        emptyText="No managers found"
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
        onSuccess={
          loadManagers
        }
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
        onSuccess={loadManagers}
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
        onSuccess={
          loadManagers
        }
        onSubmit={deleteUser}
        role="manager"
        user={
          deleteManagerData
        }
      />
    </div>
  );
}
