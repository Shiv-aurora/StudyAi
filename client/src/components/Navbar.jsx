import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ activeTab, setActiveTab, onLogout }) => {
    const navItems = [
        { id: 'overview', label: 'Overview' },
        { id: 'tasks', label: 'Tasks' },
        { id: 'planner', label: 'AI Planner' },
        { id: 'analytics', label: 'Analytics' },
    ];

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-stone-900/90 backdrop-blur-md text-beige-100 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-white/10">
                <div className="font-bold text-xl tracking-tighter mr-4 text-beige-400">
                    StudyAI
                </div>

                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`text-sm font-medium transition-colors duration-300 ${activeTab === item.id
                                ? 'text-white bg-white/20 px-3 py-1 rounded-full'
                                : 'text-stone-400 hover:text-beige-200'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}

                <div className="w-px h-6 bg-white/20 mx-2"></div>

                <button
                    onClick={onLogout}
                    className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;
