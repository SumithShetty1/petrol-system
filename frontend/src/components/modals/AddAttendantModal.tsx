import { useState } from "react";
import { X, User, Phone, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { createAttendant } from "../../services/authService";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

type FormState = {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    is_active: boolean;
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function AddAttendantModal({
    isOpen,
    onClose,
    onSuccess,
}: Props) {
    const [form, setForm] = useState<FormState>({
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        is_active: true,
    });

    const [errors, setErrors] = useState<Errors>({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        // Auto-format phone number
        if (name === "username") {
            const clean = value.replace(/\D/g, "").slice(0, 10);
            setForm({
                ...form,
                [name]: clean,
            });
        } else {
            setForm({
                ...form,
                [name]: type === "checkbox" ? checked : value,
            });
        }

        // Clear error on change
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setApiError("");
    };

    // VALIDATION FUNCTION
    const validate = () => {
        const newErrors: Errors = {};

        if (!form.first_name.trim()) {
            newErrors.first_name = "First name is required";
        }

        if (!form.username.trim()) {
            newErrors.username = "Phone number is required";
        } else if (!/^\d{10}$/.test(form.username)) {
            newErrors.username = "Phone must be 10 digits";
        }

        if (!form.password.trim()) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setApiError("");

        try {
            await createAttendant(form);
            onSuccess();
            handleClose();
        } catch (err: any) {
            console.error("Error creating attendant:", err);

            // FIELD-LEVEL ERROR
            if (err.response?.data) {
                const data = err.response.data;

                if (data.username) {
                    setErrors((prev) => ({
                        ...prev,
                        username: "Phone already exists",
                    }));
                    return;
                }

                if (data.password) {
                    setErrors((prev) => ({
                        ...prev,
                        password: data.password[0],
                    }));
                    return;
                }
            }

            // FALLBACK ERROR
            setApiError("Failed to create attendant. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Reset form
        setForm({
            first_name: "",
            last_name: "",
            username: "",
            password: "",
            is_active: true,
        });
        setErrors({});
        setApiError("");
        setShowPassword(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-5 relative">
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-white text-xl font-semibold">
                            Add New Attendant
                        </h2>
                        <p className="text-white/80 text-sm mt-1">
                            Fill in the details to create a new attendant account
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 space-y-5">
                        {/* Global Error */}
                        {apiError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-600 text-sm">{apiError}</p>
                            </div>
                        )}

                        {/* First Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="first_name"
                                    placeholder="Enter first name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.first_name
                                            ? "border-red-300 bg-red-50/30"
                                            : "border-gray-200 bg-white"
                                        }`}
                                />
                            </div>
                            {errors.first_name && (
                                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.first_name}
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Last Name <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="last_name"
                                    placeholder="Enter last name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="username"
                                    placeholder="10-digit mobile number"
                                    value={form.username}
                                    onChange={handleChange}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.username
                                            ? "border-red-300 bg-red-50/30"
                                            : "border-gray-200 bg-white"
                                        }`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.password
                                            ? "border-red-300 bg-red-50/30"
                                            : "border-gray-200 bg-white"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Status Toggle */}
                        <div className="flex items-center justify-between py-1">
                            <div>
                                <span className="text-sm font-medium text-gray-700">Account Status</span>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {form.is_active ? "Attendant can log in" : "Account is disabled"}
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

                    {/* Footer Actions */}
                    <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    Create Attendant
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
