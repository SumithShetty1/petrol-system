import FormTitle from "./FormTitle";
import PhoneInput from "./PhoneInput";
import PasswordInput from "./PasswordInput";
import LoginButton from "./LoginButton";

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

export default function LoginForm({
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
    <div
      className="
        bg-white
        rounded-3xl md:rounded-[2rem]
        shadow-xl
        px-5 sm:px-6 md:px-8
        pt-6 sm:pt-8
        pb-8 sm:pb-10 md:pb-12
      "
    >
      <FormTitle title="Sign in" />

      {error && (
        <div className="mt-4 mb-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="mt-6 sm:mt-8">
        <PhoneInput phone={phone} onChange={onPhoneChange} />
      </div>

      <div className="mt-5 sm:mt-6 md:mt-8">
        <PasswordInput password={password} onChange={onPasswordChange} />
      </div>

      <div className="mt-8 sm:mt-10 md:mt-12">
        <LoginButton
          onClick={onSubmit}
          disabled={!isValid}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
