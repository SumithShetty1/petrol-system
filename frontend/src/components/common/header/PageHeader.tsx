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
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-b-[2rem] relative">

      {/* Responsive Container */}
      <div className="
        px-4 sm:px-6 lg:px-8
        pt-6 sm:pt-8 md:pt-10
        pb-6 sm:pb-8 md:pb-10
        max-w-7xl mx-auto
        relative
      ">

        {/* Left Button */}
        {showBack && (
          <button
            onClick={onBack}
            className="
              absolute left-2 sm:left-4
              top-6 sm:top-8 md:top-10
              text-white
              hover:bg-white/20
              p-2 sm:p-2.5
              rounded-full
              transition-colors
              z-20
            "
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Right Action */}
        {rightAction && (
          <div
            className="
              absolute right-2 sm:right-4
              top-6 sm:top-8 md:top-10
              z-20
            "
          >
            {rightAction}
          </div>
        )}

        {/* Content */}
        <div
          className={`
            min-h-[60px] sm:min-h-[70px]
            flex flex-col justify-center

            ${
              shiftLeft
                ? "items-start text-left pr-12 sm:pr-16"
                : "items-center text-center"
            }
          `}
        >
          {/* Title */}
          <h1
            className="
              text-white
              text-base sm:text-lg md:text-xl lg:text-2xl
              font-semibold
              leading-tight
            "
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle ? (
            <p
              className="
                text-white/80
                text-xs sm:text-sm md:text-base
                mt-1
              "
            >
              {subtitle}
            </p>
          ) : (
            <div className="h-3 sm:h-4" />
          )}
        </div>
      </div>
    </div>
  );
}
