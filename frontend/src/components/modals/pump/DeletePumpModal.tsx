import { useState } from "react";
import {
  X,
  AlertTriangle,
  Loader2,
  MapPin,
  Hash,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  pump: any;
  onSubmit: (pumpCode: string) => Promise<any>;
};

export default function DeletePumpModal({
  isOpen,
  onClose,
  onSuccess,
  pump,
  onSubmit,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  if (!isOpen || !pump) return null;

  const handleClose = () => {
    if (loading) return;
    setApiError("");
    onClose();
  };

  const handleDelete = async () => {
    setLoading(true);
    setApiError("");

    try {
      const pumpCode = pump?.pump_code;

      if (!pumpCode) {
        setApiError("Invalid pump selected");
        setLoading(false);
        return;
      }

      await onSubmit(pumpCode);

      await onSuccess();
      handleClose();
    } catch (err: any) {
      console.error(err);

      const data = err.response?.data;

      if (data?.detail) {
        setApiError(data.detail);
      } else {
        setApiError("Failed to delete pump. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">

          {/* HEADER */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-5 relative rounded-t-3xl">
            <button
              onClick={handleClose}
              disabled={loading}
              className="absolute right-4 top-4 text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-white text-xl font-semibold">
              Delete Pump
            </h2>

            <p className="text-white/80 text-sm mt-1">
              This action cannot be undone
            </p>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-5">

            {/* ERROR */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <p className="text-red-600 text-sm">
                  {apiError}
                </p>
              </div>
            )}

            {/* PUMP CARD */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="space-y-2">

                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <Hash className="w-4 h-4 text-gray-500" />
                  {pump?.pump_code || "—"}
                </div>

                <p className="text-gray-900 font-medium">
                  {pump?.pump_name || "Unnamed Pump"}
                </p>

                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  {pump?.location || "No location"}
                </div>

              </div>
            </div>

            {/* WARNING */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-sm font-medium mb-1">
                Warning
              </p>

              <p className="text-amber-700 text-sm">
                Deleting this pump will remove it from the system.
                Existing transactions and records will not be deleted,
                but they may no longer be linked to this pump.
              </p>
            </div>

            {/* CONFIRM TEXT */}
            <p className="text-center text-gray-600 text-sm">
              Are you sure you want to delete this pump?
            </p>

          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-100 px-6 py-4 flex gap-3">

            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Pump"
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
