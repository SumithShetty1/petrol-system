type Props = {
  title: string;
};

export default function ProfileHeader({ title }: Props) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-8 pb-8 px-6 rounded-b-[2rem]">
      <div className="min-h-[60px] flex flex-col justify-center">

        <h1 className="text-white text-center text-lg md:text-2xl font-medium relative z-10">
          {title}
        </h1>

        {/* Invisible spacer for consistent height */}
        <p className="text-white/0 text-sm mt-2 md:mt-5">placeholder</p>

      </div>
    </div>
  );
}
