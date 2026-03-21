"use client";

import { useEffect, useState } from "react";

const formatDateTime = (value) => {
  if (!value) return "Never";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getInitials = (username) =>
  String(username || "")
    .trim()
    .slice(0, 2)
    .toUpperCase() || "U";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      try {
        setError("");

        const response = await fetch("/api/user", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load users");
        }

        if (!cancelled) {
          setUsers(Array.isArray(data?.data) ? data.data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load users");
          setUsers([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeUsers = users.filter((user) => user.lastLoginAt).length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-700 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Registered Users</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          This table shows users stored in PostgreSQL from your signup flow.
          Passwords are never shown here because only the password hash is saved
          in the database.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-sm text-slate-200">Total Users</div>
            <div className="mt-2 text-3xl font-semibold">{users.length}</div>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-sm text-slate-200">Logged In Users</div>
            <div className="mt-2 text-3xl font-semibold">{activeUsers}</div>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="text-sm text-slate-200">Storage</div>
            <div className="mt-2 text-lg font-semibold">PostgreSQL</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Users Table</h2>
            <p className="text-sm text-slate-500">
              Username and email are shown here. Password is not visible.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center text-slate-500">
            Loading users...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center">
            <div className="text-sm font-medium text-red-600">{error}</div>
            <p className="mt-2 text-sm text-slate-500">
              Check database connection and try again.
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-sm font-medium text-slate-700">
              No users found
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Create a new account from the signup page to see entries here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last Login
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                          {getInitials(user.username)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {user.username}
                          </div>
                          <div className="text-xs text-slate-500">{user.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {formatDateTime(user.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {formatDateTime(user.lastLoginAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
