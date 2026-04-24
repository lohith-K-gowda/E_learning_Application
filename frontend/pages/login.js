import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import { login, register } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('ellipsonic_token')) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const payload = isRegister
        ? { name, email, password, role }
        : { email, password, role };
      const response = isRegister ? await register(payload) : await login(payload);
      localStorage.setItem('ellipsonic_token', response.token);
      localStorage.setItem('ellipsonic_user', JSON.stringify(response.user));
      const userRole = response.user.role === 'admin' ? 'Admin' : 'User';
      const action = isRegister ? 'registered' : 'logged in';
      setSuccessMessage(`${userRole} has successfully ${action}.`);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="glass-card w-full p-8 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300/90">{isRegister ? 'Create an account' : 'Welcome back'}</p>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{isRegister ? 'Register' : 'Login'}</h1>
            <p className="mt-3 text-slate-400">{isRegister ? 'Sign up and join an organized learning experience.' : 'Sign in to access your dashboard and courses.'}</p>
          </div>

          <div className="mb-6 grid gap-3 rounded-3xl border border-cyan-500/10 bg-slate-950/60 p-4 sm:grid-cols-2">
            {['student', 'admin'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRole(option)}
                className={`rounded-3xl border px-4 py-3 text-left transition ${role === option ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200 shadow-sm shadow-cyan-500/10' : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600 hover:bg-slate-900/95'}`}
              >
                <span className="block text-sm font-semibold uppercase tracking-[0.2em]">{option}</span>
                <span className="text-sm text-slate-400">{option === 'student' ? 'Enroll in courses' : 'Manage platform data'}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            {isRegister && (
              <label className="grid gap-2 text-sm text-slate-300">
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-3xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>
            )}

            <label className="grid gap-2 text-sm text-slate-300">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-3xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-300">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-3xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </label>

            <button className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400" type="submit">
              {isRegister ? 'Create account' : 'Sign in'}
            </button>

            {message && <p className="text-sm text-rose-300">{message}</p>}
          </form>

          <div className="mt-6 flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>{isRegister ? 'Already have an account?' : 'Need an account?'}</p>
            <button
              className="inline-flex items-center rounded-full bg-slate-900/80 px-4 py-2 text-slate-200 transition hover:bg-slate-900"
              type="button"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </div>
        </div>
      </main>

      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-cyan-500/20">
            <p className="text-white text-center">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
