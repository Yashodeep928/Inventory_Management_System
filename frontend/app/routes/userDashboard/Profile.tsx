import { useEffect, useState } from "react";
import { useAppSelector } from "src/store/hooks";

function Profile() {
  const authUser = useAppSelector((s) => s.auth.user);
  const [name, setName] = useState(authUser?.name ?? "");
  const [email, setEmail] = useState(authUser?.email ?? "");
  const [dark, setDark] = useState(false);

  useEffect(() => { if (dark) document.documentElement.classList.add("dark"); else document.documentElement.classList.remove("dark"); }, [dark]);

  const save = async () => {
    try {
      await fetch("http://localhost:3000/api/users/update", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email }) });
    } catch (e) { console.log(e); }
  };

  return (
    <>
     <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Profile & Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked={dark} onChange={(e)=>setDark(e.target.checked)} />
              <span>Enable dark mode</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Save Changes
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
    </>

  )
}

export default Profile 