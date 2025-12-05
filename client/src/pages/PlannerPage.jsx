import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PlannerPage = ({ embed = false }) => {
    const [dailyHours, setDailyHours] = useState(4);
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateSchedule = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/planner/generate', { dailyHours });
            setSchedule(data);
        } catch (error) {
            console.error('Error generating schedule', error);
        } finally {
            setLoading(false);
        }
    };

    const content = (
        <div className={embed ? "" : "min-h-screen bg-gray-50 p-8"}>
            <div className={embed ? "" : "max-w-4xl mx-auto"}>
                {!embed && (
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">AI Workload Planner</h1>
                        <Link to="/dashboard" className="text-blue-500 hover:underline">Back to Dashboard</Link>
                    </div>
                )}

                {/* Controls */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-beige-200 mb-8 flex items-center gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-stone-600 mb-1">Daily Study Limit (Hours)</label>
                        <input
                            type="number"
                            value={dailyHours}
                            onChange={(e) => setDailyDailyHours(e.target.value)}
                            className="border border-beige-300 rounded-xl px-4 py-2 w-32 focus:ring-2 focus:ring-beige-400 outline-none"
                            min="1" max="12"
                        />
                    </div>
                    <button
                        onClick={generateSchedule}
                        disabled={loading}
                        className="bg-stone-800 text-beige-100 px-6 py-3 rounded-xl font-bold hover:bg-black transition disabled:opacity-50"
                    >
                        {loading ? 'Analyzing Workload...' : 'Generate Optimized Plan'}
                    </button>
                </div>

                {/* Schedule Display */}
                {schedule && (
                    <div className="space-y-6">
                        {Object.keys(schedule).map(date => (
                            <div key={date} className="bg-white p-6 rounded-3xl shadow-sm border border-beige-200">
                                <h3 className="text-xl font-bold text-stone-800 mb-4 border-b border-beige-100 pb-2">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                                <div className="space-y-3">
                                    {schedule[date].map(task => (
                                        <div key={task._id} className="flex justify-between items-center p-4 bg-beige-50 rounded-2xl">
                                            <div>
                                                <div className="font-semibold text-stone-800">{task.title}</div>
                                                <div className="text-sm text-stone-500">Difficulty: {task.difficulty}/5</div>
                                            </div>
                                            <div className="text-beige-700 font-bold">{task.estimated_hours} hrs</div>
                                        </div>
                                    ))}
                                    <div className="text-right text-sm font-bold text-stone-400 mt-2">
                                        Total: {schedule[date].reduce((acc, t) => acc + t.estimated_hours, 0)} hrs
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return content;
};

export default PlannerPage;
