import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CalendarView = ({ minimal = false }) => {
    const [events, setEvents] = useState([]);

    // Helper to parse "Mon,Wed 10:00-11:30" into recurrent events for the current week
    // This is a heuristic parser for the demo
    const parseClassSchedule = (course) => {
        if (!course.schedule) return [];
        const parts = course.schedule.split(' ');
        if (parts.length < 2) return [];

        const daysStr = parts[0]; // "Mon,Wed"
        const timeStr = parts[1]; // "10:00-11:30"

        const dayMap = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
        const days = daysStr.split(',').map(d => dayMap[d]);

        const [start, end] = timeStr.split('-');
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        // Generate for current week
        const currentStartOfWeek = startOfWeek(new Date(), { weekStartsOn: 0 });
        const generated = [];

        days.forEach(dayIdx => {
            const date = new Date(currentStartOfWeek);
            date.setDate(date.getDate() + dayIdx);

            const startDate = new Date(date);
            startDate.setHours(startH, startM, 0);

            const endDate = new Date(date);
            endDate.setHours(endH, endM, 0);

            generated.push({
                title: `${course.name} (Class)`,
                start: startDate,
                end: endDate,
                allDay: false,
                resource: { type: 'class', color: course.color }
            });
        });
        return generated;
    };

    const fetchData = async () => {
        try {
            const [tasksRes, coursesRes] = await Promise.all([
                axios.get('/api/tasks'),
                axios.get('/api/courses')
            ]);

            let allEvents = [];

            // 1. Map Courses to Schedule
            coursesRes.data.forEach(course => {
                const classEvents = parseClassSchedule(course);
                allEvents = [...allEvents, ...classEvents];
            });

            // 2. Map Tasks to Deadline Slots (1 hour block before deadline)
            tasksRes.data.forEach(task => {
                const deadline = new Date(task.deadline);
                const start = new Date(deadline);
                start.setHours(start.getHours() - 1); // Mock: 1 hour before due

                allEvents.push({
                    title: `Due: ${task.title}`,
                    start: start,
                    end: deadline,
                    allDay: false,
                    resource: { type: 'task', status: task.status, color: task.course?.color || '#888' }
                });
            });

            setEvents(allEvents);

        } catch (error) {
            console.error("Calendar fetch error", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const eventStyleGetter = (event) => {
        const backgroundColor = event.resource.color || '#d2b589';
        return {
            style: {
                backgroundColor: backgroundColor,
                borderRadius: '8px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    const components = {
        event: ({ event }) => (
            <div className="text-xs font-semibold px-1 overflow-hidden whitespace-nowrap text-ellipsis">
                {event.title}
            </div>
        ),
        toolbar: (toolbar) => (
            <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-xl font-bold text-stone-800">{format(toolbar.date, 'MMMM yyyy')}</span>
                <div className="flex gap-2">
                    <button onClick={() => toolbar.onNavigate('PREV')} className="p-1 hover:bg-beige-100 rounded text-stone-500">←</button>
                    <button onClick={() => toolbar.onNavigate('TODAY')} className="px-3 py-1 text-xs font-bold bg-beige-100 text-stone-600 rounded-full hover:bg-beige-200">Today</button>
                    <button onClick={() => toolbar.onNavigate('NEXT')} className="p-1 hover:bg-beige-100 rounded text-stone-500">→</button>
                </div>
            </div>
        )
    };

    return (
        <div className="h-[600px] bg-white p-6 rounded-3xl shadow-sm border border-beige-200 calendar-clean">
            <style>{`
        .calendar-clean .rbc-time-view, .calendar-clean .rbc-month-view { border: none !important; }
        .calendar-clean .rbc-header { border-bottom: none !important; padding: 10px 0; font-size: 11px; font-weight: 700; color: #a8a29e; uppercase; }
        .calendar-clean .rbc-time-header-content { border-left: none !important; }
        .calendar-clean .rbc-timeslot-group { border-bottom: none !important; min-height: 50px; }
        .calendar-clean .rbc-time-content { border-top: none !important; }
        .calendar-clean .rbc-time-gutter .rbc-timeslot-group { border-bottom: none !important; }
        .calendar-clean .rbc-day-slot { border-left: none !important; }
        .calendar-clean .rbc-label { font-size: 11px; font-weight: 600; color: #d6d3d1; padding-right: 8px; }
        .calendar-clean .rbc-today { background-color: transparent !important; }
        .calendar-clean .rbc-event { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
      `}</style>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
                views={['week', 'day']}
                defaultView='week'
                min={new Date(0, 0, 0, 8, 0, 0)} // 8 AM
                max={new Date(0, 0, 0, 20, 0, 0)} // 8 PM
                formats={{
                    timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'h a', culture).replace(' ', '').toLowerCase(), // "8am"
                    eventTimeRangeFormat: () => "", // Hide time range text inside event
                }}
                components={components}
            />
        </div>
    );
};

export default CalendarView;
