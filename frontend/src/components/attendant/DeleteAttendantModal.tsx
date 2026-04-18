import { useState } from "react";
import { X, AlertTriangle, User } from "lucide-react";
import { deleteAttendant } from "../../services/authService";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    attendant: any;
};

export default function DeleteAttendantModal({
    isOpen,
    onClose,
    onSuccess,
    attendant,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    if (!isOpen) return null;

    const getInitials = (first: string, last: string) => {
        const firstInitial = first?.[0] || "";
        const lastInitial = last?.[0] || "";
        if (!firstInitial && !lastInitial) return "U";
        return (firstInitial + lastInitial).toUpperCase();
    };

    const handleDelete = async () => {
        setLoading(true);
        setApiError("");

        try {
            await deleteAttendant(attendant.user_id);
            onSuccess();
            handleClose();
        } catch (err: any) {
            console.error("Error deleting attendant:", err);
            setApiError("Failed to delete attendant. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setApiError("");
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-5 relative rounded-t-3xl">
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white text-xl font-semibold">
                                    Delete Attendant
                                </h2>
                                <p className="text-white/80 text-sm mt-1">
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-5">
                        {/* Global Error */}
                        {apiError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-600 text-sm">{apiError}</p>
                            </div>
                        )}

                        {/* Attendant Info */}
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-md">
                                    <span className="text-base font-medium">
                                        {getInitials(attendant?.first_name, attendant?.last_name)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium text-lg">
                                        {attendant?.first_name} {attendant?.last_name}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {attendant?.phone}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-0.5">
                                        {attendant?.pump_name || "No pump assigned"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Warning Message */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-amber-800 text-sm font-medium mb-1">
                                ⚠️ Warning
                            </p>
                            <p className="text-amber-700 text-sm">
                                Deleting this attendant will permanently remove their account 
                                and all associated data. This action cannot be reversed.
                            </p>
                        </div>

                        {/* Confirmation Text */}
                        <div className="text-center">
                            <p className="text-gray-600 text-sm">
                                Are you sure you want to delete this attendant?
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    Delete Attendant
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
