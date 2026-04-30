import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import PageHeader from "../../components/common/header/PageHeader";
import PeopleList from "../../components/common/peopleList/PeopleList";

import AddUserModal from "../../components/modals/user/AddUserModal";
import EditUserModal from "../../components/modals/user/EditUserModal";
import DeleteUserModal from "../../components/modals/user/DeleteUserModal";

import OwnerProfileView from "../../components/admin/owners/OwnerProfileView";

import {
  createOwner,
  updateUser,
  deleteUser,
  getOwners,
  getOwnerById,
} from "../../services/authService";

import SearchBar from "../../components/common/search/SearchBar";

export default function OwnersManagement() {
  const [owners, setOwners] =
    useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [listError, setListError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [selectedOwner, setSelectedOwner] =
    useState<any>(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [editModal, setEditModal] =
    useState(false);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [editOwner, setEditOwner] =
    useState<any>(null);

  const [deleteOwnerData, setDeleteOwnerData] =
    useState<any>(null);

  // -----------------------------------
  // LOAD OWNERS
  // -----------------------------------
  const loadOwners = async () => {
    try {
      setLoading(true);
      setListError(null);

      const data = await getOwners();
      setOwners(data);
    } catch (err: any) {
      console.error(err);

      setListError(
        err?.response?.data?.detail ||
        "Failed to load owners"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  // -----------------------------------
  // LOAD OWNER PROFILE
  // -----------------------------------
  const loadOwnerDetails = async (owner: any) => {
    try {
      setProfileLoading(true);
      setProfileError(null);

      const fullProfile = await getOwnerById(owner.id);

      setSelectedOwner(fullProfile);
    } catch (err: any) {
      console.error(err);

      setProfileError(
        err?.response?.data?.detail ||
        "Failed to load owner profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };


  const filteredOwners = owners.filter((owner) => {
    const fullName =
      `${owner.first_name || ""} ${owner.last_name || ""}`.toLowerCase();

    const phone = (owner.username || "").toLowerCase();

    const searchValue = search.toLowerCase();

    return (
      fullName.includes(searchValue) ||
      phone.includes(searchValue)
    );
  });

  // -----------------------------------
  // ACTIONS
  // -----------------------------------
  const handleEditClick =
    (owner: any) => {
      setEditOwner(owner);
      setEditModal(true);
    };

  const handleDeleteClick =
    (owner: any) => {
      setDeleteOwnerData(owner);
      setDeleteModal(true);
    };

  const handleBack = () => {
    setSelectedOwner(null);
  };

  // -----------------------------------
  // PAGE LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading owners...
        </div>
      </div>
    );
  }

  // -----------------------------------
  // LIST ERROR (BLOCKING)
  // -----------------------------------
  if (listError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-md">{listError}</p>

        <button
          onClick={loadOwners}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg"
        >
          Retry
        </button>
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
  if (selectedOwner) {
    return (
      <>
        {profileError && (
          <div className="p-3 text-red-600 text-center">
            {profileError}
          </div>
        )}

        {profileLoading && (
          <div className="text-center text-gray-500 mt-4">
            Updating profile...
          </div>
        )}

        <OwnerProfileView
          owner={selectedOwner}
          onBack={handleBack}
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
        title="Owners"
        subtitle={`${owners.length} owner${owners.length !== 1
          ? "s"
          : ""
          }`}
        rightAction={
          <button
            onClick={() =>
              setShowAddModal(true)
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
        placeholder="Search owners..."
        resultCount={filteredOwners.length}
      />

      <PeopleList
        users={filteredOwners.map((item) => ({
          ...item,
          phone: item.username,
          subtitle: item.is_active ? "Active" : "Inactive",
        }))}
        emptyText={
          search
            ? "No matching owners found"
            : "No owners found"
        }
        onSelect={
          loadOwnerDetails
        }
        onEdit={
          handleEditClick
        }
        onDelete={
          handleDeleteClick
        }
      />

      {/* ADD OWNER */}
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
          loadOwners
        }
        role="owner"
        onSubmit={
          createOwner
        }
      />

      {/* EDIT OWNER */}
      <EditUserModal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          setEditOwner(null);
        }}
        onSuccess={
          loadOwners
        }
        role="owner"
        user={editOwner}
        onSubmit={
          updateUser
        }
      />

      {/* DELETE OWNER */}
      <DeleteUserModal
        isOpen={
          deleteModal
        }
        onClose={() => {
          setDeleteModal(
            false
          );
          setDeleteOwnerData(
            null
          );
        }}
        onSuccess={
          loadOwners
        }
        onSubmit={
          deleteUser
        }
        role="owner"
        user={
          deleteOwnerData
        }
      />
    </div>
  );
}
