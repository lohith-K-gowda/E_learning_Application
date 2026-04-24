import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';
import { getProfile, getUsers } from '../../lib/api';

export default function AdminUsers() {
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ellipsonic_token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }

    const load = async () => {
      try {
        const profileData = await getProfile();
        if (profileData.role !== 'admin') {
          router.replace('/dashboard');
          return;
        }
        setProfile(profileData);
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        setMessage(error.message);
      }
    };

    load();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="glass-card p-8 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300/90">Admin center</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">User Management</h1>
              <p className="mt-2 text-slate-400">Browse enrolled students, instructors, and admin accounts in one place.</p>
            </div>
            <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{profile ? `Signed in as ${profile.role}` : 'Loading...'}</div>
          </div>
          {message && <p className="mt-6 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{message}</p>}
        </section>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <div key={user._id} className="glass-panel p-6">
              <h3 className="text-xl font-semibold text-white">{user.name}</h3>
              <p className="mt-3 text-slate-400">{user.email}</p>
              <div className="mt-4 inline-flex items-center rounded-full bg-slate-900/80 px-3 py-2 text-sm text-cyan-200">
                Role: {user.role}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
