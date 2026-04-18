import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
};

export default function ProfileHeader({ title, showBack = false, onBack }: Props) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-8 pb-8 px-6 rounded-b-[2rem] relative">

      {/* Back Button */}
      {showBack && (
        <button
          onClick={onBack}
          className="absolute left-4 top-8 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      <div className="min-h-[60px] flex flex-col justify-center">
        <h1 className="text-white text-center text-lg md:text-2xl font-medium relative z-10">
          {title}
        </h1>

        {/* Spacer for consistent height */}
        <p className="text-white/0 text-sm mt-2 md:mt-5">placeholder</p>
      </div>
    </div>
  );
}
