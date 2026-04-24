import Link from 'next/link';
import NavBar from '../components/NavBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="glass-card p-10 sm:p-12">
          <span className="inline-flex rounded-full bg-cyan-500/20 px-4 py-1 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-200/30">
            Ellipsonic LMS
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Better learning. Smarter classrooms.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Build courses, enroll students, and manage access with role-based dashboards and polished controls.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              Get Started
            </Link>
            <Link href="/courses" className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/80 hover:text-cyan-300">
              Browse Courses
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="glass-panel p-7">
            <h2 className="text-xl font-semibold text-white">Role-Based Access</h2>
            <p className="mt-3 text-slate-300">Admins manage users and courses, while students enroll in the classes they need.</p>
          </div>
          <div className="glass-panel p-7">
            <h2 className="text-xl font-semibold text-white">Course Management</h2>
            <p className="mt-3 text-slate-300">Create, update, and organize offerings with a modern admin workflow.</p>
          </div>
          <div className="glass-panel p-7">
            <h2 className="text-xl font-semibold text-white">Student Dashboard</h2>
            <p className="mt-3 text-slate-300">Students get a clean overview of their progress and enrolled classes.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
