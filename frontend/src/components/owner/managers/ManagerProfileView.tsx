import PageHeader from "../../common/header/PageHeader";
import ProfileCard from "../../common/profile/ProfileCard";

type Props = {
  manager: any;
  onBack: () => void;
};

export default function ManagerProfileView({
  manager,
  onBack,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50 pb-6 md:pb-8">
      <PageHeader
        title="Manager Profile"
        showBack={true}
        onBack={onBack}
      />

      <div className="px-4 md:px-8 lg:px-12 -mt-10 md:-mt-12 relative z-20">
        <div className="max-w-5xl mx-auto">
          <ProfileCard
            profile={manager}
            showLogout={false}
            showManagerInfo={false}
          />
        </div>
      </div>
    </div>
  );
}
