"use client";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
    useCurrentSchedule,
    useWeeklyAttendance,
} from "../../hooks/use-events";
import { useEventsParams } from "../../hooks/use-event-params";
import { getWeekDates, navigateWeek, getLatestMonday } from "../../utils";
import { getPeriodTime } from "../../constants";
import type {
    AttendanceStatus,
    DaysOfWeek,
    SessionType,
    TheoryPeriod,
    TutorialPeriod,
    LabPeriod,
} from "../../types";
import { useMemo } from "react";

const DAY_ORDER: DaysOfWeek[] = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
];

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7);

interface TimeSlot {
    id: string;
    dayOfWeek: DaysOfWeek;
    sessionType: SessionType;
    theoryPeriod: TheoryPeriod | null;
    tutorialPeriod: TutorialPeriod | null;
    labPeriod: LabPeriod | null;
}

interface Classroom {
    id: string;
    room: string;
    building: string | null;
}

interface Course {
    id: string;
    code: string;
    title: string;
    credits: number;
}

interface Schedule {
    id: string;
    timeSlot: TimeSlot;
    classroom: Classroom;
    course: Course;
}

interface Attendance {
    id: string;
    date: Date;
    status: AttendanceStatus;
    remarks: string | null;
}

interface ScheduleSlot {
    schedule: Schedule;
    attendance: Attendance | null;
}

function getPeriodLabel(timeSlot: TimeSlot): string {
    return (
        timeSlot.theoryPeriod ||
        timeSlot.tutorialPeriod ||
        timeSlot.labPeriod ||
        ""
    );
}

function getAttendanceColor(status: AttendanceStatus): string {
    const colors: Record<AttendanceStatus, string> = {
        PRESENT: "bg-green-500",
        ABSENT: "bg-red-500",
        EXCUSED: "bg-blue-500",
    };
    return colors[status];
}

function getSessionTypeColor(sessionType: SessionType): string {
    const colors: Record<SessionType, string> = {
        THEORY: "bg-blue-100 border-blue-300",
        TUTORIAL: "bg-purple-100 border-purple-300",
        LAB: "bg-orange-100 border-orange-300",
    };
    return colors[sessionType];
}

function getHourFromPeriod(
    period: TheoryPeriod | TutorialPeriod | LabPeriod | null
): number | null {
    const periodTime = getPeriodTime(period);
    if (!periodTime) return null;
    const match = periodTime.match(/^(\d{1,2}):/);
    if (match) {
        return parseInt(match[1]!, 10);
    }
    return null;
}

