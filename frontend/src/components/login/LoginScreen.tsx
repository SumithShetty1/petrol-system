import AuthHeader from "./AuthHeader";
import LoginForm from "./LoginForm";

type Props = {
  phone: string;
  password: string;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  isValid: boolean;
  isLoading: boolean;
  error?: string;
};

export default function LoginScreen({
  phone,
  password,
  onPhoneChange,
  onPasswordChange,
  onSubmit,
  isValid,
  isLoading,
  error
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* HEADER */}
      <AuthHeader />

      {/* FORM WRAPPER */}
      <div
        className="
          relative z-10
          flex-1
          flex items-end md:items-center
          justify-center
          px-4 sm:px-6
          -mt-32 md:-mt-40
        "
      >
        <div
          className="
            w-full
            max-w-md md:max-w-lg lg:max-w-xl
          "
        >
          <LoginForm
            phone={phone}
            password={password}
            onPhoneChange={onPhoneChange}
            onPasswordChange={onPasswordChange}
            onSubmit={onSubmit}
            isValid={isValid}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
