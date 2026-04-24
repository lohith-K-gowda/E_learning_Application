import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function NavBar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ellipsonic_user');
      if (stored) setUser(JSON.parse(stored));
    }
  }, []);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ellipsonic_token');
      localStorage.removeItem('ellipsonic_user');
      router.push('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-800/75 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold text-white transition hover:text-cyan-300">
          Ellipsonic
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <Link href="/dashboard" className="rounded-full px-4 py-2 transition hover:bg-slate-900/80 hover:text-white">Dashboard</Link>
          <Link href="/courses" className="rounded-full px-4 py-2 transition hover:bg-slate-900/80 hover:text-white">Courses</Link>
          {user?.role === 'admin' && (
            <>
              <Link href="/admin/courses" className="rounded-full px-4 py-2 transition hover:bg-slate-900/80 hover:text-white">Manage Courses</Link>
              <Link href="/admin/users" className="rounded-full px-4 py-2 transition hover:bg-slate-900/80 hover:text-white">Manage Users</Link>
            </>
          )}
          {user ? (
            <button
              onClick={logout}
              className="rounded-full bg-cyan-500 px-4 py-2 text-slate-950 transition hover:bg-cyan-400"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="rounded-full bg-cyan-500 px-4 py-2 text-slate-950 transition hover:bg-cyan-400">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
