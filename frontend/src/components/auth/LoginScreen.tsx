import { Eye, EyeOff, Phone } from "lucide-react";
import { useState } from "react";

type Props = {
  phone: string;
  password: string;
  setPhone: (value: string) => void;
  setPassword: (value: string) => void;
  onLogin: () => void;
};

export default function LoginScreen({
  phone,
  password,
  setPhone,
  setPassword,
  onLogin,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const handlePhoneChange = (value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 10);
    setPhone(clean);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex justify-center">
      {/* Mobile container */}
      <div className="w-full max-w-[420px] relative">

        {/* Blue abstract header */}
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-br from-blue-500 to-blue-600">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute top-20 right-12 w-20 h-20 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-16 left-1/3 w-24 h-24 border-2 border-white rounded-full"></div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 pt-64 px-6">
          <div className="bg-white rounded-t-[3rem] pt-8 pb-12 px-6 -mx-6 shadow-lg">

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-[#424242] text-[38px] leading-[1.1] font-semibold">
                Sign in
              </h1>
              <div className="h-[3px] w-[74px] bg-blue-500 rounded-full mt-3"></div>
            </div>

            {/* Phone number */}
            <div className="mb-6">
              <label className="text-[#616161] text-[16px] block mb-3">
                Phone Number
              </label>

              <div className="flex items-center gap-2 pb-2 border-b-[1.5px] border-blue-500">
                <Phone className="w-[14px] h-[14px] text-[#bdbdbd]" />

                <div className="w-[1px] h-[8px] bg-[#bdbdbd]"></div>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Enter your phone number"
                  className="flex-1 outline-none text-[#424242] text-[14px] placeholder:text-[#bdbdbd]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="text-[#616161] text-[16px] block mb-3">
                Password
              </label>

              <div className="flex items-center gap-2 pb-2 border-b-[1.5px] border-blue-500">

                {/* lock icon */}
                <div className="w-[16px] h-[16px]">
                  <svg fill="none" viewBox="0 0 16 16">
                    <rect
                      width="10"
                      height="7"
                      x="3"
                      y="7"
                      stroke="#bdbdbd"
                      rx="1"
                    />
                    <path
                      stroke="#bdbdbd"
                      strokeLinecap="round"
                      d="M5 7V5a3 3 0 0 1 6 0v2"
                    />
                  </svg>
                </div>

                <div className="w-[1px] h-[8px] bg-[#bdbdbd]"></div>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 outline-none text-[#424242] text-[14px] placeholder:text-[#bdbdbd]"
                />

                <button
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-[16px] h-[16px] text-[#bdbdbd]" />
                  ) : (
                    <Eye className="w-[16px] h-[16px] text-[#bdbdbd]" />
                  )}
                </button>

              </div>
            </div>

            {/* Forgot password */}
            <div className="mb-8">
              <button className="text-[#69c3ff] text-[12px]">
                Forgot Password?
              </button>
            </div>

            {/* Login button */}
            <button
              onClick={onLogin}
              disabled={phone.length !== 10 || password.length < 8}
              className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Login
            </button>

            {/* Signup link */}
            <div className="text-center mt-6">
              <span className="text-[#9e9e9e] text-[14px]">
                Don't have an Account?{" "}
              </span>

              <button className="text-blue-600 text-[14px]">
                Sign up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
