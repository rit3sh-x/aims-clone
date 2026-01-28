export function getLatestMonday(date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();

    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);

    return d;
}

export function getWeekDates(weekStart: Date): Date[] {
    const dates: Date[] = [];
    const start = new Date(weekStart);

    for (let i = 0; i < 5; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(date);
    }

    return dates;
}

export function navigateWeek(
    currentWeek: Date,
    direction: "prev" | "next"
): Date {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    newWeek.setHours(0, 0, 0, 0);
    return newWeek;
}
