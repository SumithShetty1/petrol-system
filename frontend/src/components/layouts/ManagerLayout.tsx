import BottomNav from "../manager/BottomNav";

export default function ManagerLayout({ children }: any) {

  return (

    <div className="min-h-screen bg-gray-50 pb-20">

      {children}

      <BottomNav />

    </div>

  );

}
