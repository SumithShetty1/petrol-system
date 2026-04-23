import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}: Props) {
  const shiftLeft = !showBack && !!rightAction;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-8 pb-8 px-6 rounded-b-[2rem] relative">

      {/* Left Button */}
      {showBack && (
        <button
          onClick={onBack}
          className="absolute left-4 top-8 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* Right Button */}
      {rightAction && (
        <div className="absolute right-4 top-8 z-20">
          {rightAction}
        </div>
      )}

      {/* Content */}
      <div
        className={`min-h-[60px] flex flex-col justify-center ${
          shiftLeft
            ? "items-start text-left pr-14 pl-2"
            : "items-center text-center"
        }`}
      >
        <h1 className="text-white text-lg md:text-2xl font-medium">
          {title}
        </h1>

        {subtitle ? (
          <>
            <p className="text-white/80 text-sm mt-1">
              {subtitle}
            </p>
            <div className="h-2 md:h-3" />
          </>
        ) : (
          <div className="h-5 md:h-6" />
        )}
      </div>
    </div>
  );
}
