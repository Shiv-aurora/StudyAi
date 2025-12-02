const generateSchedule = (tasks, dailyHoursLimit = 4) => {
    // 1. Filter pending tasks
    const pendingTasks = tasks.filter(t => t.status !== 'completed');

    // 2. Calculate score and sort
    // Score = Difficulty * (1 / Days Until Deadline) * Estimated Hours (Normalization?)
    // Let's use a simpler weighted score:
    // Urgency: Days remaining (smaller is more urgent)
    // Importance: Difficulty (higher is more important)
    // Complex tasks: Est Hours (higher might need breaking down, but for priority, maybe start earlier?)

    const now = new Date();

    const scoredTasks = pendingTasks.map(task => {
        const deadline = new Date(task.deadline);
        const diffTime = Math.max(0, deadline - now);
        const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days remaining, min 0 (technically 1 for math safety)

        // safeDays: avoid division by zero
        const safeDays = daysUntil <= 0 ? 0.1 : daysUntil;

        // Heuristic Score: Higher is higher priority
        // Priority = (Difficulty^2) / safeDays 
        // This emphasizes difficulty but exponentially penalizes close deadlines.
        const score = (Math.pow(task.difficulty, 2) * task.estimated_hours) / safeDays;

        return { ...task.toObject(), score, safeDays };
    });

    // Sort Descending by Score
    scoredTasks.sort((a, b) => b.score - a.score);

    // 3. Allocate to days
    const schedule = {};
    let currentDate = new Date();
    // Start scheduling from today or tomorrow? Today.

    let currentDayHours = 0;
    let dayOffset = 0;

    scoredTasks.forEach(task => {
        // If task fits in current day, add it.
        // If not, move to next day? 
        // Or split tasks? Splitting is complex. Let's assume atomic tasks for now, 
        // or if task > dailyLimit, it takes the whole day(s).

        if (currentDayHours + task.estimated_hours <= dailyHoursLimit) {
            // Fits in current day
            const dateKey = getDateString(addDays(currentDate, dayOffset));
            if (!schedule[dateKey]) schedule[dateKey] = [];
            schedule[dateKey].push(task);
            currentDayHours += task.estimated_hours;
        } else {
            // Doesn't fit, move to next day
            // But verify if it fits eventually.
            // If task is larger than daily limit, put it alone on the next day.
            dayOffset++;
            currentDayHours = 0;

            const dateKey = getDateString(addDays(currentDate, dayOffset));
            if (!schedule[dateKey]) schedule[dateKey] = [];
            schedule[dateKey].push(task);
            currentDayHours += task.estimated_hours;
        }
    });

    return schedule;
};

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const getDateString = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

module.exports = generateSchedule;
