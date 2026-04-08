import BottomNav from "./BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <div className="min-h-screen bg-gray-100 pb-16">

      {children}

      <BottomNav />

    </div>

  );

}
