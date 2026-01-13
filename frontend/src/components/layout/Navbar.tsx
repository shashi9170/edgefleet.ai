import { useLogoutMutation } from "../../features/auth/auth.api";

export default function Navbar() {
  const [logout] = useLogoutMutation();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex justify-between">
        <h1 className="text-lg font-semibold text-indigo-600">
          Project Tracker
        </h1>

        <button
          onClick={() => logout()}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
