import { useEffect, useState } from "react";
import { getAttendants } from "../services/managerService";

export default function ManagerAttendants() {

  const [attendants, setAttendants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadAttendants = async () => {

      try {

        const data = await getAttendants();

        setAttendants(data);

      } catch (error) {

        console.error("Error loading attendants:", error);

      } finally {

        setLoading(false);

      }

    };

    loadAttendants();

  }, []);

  if (loading) {
    return <div className="p-6">Loading attendants...</div>;
  }

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Pump Attendants
      </h1>

      {attendants.length === 0 ? (
        <p className="text-gray-500">No attendants found</p>
      ) : (

        <div className="grid gap-4">

          {attendants.map((a) => (

            <div
              key={a.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >

              <div>

                <p className="font-semibold">
                  {a.name}
                </p>

                <p className="text-sm text-gray-500">
                  {a.phone_number}
                </p>

                <p className="text-xs text-gray-400">
                  Role: {a.role || "Attendant"}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}
