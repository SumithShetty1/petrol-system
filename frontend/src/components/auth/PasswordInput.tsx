import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  password: string;
  onChange: (value: string) => void;
};

export default function PasswordInput({ password, onChange }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <label className="text-[#616161] text-[16px] block mb-3">
        Password
      </label>
      <div className="flex items-center gap-2 pb-2 border-b-[1.5px] border-blue-500">
        <LockIcon />
        <div className="w-[1px] h-[8px] bg-[#bdbdbd]"></div>
        
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your password"
          className="flex-1 outline-none text-[#424242] text-[14px] placeholder:text-[#bdbdbd]"
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="w-[16px] h-[16px] text-[#bdbdbd]" />
          ) : (
            <Eye className="w-[16px] h-[16px] text-[#bdbdbd]" />
          )}
        </button>
      </div>
    </>
  );
}

function LockIcon() {
  return (
    <div className="w-[16px] h-[16px]">
      <svg className="w-full h-full" fill="none" viewBox="0 0 16 16">
        <rect width="10" height="7" x="3" y="7" stroke="#bdbdbd" rx="1" />
        <path stroke="#bdbdbd" strokeLinecap="round" d="M5 7V5a3 3 0 0 1 6 0v2" />
      </svg>
    </div>
  );
}
