import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

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

    const COLORS = ['#ba8550', '#059669', '#FFBB28', '#FF8042'];

    return (
        <div className={embed ? "h-full" : "min-h-screen bg-gray-50 p-8"}>
            <div className={embed ? "" : "max-w-6xl mx-auto"}>
                {!embed && (
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                        <Link to="/dashboard" className="text-blue-500 hover:underline">Back to Dashboard</Link>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Status Distribution */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-beige-200">
                        <h3 className="text-lg font-bold mb-4 text-center text-stone-800">Task Status</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {data.statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Course Hours */}
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-bold mb-4 text-center">Study Hours per Course</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data.courseDistribution}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Hours" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Difficulty Distribution */}
                    <div className="bg-white p-6 rounded shadow md:col-span-2">
                        <h3 className="text-lg font-bold mb-4 text-center">Task Difficulty Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data.difficultyDistribution}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Tasks" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
