import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Hash,
  User,
  AlertCircle,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  onSubmit: (code: string, data: any) => Promise<any>;
  pump: any;
  owners?: any[];
};

type FormState = {
  pump_code: string;
  pump_name: string;
  location: string;
  owner: string;
  is_active: boolean;
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function EditPumpModal({
  isOpen,
  onClose,
  onSuccess,
  onSubmit,
  pump,
  owners = [],
}: Props) {
  const [form, setForm] = useState<FormState>({
    pump_code: "",
    pump_name: "",
    location: "",
    owner: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------------
  // LOAD DATA
  // -----------------------------------
  useEffect(() => {
    if (pump && isOpen) {
      setForm({
        pump_code: pump.pump_code || "",
        pump_name: pump.pump_name || "",
        location: pump.location || "",
        owner: pump.owner_id
          ? String(pump.owner_id)
          : "",
        is_active: pump.is_active ?? true,
      });

      setErrors({});
      setApiError("");
    }
  }, [pump, isOpen]);

  if (!isOpen) return null;

  // -----------------------------------
  // HANDLE CHANGE
  // -----------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setApiError("");
  };

  // -----------------------------------
  // VALIDATION
  // -----------------------------------
  const validate = () => {
    const newErrors: Errors = {};

    if (!form.pump_name.trim()) {
      newErrors.pump_name = "Pump name is required";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!form.owner) {
      newErrors.owner = "Owner is required";
    }

    return newErrors;
  };

  // -----------------------------------
  // SUBMIT
  // -----------------------------------
  const handleSubmit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const payload = {
        pump_name: form.pump_name,
        location: form.location,
        is_active: form.is_active,
        owner: Number(form.owner),
      };

      await onSubmit(form.pump_code, payload);
      await onSuccess();
      handleClose();
    } catch (err: any) {
      console.error(err);

      const data = err.response?.data;

      if (data?.owner) {
        setErrors((prev) => ({
          ...prev,
          owner: "Owner is required",
        }));
        return;
      }

      if (data?.detail) {
        setApiError(data.detail);
        return;
      }

      setApiError("Failed to update pump. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // CLOSE
  // -----------------------------------
  const handleClose = () => {
    setForm({
      pump_code: "",
      pump_name: "",
      location: "",
      owner: "",
      is_active: true,
    });
    setErrors({});
    setApiError("");
    onClose();
  };

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">

          {/* HEADER */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-5 relative">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-white text-xl font-semibold">
              Edit Pump
            </h2>

            <p className="text-white/80 text-sm mt-1">
              Update pump details
            </p>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-5">

            {/* GLOBAL ERROR */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

            {/* PUMP CODE */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Pump Code
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={form.pump_code}
                  readOnly
                  disabled
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500"
                />
              </div>
            </div>

            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Pump Name <span className="text-red-500">*</span>
              </label>
              <input
                name="pump_name"
                value={form.pump_name}
                onChange={handleChange}
                placeholder="Enter pump name"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.pump_name
                    ? "border-red-300 bg-red-50/30"
                    : "border-gray-200 bg-white"
                }`}
              />
              {errors.pump_name && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.pump_name}
                </p>
              )}
            </div>

            {/* LOCATION */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.location
                      ? "border-red-300 bg-red-50/30"
                      : "border-gray-200 bg-white"
                  }`}
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* OWNER */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Assign Owner <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="owner"
                  value={form.owner}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.owner
                      ? "border-red-300 bg-red-50/30"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <option value="">Select Owner</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.first_name} {o.last_name} ({o.username})
                    </option>
                  ))}
                </select>
              </div>
              {errors.owner && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.owner}
                </p>
              )}
            </div>

            {/* STATUS TOGGLE */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Pump Status
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  {form.is_active ? "Pump is active" : "Pump is inactive"}
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Updating..." : "Update Pump"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
