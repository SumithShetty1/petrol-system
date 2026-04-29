type Props = {
  onClick: () => void;
  disabled: boolean;
  loading?: boolean;
};

export default function SubmitButton({
  onClick,
  disabled,
  loading = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="
        w-full
        py-3 sm:py-4 md:py-5

        rounded-xl sm:rounded-2xl

        bg-blue-500
        text-white
        font-medium
        text-sm sm:text-base md:text-lg

        transition-all duration-200

        shadow-md sm:shadow-lg

        hover:bg-blue-600
        active:scale-[0.98]

        disabled:bg-gray-300
        disabled:cursor-not-allowed
        disabled:shadow-none

        flex items-center justify-center gap-2
      "
    >
      {loading ? (
        <>
          {/* Spinner */}
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

          <span className="text-sm sm:text-base">
            Processing...
          </span>
        </>
      ) : (
        "Submit Transaction"
      )}
    </button>
  );
}
