import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

const AnalyticsPage = ({ embed = false }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const res = await axios.get('/api/analytics');
            setData(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) return <div className="p-8 text-stone-500">Loading Analytics...</div>;

    // Derive data for charts and metrics
    const completionData = data?.statusDistribution || [];
    const hoursData = data?.courseDistribution || [];
    const difficultyData = data?.difficultyDistribution || [];
    const totalTasks = data?.totalTasks || 0;
    const completedTasks = data?.completedTasks || 0;
    const totalHours = data?.totalHours || 0;

    // Safe guards to prevent crash if data is missing/empty
    // Safe guards & Color assignments
    const COLORS = { Pending: '#F59E0B', Completed: '#10B981', Default: '#d2b589' };
    const safeCompletionData = (completionData || []).map(d => ({ ...d, color: COLORS[d.name] || COLORS.Default }));

    // Assign generic palette for courses since backend doesn't send color
    const PALETTE = ['#D97706', '#059669', '#B45309', '#7C2D12', '#0F766E', '#4338ca'];
    const safeHoursData = (hoursData || []).map((d, i) => ({ ...d, color: PALETTE[i % PALETTE.length] }));

    const safeDifficultyData = difficultyData || [];

    return (
        <div className={`p-6 ${embed ? '' : 'max-w-6xl mx-auto'}`}>
            {!embed && <h1 className="text-3xl font-bold mb-8 text-stone-800">Study Analytics</h1>}

            {/* Top Row: Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-beige-200">
                    <h3 className="text-stone-500 font-medium mb-1">Total Tasks</h3>
                    <p className="text-4xl font-bold text-stone-800">{totalTasks}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-beige-200">
                    <h3 className="text-stone-500 font-medium mb-1">Completion Rate</h3>
                    <p className="text-4xl font-bold text-stone-800">
                        {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                    </p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-beige-200">
                    <h3 className="text-stone-500 font-medium mb-1">Total Est. Hours</h3>
                    <p className="text-4xl font-bold text-stone-800">{totalHours}h</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Task Status - Pie Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-beige-200 flex flex-col items-center">
                    <h3 className="text-lg font-bold mb-6 text-stone-700 w-full text-left">Task Status</h3>
                    {safeCompletionData.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={safeCompletionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {safeCompletionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-stone-400">No data available</div>
                    )}
                </div>

                {/* Hours per Course - Bar Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-beige-200">
                    <h3 className="text-lg font-bold mb-6 text-stone-700">Hours per Course</h3>
                    {safeHoursData.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={safeHoursData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#F5F5F4' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                                        {safeHoursData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || '#A8A29E'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-stone-400">No data available</div>
                    )}
                </div>

                {/* Difficulty Dist - Area Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-beige-200 lg:col-span-2">
                    <h3 className="text-lg font-bold mb-6 text-stone-700">Task Difficulty Distribution</h3>
                    {safeDifficultyData.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={safeDifficultyData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#Dfa72b0" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#Dfa72b0" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                                    <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fill: '#78716C' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716C' }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Area type="monotone" dataKey="count" stroke="#b45309" fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-stone-400">No data available</div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AnalyticsPage;
