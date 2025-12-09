import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from './ui/Button';

const TaskList = ({ limit, minimal = false }) => {
    const [tasks, setTasks] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '', description: '', deadline: '', difficulty: 3, estimated_hours: 1, course: ''
    });

    const fetchData = async () => {
        try {
            const [taskRes, courseRes] = await Promise.all([
                axios.get('/api/tasks'),
                axios.get('/api/courses')
            ]);
            setTasks(taskRes.data);
            setCourses(courseRes.data);
        } catch (error) {
            console.error(error);
            // alert("Failed to fetch tasks: " + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete task?')) return;
        try {
            await axios.delete(`/api/tasks/${id}`);
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleStatusToggle = async (task) => {
        try {
            const newStatus = task.status === 'pending' ? 'completed' : 'pending';
            await axios.put(`/api/tasks/${task._id}`, { ...task, status: newStatus });
            fetchData();
        } catch (e) { console.error(e); }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tasks', newTask);
            setShowForm(false);
            setNewTask({ title: '', description: '', deadline: '', difficulty: 3, estimated_hours: 1, course: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to add task: " + (error.response?.data?.message || error.message));
        }
    }

    // Filter or Sorting could go here. For now, just slice if limit exists.
    const displayTasks = limit ? tasks.slice(0, limit) : tasks;

    return (
        <div className="space-y-4">
            {!minimal && (
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-stone-800">All Tasks</h2>
                    <Button onClick={() => setShowForm(!showForm)} variant="primary">
                        {showForm ? 'Cancel' : '+ New Task'}
                    </Button>
                </div>
            )}

            {showForm && (
                <div className="bg-beige-50 p-6 rounded-3xl mb-6 shadow-inner border border-beige-200">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text" placeholder="Task Title"
                                className="w-full p-3 rounded-xl bg-white border border-beige-200 focus:ring-2 focus:ring-beige-400 outline-none"
                                value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                className="p-3 rounded-xl bg-white border border-beige-200 flex-1 outline-none"
                                value={newTask.course} onChange={e => setNewTask({ ...newTask, course: e.target.value })}
                            >
                                <option value="">No Course</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            <input
                                type="date"
                                className="p-3 rounded-xl bg-white border border-beige-200 outline-none"
                                value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex gap-4 items-center">
                            <input
                                type="number" placeholder="Hours" min="1"
                                className="w-24 p-3 rounded-xl bg-white border border-beige-200 outline-none"
                                value={newTask.estimated_hours} onChange={e => setNewTask({ ...newTask, estimated_hours: e.target.value })}
                            />
                            <Button type="submit" variant="primary">Add Task</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {displayTasks.map(task => (
                    <div key={task._id} className="group bg-white p-5 rounded-3xl shadow-sm border border-beige-100 hover:shadow-md transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleStatusToggle(task)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-stone-300 hover:border-beige-500'}`}
                            >
                                {task.status === 'completed' && <div className="w-3 h-3 bg-white rounded-full" />}
                            </button>

                            <div>
                                <h4 className={`font-bold text-lg ${task.status === 'completed' ? 'text-stone-400 line-through' : 'text-stone-800'}`}>{task.title}</h4>
                                <p className="text-stone-500 text-sm">
                                    {task.course ? task.course.name : 'General'} • {task.estimated_hours}h • Diff: {task.difficulty}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${new Date(task.deadline) < new Date() ? 'bg-red-100 text-red-600' : 'bg-beige-100 text-beige-800'}`}>
                                {new Date(task.deadline).toLocaleDateString()}
                            </div>
                            {!minimal && (
                                <button onClick={() => handleDelete(task._id)} className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {displayTasks.length === 0 && (
                    <div className="text-center p-8 text-stone-400 italic">No tasks found. Add one above!</div>
                )}
            </div>
        </div>
    );
};

export default TaskList;