export function WeeklySchedule() {
    const [{ current }, setParams] = useEventsParams();
    const { data: scheduleData } = useCurrentSchedule();
    const { data: attendanceData } = useWeeklyAttendance();

    const weekDates = useMemo(() => getWeekDates(current), [current]);

    const schedules: Schedule[] = useMemo(
        () =>
            scheduleData.map((item) => ({
                id: item.schedule.id,
                timeSlot: {
                    id: item.timeSlot.id,
                    dayOfWeek: item.timeSlot.dayOfWeek,
                    sessionType: item.timeSlot.sessionType,
                    theoryPeriod: item.timeSlot.theoryPeriod,
                    tutorialPeriod: item.timeSlot.tutorialPeriod,
                    labPeriod: item.timeSlot.labPeriod,
                },
                classroom: {
                    id: item.classroom.id,
                    room: item.classroom.room,
                    building: item.classroom.building,
                },
                course: {
                    id: item.course.id,
                    code: item.course.code,
                    title: item.course.title,
                    credits: item.course.credits,
                },
            })),
        [scheduleData]
    );

    const attendances: Attendance[] = useMemo(
        () =>
            attendanceData.items.map((item) => ({
                id: item.attendance.id,
                date: new Date(item.attendance.date),
                status: item.attendance.status,
                remarks: item.attendance.remarks,
            })) || [],
        [attendanceData]
    );

    const schedulesByDayAndHour = useMemo(() => {
        const grouped: Record<DaysOfWeek, Record<number, ScheduleSlot[]>> = {
            MONDAY: {},
            TUESDAY: {},
            WEDNESDAY: {},
            THURSDAY: {},
            FRIDAY: {},
        };

        schedules.forEach((schedule) => {
            const day = schedule.timeSlot.dayOfWeek;
            const period =
                schedule.timeSlot.theoryPeriod ||
                schedule.timeSlot.tutorialPeriod ||
                schedule.timeSlot.labPeriod;
            const hour = getHourFromPeriod(period);

            if (hour === null) return;

            if (!grouped[day][hour]) {
                grouped[day][hour] = [];
            }

            const dayIndex = DAY_ORDER.indexOf(day);
            const dayDate = weekDates[dayIndex];

            const attendance = attendances.find(
                (att) => att.date.toDateString() === dayDate?.toDateString()
            );

            grouped[day][hour].push({
                schedule,
                attendance: attendance || null,
            });
        });

        return grouped;
    }, [schedules, attendances, weekDates]);

    const handleNavigateWeek = (direction: "prev" | "next") => {
        const newWeek = navigateWeek(current, direction);
        setParams({ current: newWeek });
    };

    const handleGoToCurrentWeek = () => {
        setParams({ current: getLatestMonday() });
    };

    const formatHour = (hour: number) => {
        return `${hour.toString().padStart(2, "0")}:00`;
    };

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold sm:text-2xl">
                    Week of{" "}
                    {weekDates[0]?.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    })}{" "}
                    -{" "}
                    {weekDates[4]?.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleNavigateWeek("prev")}
                        className="h-8 w-8"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGoToCurrentWeek}
                    >
                        Current Week
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleNavigateWeek("next")}
                        className="h-8 w-8"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Session Types:</span>
                    <Badge
                        variant="outline"
                        className="bg-blue-100 border-blue-300"
                    >
                        Theory
                    </Badge>
                    <Badge
                        variant="outline"
                        className="bg-purple-100 border-purple-300"
                    >
                        Tutorial
                    </Badge>
                    <Badge
                        variant="outline"
                        className="bg-orange-100 border-orange-300"
                    >
                        Lab
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Attendance:</span>
                    <Badge
                        variant="outline"
                        className="bg-green-500 text-white"
                    >
                        Present
                    </Badge>
                    <Badge variant="outline" className="bg-red-500 text-white">
                        Absent
                    </Badge>
                    <Badge variant="outline" className="bg-blue-500 text-white">
                        Excused
                    </Badge>
                </div>
            </div>

            <Card className="overflow-hidden p-0 flex flex-col gap-0 h-150 sm:h-175">
                <div className="grid grid-cols-6 border-b shrink-0">
                    <div className="border-r p-2 text-center text-xs font-medium sm:text-sm">
                        Time
                    </div>
                    {DAY_ORDER.map((day, index) => {
                        const date = weekDates[index];
                        const isToday =
                            date &&
                            date.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={day}
                                className={cn(
                                    "border-r p-2 text-center text-xs font-medium last:border-r-0 sm:text-sm",
                                    isToday && "bg-primary/10"
                                )}
                            >
                                <div className="hidden sm:block">
                                    {day.charAt(0) + day.slice(1).toLowerCase()}
                                </div>
                                <div className="sm:hidden">{day.charAt(0)}</div>
                                {date && (
                                    <div className="text-[10px] text-muted-foreground sm:text-xs">
                                        {date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="overflow-y-auto flex-1">
                    <div className="grid grid-cols-6">
                        {HOURS.map((hour) => (
                            <>
                                <div
                                    key={`time-${hour}`}
                                    className="border-b border-r p-1 text-[10px] text-muted-foreground sm:p-2 sm:text-xs"
                                >
                                    {formatHour(hour)}
                                </div>

                                {DAY_ORDER.map((day, dayIndex) => {
                                    const slots =
                                        schedulesByDayAndHour[day][hour] || [];
                                    const date = weekDates[dayIndex];
                                    const isToday =
                                        date &&
                                        date.toDateString() ===
                                            new Date().toDateString();

                                    return (
                                        <div
                                            key={`${day}-${hour}`}
                                            className={cn(
                                                "min-h-12 border-b border-r p-0.5 transition-colors hover:bg-accent/50 last:border-r-0 sm:min-h-16 sm:p-1",
                                                isToday && "bg-primary/5"
                                            )}
                                        >
                                            {slots.length > 0 ? (
                                                <div className="space-y-1">
                                                    {slots.map(
                                                        (slot, index) => (
                                                            <div
                                                                key={index}
                                                                className={cn(
                                                                    "cursor-pointer rounded-lg border-2 p-1.5 transition-all hover:shadow-md hover:scale-[1.02] sm:p-2",
                                                                    getSessionTypeColor(
                                                                        slot
                                                                            .schedule
                                                                            .timeSlot
                                                                            .sessionType
                                                                    )
                                                                )}
                                                            >
                                                                <div className="space-y-0.5 sm:space-y-1">
                                                                    <div className="font-semibold text-xs sm:text-sm truncate">
                                                                        {
                                                                            slot
                                                                                .schedule
                                                                                .course
                                                                                .code
                                                                        }
                                                                    </div>
                                                                    <div className="text-[10px] text-muted-foreground line-clamp-1 hidden sm:block">
                                                                        {
                                                                            slot
                                                                                .schedule
                                                                                .course
                                                                                .title
                                                                        }
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground sm:text-xs">
                                                                        <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                                        <span className="truncate">
                                                                            {
                                                                                slot
                                                                                    .schedule
                                                                                    .classroom
                                                                                    .room
                                                                            }
                                                                            {slot
                                                                                .schedule
                                                                                .classroom
                                                                                .building && (
                                                                                <span className="hidden sm:inline">
                                                                                    ,{" "}
                                                                                    {
                                                                                        slot
                                                                                            .schedule
                                                                                            .classroom
                                                                                            .building
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    {slot.attendance && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={cn(
                                                                                "text-[10px] h-4 sm:text-xs sm:h-5 text-white",
                                                                                getAttendanceColor(
                                                                                    slot
                                                                                        .attendance
                                                                                        .status
                                                                                )
                                                                            )}
                                                                        >
                                                                            {
                                                                                slot
                                                                                    .attendance
                                                                                    .status
                                                                            }
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}
