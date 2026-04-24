import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import { getProfile, getCourses } from '../lib/api';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
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
        setProfile(profileData);
        const courseData = await getCourses();
        setCourses(courseData);
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
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300/90">Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Welcome back{profile ? `, ${profile.name}` : ''}</h1>
              {profile && <p className="mt-2 text-slate-300">Your role: <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-cyan-200">{profile.role}</span></p>}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/courses" className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Browse courses</Link>
              {(profile?.role === 'admin' || profile?.role === 'instructor') && (
                <Link href="/admin/courses" className="rounded-full border border-slate-700/70 bg-white/5 px-5 py-3 text-sm text-slate-100 transition hover:border-cyan-400/80 hover:text-cyan-300">Manage courses</Link>
              )}
              {profile?.role === 'admin' && (
                <Link href="/admin/users" className="rounded-full border border-slate-700/70 bg-white/5 px-5 py-3 text-sm text-slate-100 transition hover:border-cyan-400/80 hover:text-cyan-300">Manage users</Link>
              )}
            </div>
          </div>

          {message && <p className="mt-6 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{message}</p>}
        </section>

        {profile && (
          <section className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="glass-panel p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Your role</p>
              <p className="mt-4 text-3xl font-semibold text-white">{profile.role}</p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Enrolled courses</p>
              <p className="mt-4 text-3xl font-semibold text-white">{courses.length}</p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Quick actions</p>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>
                  <Link href="/courses" className="text-cyan-300 hover:text-cyan-200">Browse courses</Link>
                </li>
                {profile.role === 'admin' && (
                  <li>
                    <Link href="/admin/users" className="text-cyan-300 hover:text-cyan-200">Manage users</Link>
                  </li>
                )}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
