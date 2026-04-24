import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../../components/NavBar';
import { getProfile, getCourses, createCourse, deleteCourse, updateCourse, getCourseById } from '../../lib/api';

export default function AdminCourses() {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [status, setStatus] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editInstructor, setEditInstructor] = useState('');
  const [expandedCourse, setExpandedCourse] = useState(null);
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
        if (!['admin', 'instructor'].includes(profileData.role)) {
          router.replace('/dashboard');
          return;
        }
        setProfile(profileData);
        const courseData = await getCourses();
        setCourses(courseData);
      } catch (error) {
        setStatus(error.message);
      }
    };

    load();
  }, [router]);

  const refreshCourses = async () => {
    const courseData = await getCourses();
    setCourses(courseData);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await createCourse({ title, description, instructor: instructor || profile.name });
      setStatus('Course created successfully');
      setTitle('');
      setDescription('');
      setInstructor('');
      await refreshCourses();
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      setStatus('Course deleted');
      await refreshCourses();
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course._id);
    setEditTitle(course.title);
    setEditDescription(course.description);
    setEditInstructor(course.instructor);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await updateCourse(editingCourse, {
        title: editTitle,
        description: editDescription,
        instructor: editInstructor,
      });
      setStatus('Course updated successfully');
      setEditingCourse(null);
      setEditTitle('');
      setEditDescription('');
      setEditInstructor('');
      await refreshCourses();
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditTitle('');
    setEditDescription('');
    setEditInstructor('');
  };

  const toggleExpand = async (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      try {
        const courseDetails = await getCourseById(courseId);
        setExpandedCourse(courseId);
        // Update the course in the list with full details if needed
      } catch (error) {
        setStatus(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="glass-card p-8 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300/90">Admin tools</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Course Management</h1>
              <p className="mt-2 text-slate-400">Create, edit, and remove course content from a polished admin panel.</p>
            </div>
            <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{profile ? `Signed in as ${profile.role}` : 'Loading...'}</div>
          </div>
          {status && <p className="mt-6 rounded-3xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">{status}</p>}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel p-8">
            <h2 className="text-2xl font-semibold text-white">Create a course</h2>
            <form onSubmit={handleCreate} className="mt-7 grid gap-5">
              <label className="grid gap-2 text-sm text-slate-300">
                Course title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="rounded-3xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-300">
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  required
                  className="rounded-3xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-300">
                Instructor
                <input
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder={profile?.name || ''}
                  className="rounded-3xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>
              <button className="mt-2 inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400" type="submit">
                Create course
              </button>
            </form>
          </div>

          <div className="glass-panel p-8">
            <h2 className="text-2xl font-semibold text-white">Recent courses</h2>
            <p className="mt-3 text-slate-400">Manage your current catalog and delete outdated entries.</p>
            <div className="mt-6 space-y-4">
              {courses.map((course) => (
                <div key={course._id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg">
                  {editingCourse === course._id ? (
                    <form onSubmit={handleUpdate} className="grid gap-4">
                      <label className="grid gap-2 text-sm text-slate-300">
                        Course title
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          required
                          className="rounded-3xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        />
                      </label>
                      <label className="grid gap-2 text-sm text-slate-300">
                        Description
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows="3"
                          required
                          className="rounded-3xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        />
                      </label>
                      <label className="grid gap-2 text-sm text-slate-300">
                        Instructor
                        <input
                          value={editInstructor}
                          onChange={(e) => setEditInstructor(e.target.value)}
                          className="rounded-3xl border border-slate-800/90 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                        />
                      </label>
                      <div className="flex gap-3">
                        <button className="inline-flex items-center rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400" type="submit">
                          Update
                        </button>
                        <button
                          className="inline-flex items-center rounded-full bg-slate-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-500"
                          type="button"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                        <p className="mt-2 text-slate-400">{course.description}</p>
                        <p className="mt-3 text-sm text-slate-300"><span className="font-semibold text-slate-100">Instructor:</span> {course.instructor}</p>
                        {expandedCourse === course._id && (
                          <div className="mt-4 rounded-lg bg-slate-800/50 p-4">
                            <p className="text-sm text-slate-300"><span className="font-semibold">Course ID:</span> {course._id}</p>
                            <p className="text-sm text-slate-300"><span className="font-semibold">Created:</span> {new Date(course.createdAt).toLocaleDateString()}</p>
                            {/* Add more details if available */}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4 sm:mt-0 sm:flex-col sm:gap-2">
                        <button
                          className="inline-flex items-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
                          onClick={() => toggleExpand(course._id)}
                        >
                          {expandedCourse === course._id ? 'Hide Details' : 'View Details'}
                        </button>
                        <button
                          className="inline-flex items-center rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-400"
                          onClick={() => handleEdit(course)}
                        >
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                          onClick={() => handleDelete(course._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
