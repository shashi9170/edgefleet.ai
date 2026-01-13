import { Link } from "react-router-dom";
import { useGetMeQuery, useLogoutMutation } from "../features/auth/auth.api";

export default function Home() {
  const { data: user, isLoading } = useGetMeQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-indigo-100">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-6 py-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">
          Project Tracker
        </h1>

        <div className="flex items-center gap-3">
          {!user ? (
            <Link
              to="/login"
              className="rounded-lg border px-4 py-2 text-sm hover:bg-white"
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
              >
                Dashboard
              </Link>

              <button
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="rounded-lg border px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-7xl px-6 py-20 grid gap-12 md:grid-cols-2 items-center">
        {/* Left */}
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight text-gray-900">
            Manage your projects <br />
            <span className="text-indigo-600">
              with clarity & control
            </span>
          </h2>

          <p className="text-gray-600 text-lg">
            A simple, secure project tracker to create, update,
            and manage your work efficiently.
          </p>

          <div className="flex gap-4 pt-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700"
                >
                  Get Started
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg border px-6 py-3 font-medium hover:bg-white"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/projects"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700"
              >
                Go to Projects
              </Link>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <ul className="space-y-4 text-gray-700">
            <Feature title="Secure Authentication">
              Cookie-based JWT auth
            </Feature>
            <Feature title="Project Management">
              Create, update, delete projects instantly
            </Feature>
            <Feature title="Optimistic UI">
              No refresh, instant updates
            </Feature>
            <Feature title="Production Ready">
              Scalable architecture & clean code
            </Feature>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Project Tracker
      </footer>
    </div>
  );
}

function Feature({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 h-2 w-2 rounded-full bg-indigo-600" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{children}</p>
      </div>
    </li>
  );
}
