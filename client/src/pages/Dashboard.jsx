import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import CourseList from '../components/CourseList';
import CalendarView from '../components/CalendarView';
import CollapsibleAIHelp from '../components/CollapsibleAIHelp'; // New

// We'll refactor Planner/Analytics to be inline components later or duplicate logic for now for speed
// Actually, let's just render the existing page views as sections if 'activeTab' matches
import PlannerPage from './PlannerPage';
import AnalyticsPage from './AnalyticsPage';
import axios from 'axios';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ pending: 0, completed: 0, totalHours: 0 });

    useEffect(() => {
        // Quick insights fetch
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/analytics');
                // Calculate quick stats from distribution
                let p = 0; let c = 0;
                data.statusDistribution.forEach(d => {
                    if (d.name === 'Pending') p = d.value;
                    if (d.name === 'Completed') c = d.value;
                });
                setStats({ pending: p, completed: c });
            } catch (err) {
                console.error("Failed to load quick stats");
            }
        };
        fetchStats();
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-beige-100 text-stone-800 font-sans selection:bg-beige-300 pb-24">

            {/* Header / Welcome Area */}
            <div className="px-8 pt-12 pb-6 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-stone-900 tracking-tight">
                    Hello, <span className="text-beige-600">{user?.username}</span>
                </h1>
                <p className="text-stone-500 mt-2 text-lg">
                    Ready to conquer your {stats.pending} pending tasks today?
                </p>
            </div>

            {/* Main Content Area */}
            <div className="px-8 max-w-7xl mx-auto">

                {/* OVERVIEW TAB - Bento Grid */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
                        {/* Left Col: Tasks & Calendar (Takes up 8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Current Tasks (Now on Top) */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-beige-200">
                                <h2 className="text-2xl font-bold mb-4 text-stone-800">Current Tasks</h2>
                                <TaskList limit={3} minimal={true} />
                            </div>

                            {/* Calendar (Now Below) */}
                            <div className="bg-white rounded-3xl p-1 shadow-sm border border-beige-200 overflow-hidden">
                                <CalendarView />
                            </div>
                        </div>

                        {/* Right Col: Quick Stats & Courses (Takes up 4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* AI Collapsible Help */}
                            <CollapsibleAIHelp />

                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-beige-200">
                                <h2 className="text-xl font-bold mb-4 text-stone-800">Your Courses</h2>
                                <CourseList minimal={false} /> {/* Enable Add/Delete even on dashboard */}
                            </div>
                        </div>
                    </div>
                )}

                {/* TASKS TAB */}
                {activeTab === 'tasks' && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-beige-200 min-h-[60vh]">
                        <TaskList />
                    </div>
                )}

                {/* PLANNER TAB */}
                {activeTab === 'planner' && (
                    <div className="grid grid-cols-1 gap-6 min-h-[70vh] pb-24">
                        <CollapsibleAIHelp />
                        <div className="bg-white rounded-3xl p-2 shadow-sm border border-beige-200">
                            <PlannerPage embed={true} />
                        </div>
                    </div>
                )}

                {/* ANALYTICS TAB */}
                {activeTab === 'analytics' && (
                    <div className="bg-white rounded-3xl p-2 shadow-sm border border-beige-200 min-h-[70vh]">
                        <AnalyticsPage embed={true} />
                    </div>
                )}

            </div>

            {/* Floating Navbar */}
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />

        </div>
    );
};

export default Dashboard;
