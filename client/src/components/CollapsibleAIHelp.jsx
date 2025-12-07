import { useState } from 'react';

const CollapsibleAIHelp = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-stone-900 text-beige-100 rounded-2xl shadow-lg hover:bg-stone-800 transition-all font-bold"
            >
                <span className="flex items-center gap-2">
                    <span className="bg-beige-500 w-2 h-2 rounded-full animate-pulse"></span>
                    How AI Planner Works
                </span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="mt-2 bg-stone-900 text-beige-100 p-6 rounded-3xl shadow-xl border border-stone-800 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-4 text-sm text-beige-200">
                        <div className="flex gap-3">
                            <div className="bg-white/10 p-2 rounded-lg h-8 w-8 flex items-center justify-center font-bold text-xs">1</div>
                            <p>It scans all your tasks and prioritizes urgency.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-white/10 p-2 rounded-lg h-8 w-8 flex items-center justify-center font-bold text-xs">2</div>
                            <p>Harder tasks (difficulty 4-5) get allocated first.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-white/10 p-2 rounded-lg h-8 w-8 flex items-center justify-center font-bold text-xs">3</div>
                            <p>Fits tasks into your daily limit (e.g. 4 hours).</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollapsibleAIHelp;
