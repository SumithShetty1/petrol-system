export default function AuthHeader() {
  return (
    <div
      className="
        relative
        w-full
        h-[260px] sm:h-[320px] md:h-[360px] lg:h-[400px]
        bg-gradient-to-br from-blue-500 to-blue-600
        overflow-hidden
      "
    >
      {/* Decorative Circles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-6 sm:left-10 w-20 sm:w-28 md:w-32 h-20 sm:h-28 md:h-32 border-2 border-white rounded-full" />

        <div className="absolute top-16 right-6 sm:right-12 w-14 sm:w-18 md:w-20 h-14 sm:h-18 md:h-20 border-2 border-white rounded-full" />

        <div className="absolute bottom-10 left-1/3 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 border-2 border-white rounded-full" />
      </div>
    </div>
  );
}
