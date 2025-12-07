const AIPlannerSidebar = () => {
    return (
        <div className="bg-stone-900 text-beige-100 p-6 rounded-3xl h-full shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-beige-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>

            <h3 className="text-xl font-bold mb-4 z-10 relative">How AI Planner Works</h3>

            <div className="space-y-6 z-10 relative text-sm text-beige-200">
                <div className="flex gap-3">
                    <div className="bg-white/10 p-2 rounded-lg h-10 w-10 flex items-center justify-center font-bold">1</div>
                    <div>
                        <h4 className="font-bold text-white mb-1">Analyzes Deadlines</h4>
                        <p>It scans all your tasks and prioritizes urgency.</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white/10 p-2 rounded-lg h-10 w-10 flex items-center justify-center font-bold">2</div>
                    <div>
                        <h4 className="font-bold text-white mb-1">Weights Difficulty</h4>
                        <p>Harder tasks (difficulty 4-5) get allocated first.</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white/10 p-2 rounded-lg h-10 w-10 flex items-center justify-center font-bold">3</div>
                    <div>
                        <h4 className="font-bold text-white mb-1">Time Blocking</h4>
                        <p>Fits tasks into your daily limit (e.g. 4 hours) to prevent burnout.</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-xs uppercase tracking-widest text-beige-400 font-bold mb-2">Pro Tip</h4>
                <p className="text-xs text-beige-200">Mark tasks as "Completed" to train the algorithm on your speed!</p>
            </div>
        </div>
    );
};

export default AIPlannerSidebar;
