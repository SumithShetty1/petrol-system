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
};

export default function LoginScreen({
  phone,
  password,
  onPhoneChange,
  onPasswordChange,
  onSubmit,
  isValid,
  isLoading,
}: Props) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <AuthHeader />
      
      <div className="relative z-10 pt-64 px-6">
        <LoginForm
          phone={phone}
          password={password}
          onPhoneChange={onPhoneChange}
          onPasswordChange={onPasswordChange}
          onSubmit={onSubmit}
          isValid={isValid}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
