import { useEffect, useState } from "react";
import {
    X,
    User,
    Phone,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
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
    pumps?: any[];
    onSubmit: (
        id: number,
        data: any
    ) => Promise<any>;
};

type FormState = {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    is_active: boolean;
    pump_id: string;
};

type Errors = Partial<
    Record<keyof FormState, string>
>;

export default function EditUserModal({
    isOpen,
    onClose,
    onSuccess,
    role,
    user,
    pumps = [],
    onSubmit,
}: Props) {
    const [form, setForm] =
        useState<FormState>({
            first_name: "",
            last_name: "",
            username: "",
            password: "",
            is_active: true,
            pump_id: "",
        });

    const [errors, setErrors] =
        useState<Errors>({});

    const [apiError, setApiError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const roleTitle =
        role.charAt(0).toUpperCase() +
        role.slice(1);

    useEffect(() => {
        if (user && isOpen) {
            setForm({
                first_name:
                    user.first_name || "",
                last_name:
                    user.last_name || "",
                username:
                    user.phone ||
                    user.username ||
                    "",
                password: "",
                is_active:
                    user.is_active ?? true,
                pump_id:
                    user.pump_id
                        ? String(user.pump_id)
                        : "",
            });

            setErrors({});
            setApiError("");
            setShowPassword(false);
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {
        const {
            name,
            value,
        } = e.target;

        if (
            e.target instanceof
            HTMLInputElement
        ) {
            const {
                type,
                checked,
            } = e.target;

            setForm((prev) => ({
                ...prev,
                [name]:
                    type === "checkbox"
                        ? checked
                        : value,
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setApiError("");
    };

    const validate = () => {
        const newErrors: Errors = {};

        if (!form.first_name.trim()) {
            newErrors.first_name =
                "First name is required";
        }

        return newErrors;
    };

    const handleSubmit =
        async () => {
            const validationErrors =
                validate();

            if (
                Object.keys(
                    validationErrors
                ).length > 0
            ) {
                setErrors(
                    validationErrors
                );
                return;
            }

            setLoading(true);
            setApiError("");

            try {
                const payload: any = {
                    first_name:
                        form.first_name.trim(),
                    last_name:
                        form.last_name.trim(),
                    is_active:
                        form.is_active,
                };

                if (
                    form.password.trim()
                ) {
                    payload.password =
                        form.password.trim();
                }

                // pump reassign
                if (
                    role === "manager" &&
                    form.pump_id
                ) {
                    payload.pump_id =
                        Number(
                            form.pump_id
                        );
                }

                const userId = user?.user_id;

                if (!userId) {
                    setApiError("Invalid user selected");
                    setLoading(false);
                    return;
                }

                await onSubmit(
                    userId,
                    payload
                );

                await onSuccess();
                handleClose();
            } catch (err: any) {
                console.error(err);

                const data =
                    err.response?.data;

                if (data) {
                    if (data.password) {
                        setErrors(
                            (prev) => ({
                                ...prev,
                                password:
                                    Array.isArray(
                                        data.password
                                    )
                                        ? data.password[0]
                                        : data.password,
                            })
                        );
                        return;
                    }

                    if (data.pump_id) {
                        setErrors(
                            (prev) => ({
                                ...prev,
                                pump_id:
                                    Array.isArray(
                                        data.pump_id
                                    )
                                        ? data.pump_id[0]
                                        : data.pump_id,
                            })
                        );
                        return;
                    }

                    if (data.detail) {
                        setApiError(
                            data.detail
                        );
                        return;
                    }
                }

                setApiError(
                    `Failed to update ${role}. Please try again.`
                );
            } finally {
                setLoading(false);
            }
        };

    const handleClose = () => {
        setForm({
            first_name: "",
            last_name: "",
            username: "",
            password: "",
            is_active: true,
            pump_id: "",
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
                            onClick={
                                handleClose
                            }
                            className="absolute right-4 top-4 text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-white text-xl font-semibold">
                            Edit {roleTitle}
                        </h2>

                        <p className="text-white/80 text-sm mt-1">
                            Update {role} account
                            details
                        </p>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5">
                        {apiError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-600 text-sm">
                                    {apiError}
                                </p>
                            </div>
                        )}

                        {/* First Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                First Name{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                                <input
                                    name="first_name"
                                    value={
                                        form.first_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter first name"
                                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${errors.first_name
                                        ? "border-red-300 bg-red-50/30"
                                        : "border-gray-200 bg-white"
                                        }`}
                                />
                            </div>

                            {errors.first_name && (
                                <p className="text-red-500 text-xs mt-1.5">
                                    {
                                        errors.first_name
                                    }
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Last Name
                            </label>

                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                                <input
                                    name="last_name"
                                    value={
                                        form.last_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter last name"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                />
                            </div>
                        </div>

                        {/* Phone Readonly */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Phone Number
                            </label>

                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                                <input
                                    value={
                                        form.username
                                    }
                                    readOnly
                                    disabled
                                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Password{" "}
                                <span className="text-gray-400 text-xs">
                                    (Leave blank to keep current)
                                </span>
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                                <input
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        form.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter new password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1.5">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Pump */}
                        {role ===
                            "manager" && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Reassign Pump
                                    </label>

                                    <select
                                        name="pump_id"
                                        value={
                                            form.pump_id
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="">
                                            Keep Current Pump ({user.pump_name || "Unassigned"})
                                        </option>

                                        {pumps.map(
                                            (pump) => (
                                                <option
                                                    key={
                                                        pump.id
                                                    }
                                                    value={
                                                        pump.id
                                                    }
                                                >
                                                    {
                                                        pump.pump_code
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        pump.pump_name
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                    {errors.pump_id && (
                                        <p className="text-red-500 text-xs mt-1.5">
                                            {errors.pump_id}
                                        </p>
                                    )}
                                </div>
                            )}

                        {/* Status */}
                        <div className="flex items-center justify-between py-1">
                            <div>
                                <span className="text-sm font-medium text-gray-700">
                                    Account Status
                                </span>

                                <p className="text-xs text-gray-500 mt-0.5">
                                    {form.is_active
                                        ? `${roleTitle} can log in`
                                        : "Account is disabled"}
                                </p>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={
                                        form.is_active
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="sr-only peer"
                                />

                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
                        <button
                            onClick={
                                handleClose
                            }
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={
                                handleSubmit
                            }
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading
                                ? "Updating..."
                                : `Update ${roleTitle}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
