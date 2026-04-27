import { useState } from "react";
import {
    X,
    AlertTriangle,
    Loader2,
} from "lucide-react";

type Role =
    | "manager"
    | "attendant"
    | "owner";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>;
    role: Role;
    user: any;
    onSubmit: (userId: number) => Promise<any>;
};

export default function DeleteUserModal({
    isOpen,
    onClose,
    onSuccess,
    role,
    user,
    onSubmit,
}: Props) {
    const [loading, setLoading] =
        useState(false);

    const [apiError, setApiError] =
        useState("");

    if (!isOpen) return null;

    const roleTitle =
        role.charAt(0).toUpperCase() +
        role.slice(1);

    const getInitials = (
        first?: string,
        last?: string
    ) => {
        const firstLetter =
            first?.[0] || "";

        const lastLetter =
            last?.[0] || "";

        const initials =
            `${firstLetter}${lastLetter}`;

        return initials
            ? initials.toUpperCase()
            : "U";
    };

    const handleClose = () => {
        if (loading) return;

        setApiError("");
        onClose();
    };

    const handleDelete =
        async () => {
            setLoading(true);
            setApiError("");

            try {
                const userId =
                    user?.user_id;

                if (!userId) {
                    setApiError(
                        "Invalid user selected"
                    );
                    setLoading(false);
                    return;
                }

                await onSubmit(userId);

                await onSuccess();

                handleClose();
            } catch (err: any) {
                console.error(err);

                const data =
                    err.response?.data;

                if (
                    data?.detail
                ) {
                    setApiError(
                        data.detail
                    );
                } else {
                    setApiError(
                        `Failed to delete ${role}. Please try again.`
                    );
                }
            } finally {
                setLoading(false);
            }
        };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">

                    {/* Header */}
                    <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-5 relative rounded-t-3xl">
                        <button
                            onClick={
                                handleClose
                            }
                            disabled={
                                loading
                            }
                            className="absolute right-4 top-4 text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-white text-xl font-semibold">
                            Delete {roleTitle}
                        </h2>

                        <p className="text-white/80 text-sm mt-1">
                            This action cannot be undone
                        </p>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5">

                        {/* Error */}
                        {apiError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-600 text-sm">
                                    {apiError}
                                </p>
                            </div>
                        )}

                        {/* User Card */}
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <div className="flex items-center gap-4">

                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold shadow-md">
                                    {getInitials(
                                        user?.first_name,
                                        user?.last_name
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className="text-gray-900 font-semibold">
                                        {user?.first_name}{" "}
                                        {user?.last_name}
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        {user?.phone ||
                                            user?.username}
                                    </p>

                                    <p className="text-gray-400 text-xs mt-0.5">
                                        {user?.pump_name ||
                                            "No pump assigned"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-amber-800 text-sm font-medium mb-1">
                                Warning
                            </p>

                            <p className="text-amber-700 text-sm">
                                Deleting this {role} will permanently remove the account and related access.
                            </p>
                        </div>

                        {/* Confirm */}
                        <p className="text-center text-gray-600 text-sm">
                            Are you sure you want to delete this {role}?
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 px-6 py-4 flex gap-3">

                        <button
                            onClick={
                                handleClose
                            }
                            disabled={
                                loading
                            }
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={
                                handleDelete
                            }
                            disabled={
                                loading
                            }
                            className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    Delete {roleTitle}
                                </>
                            )}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
