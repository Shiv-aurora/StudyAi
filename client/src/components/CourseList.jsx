import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from './ui/Button';

const CourseList = ({ minimal = false }) => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ name: '', instructor: '', color: '#d2b589' });
    const [showForm, setShowForm] = useState(false);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('/api/courses');
            setCourses(data);
        } catch (error) {
            console.error(error);
            // alert("Failed to fetch courses: " + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete course?")) return;
        try {
            await axios.delete(`/api/courses/${id}`);
            fetchCourses();
        } catch (e) { console.error(e); }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/courses', newCourse);
            setNewCourse({ name: '', instructor: '', color: '#d2b589' });
            setShowForm(false);
            fetchCourses();
        } catch (e) {
            console.error(e);
            alert("Failed to add course: " + (e.response?.data?.message || e.message));
        }
    }

    return (
        <div>
            {!minimal && (
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-stone-800">My Courses</h2>
                    <Button onClick={() => setShowForm(!showForm)} variant="secondary" className="text-sm py-1">
                        {showForm ? 'Cancel' : '+ Add'}
                    </Button>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 bg-beige-50 p-4 rounded-2xl border border-beige-200 space-y-3">
                    <input
                        type="text" placeholder="Course Name" className="w-full p-2 rounded-xl border border-beige-200"
                        value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} required
                    />
                    <input
                        type="text" placeholder="Instructor" className="w-full p-2 rounded-xl border border-beige-200"
                        value={newCourse.instructor} onChange={e => setNewCourse({ ...newCourse, instructor: e.target.value })}
                    />
                    <Button type="submit" variant="primary" className="w-full py-1 text-sm">Save Course</Button>
                </form>
            )}

            <div className={`grid gap-4 ${minimal ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                {courses.map(course => (
                    <div key={course._id} className="p-4 rounded-2xl bg-beige-50 border border-beige-100 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-12 rounded-full" style={{ backgroundColor: course.color || '#d2b589' }}></div>
                            <div>
                                <h3 className="font-bold text-stone-800">{course.name}</h3>
                                <p className="text-xs text-stone-500">{course.instructor || 'No Instructor'}</p>
                            </div>
                        </div>
                        {!minimal && (
                            <button onClick={() => handleDelete(course._id)} className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-400 transition-opacity">
                                ×
                            </button>
                        )}
                    </div>
                ))}
                {courses.length === 0 && <div className="text-stone-400 text-sm italic">No courses added.</div>}
            </div>
        </div>
    );
};

export default CourseList;
