import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import { getProfile, getAvailableCourses, enrollCourse, getCourseById } from '../lib/api';

export default function Courses() {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState({});
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
        const courseData = await getAvailableCourses();
        setCourses(courseData);
      } catch (error) {
        setMessage(error.message);
      }
    };

    load();
  }, [router]);

  const refreshCourses = async () => {
    const courseData = await getAvailableCourses();
    setCourses(courseData);
  };

  const loadCourseDetails = async (courseId) => {
    try {
      const details = await getCourseById(courseId);
      setCourseDetails((prev) => ({ ...prev, [courseId]: details }));
      setExpandedCourse(courseId);
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollCourse(courseId);
      setStatus('Enrollment successful! Showing your course details.');
      await refreshCourses();
      await loadCourseDetails(courseId);
    } catch (error) {
      setStatus(error.message);
    }
  };

  const toggleCourseDetails = async (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }

    if (courseDetails[courseId]) {
      setExpandedCourse(courseId);
      return;
    }

    await loadCourseDetails(courseId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="glass-card p-8 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300/90">Courses</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Browse available classes</h1>
              <p className="mt-2 text-slate-400">Find many courses, enroll quickly, and keep your learning moving.</p>
            </div>
            <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{profile ? `Signed in as ${profile.role}` : 'Loading...'}</div>
          </div>

          {message && <p className="mt-6 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{message}</p>}
          {status && <p className="mt-4 rounded-3xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">{status}</p>}
        </section>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.length === 0 && !message ? (
            <div className="glass-panel col-span-full p-8 text-center text-slate-300">No courses available right now.</div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="glass-panel flex flex-col gap-4 p-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">{course.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">{course.description}</p>
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  <p><span className="font-semibold text-slate-100">Instructor:</span> {course.instructor}</p>
                  <p><span className="font-semibold text-slate-100">Enrolled:</span> {course.enrolled ? 'Yes' : 'No'}</p>
                </div>

                {profile?.role === 'student' ? (
                  course.enrolled ? (
                    <div className="flex flex-col gap-3">
                      <button
                        className="mt-auto rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                        onClick={() => toggleCourseDetails(course._id)}
                      >
                        {expandedCourse === course._id ? 'Hide details' : 'View details'}
                      </button>
                      <div className="rounded-3xl border border-cyan-500/10 bg-slate-900/90 p-4 text-sm text-slate-300">
                        <p className="mb-2 text-slate-200 font-semibold">Course enrolled</p>
                        <p><span className="font-semibold text-slate-100">Status:</span> Enrolled</p>
                        {course.enrolled && <p><span className="font-semibold text-slate-100">Next step:</span> Click View details for more course info.</p>}
                        {expandedCourse === course._id && courseDetails[course._id] && (
                          <div className="mt-4 space-y-2 rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-300">
                            <p><span className="font-semibold text-slate-100">Course ID:</span> {courseDetails[course._id]._id}</p>
                            <p><span className="font-semibold text-slate-100">Created:</span> {new Date(courseDetails[course._id].createdAt).toLocaleDateString()}</p>
                            <p><span className="font-semibold text-slate-100">Students enrolled:</span> {courseDetails[course._id].students?.length ?? 'N/A'}</p>
                            <p><span className="font-semibold text-slate-100">Full description:</span></p>
                            <p className="text-slate-400">{courseDetails[course._id].description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      className="mt-auto rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                      onClick={() => handleEnroll(course._id)}
                    >
                      Enroll
                    </button>
                  )
                ) : null}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
