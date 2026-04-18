import { Loader2 } from "lucide-react";

type Props = {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
};

export default function LoginButton({ onClick, disabled, loading }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full bg-blue-500 text-white py-3 rounded-xl 
        hover:bg-blue-600 transition-colors
        disabled:bg-gray-300 disabled:cursor-not-allowed
        flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <span>Login</span>
      )}
    </button>
  );
}
