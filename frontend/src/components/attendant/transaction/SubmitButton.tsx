type Props = {
  onClick: () => void;
  disabled: boolean;
};

export default function SubmitButton({ onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 md:py-5 rounded-2xl bg-blue-500 text-white font-medium text-base md:text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg hover:bg-blue-600 disabled:shadow-none"
    >
      Submit Transaction
    </button>
  );
}
