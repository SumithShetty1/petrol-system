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
};

export default function LoginForm({
  phone,
  password,
  onPhoneChange,
  onPasswordChange,
  onSubmit,
  isValid,
  isLoading,
}: Props) {
  return (
    <div className="bg-white rounded-t-[3rem] pt-8 pb-12 px-6 -mx-6">
      <FormTitle title="Sign in" />

      <div className="mb-6">
        <PhoneInput phone={phone} onChange={onPhoneChange} />
      </div>

      <div className="mb-12 md:mb-16">
        <PasswordInput password={password} onChange={onPasswordChange} />
      </div>

      <LoginButton
        onClick={onSubmit}
        disabled={!isValid}
        loading={isLoading}
      />
    </div>
  );
}
