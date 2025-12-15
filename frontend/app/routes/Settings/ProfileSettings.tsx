import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../src/store/store";
import { setName, setEmail } from "../../../src/store/settingsSlice";

interface Props {
  name: string;
  email: string;
}

export default function ProfileSettings({ name, email }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3000/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      alert("Profile updated!");
      dispatch(setName(name));
      dispatch(setEmail(email));
    } catch (e) {
      console.error(e);
      alert("Error updating profile");
    }
  };

  return (
    <div
      id="profile"
      className="glass-card p-6 bg-white dark:bg-gray-900"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
        <span className="mr-2">👤</span>
        Profile Settings
      </h2>

      <form onSubmit={saveProfile} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => dispatch(setName(e.target.value))}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
          />
        </div>

        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg
                     hover:bg-emerald-700 transition-colors duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
