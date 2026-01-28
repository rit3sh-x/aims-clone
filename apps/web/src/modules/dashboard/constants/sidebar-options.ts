import {
    FolderOpenIcon,
    GraduationCapIcon,
    BookOpenIcon,
    UsersIcon,
    UserIcon,
    LayersIcon,
    ClipboardListIcon,
    CheckSquareIcon,
    CalendarIcon,
    MessageSquareIcon,
    FileTextIcon,
    HistoryIcon,
    BarChartIcon,
    CalendarDaysIcon,
    BuildingIcon,
    StarIcon,
    LayoutGridIcon,
    BookMarkedIcon,
    SchoolIcon,
    CalendarClockIcon,
} from "lucide-react";
import type { UserRole } from "@workspace/db";

export const academics = [
    {
        title: "Departments",
        url: "/departments",
        icon: FolderOpenIcon,
    },
    { title: "Courses", url: "/courses", icon: BookOpenIcon },
    { title: "Students", url: "/list/students", icon: UsersIcon },
    { title: "Instructors", url: "/list/instructors", icon: UserIcon },
];

export const teachingLearning = [
    {
        title: "Course Offerings",
        url: "/offering",
        icon: LayoutGridIcon,
    },
    {
        title: "Enrollments",
        url: "/enrollments",
        icon: ClipboardListIcon,
    },
    {
        title: "Feedback Questions",
        url: "/feedback-questions",
        icon: MessageSquareIcon,
    },
];

export const scheduling = [
    { title: "Classrooms", url: "/classrooms", icon: BuildingIcon },
    {
        title: "Academic Schedule",
        url: "/academic-schedule",
        icon: CalendarIcon,
    },
    { title: "Semesters", url: "/semesters", icon: CalendarDaysIcon },
    { title: "Events", url: "/events", icon: CalendarDaysIcon },
];

export function getSidebarOptions(role: UserRole) {
    const commonDashboard = [
        { title: "Overview", url: "/", icon: BarChartIcon },
    ];

    switch (role) {
        case "ADMIN":
            return {
                dashboard: [
                    ...commonDashboard,
                    {
                        title: "Audit Logs",
                        url: "/logs",
                        icon: HistoryIcon,
                    },
                ],
                sections: [
                    {
                        title: "Academics",
                        icon: SchoolIcon,
                        items: academics,
                    },
                    {
                        title: "Teaching & Learning",
                        icon: BookMarkedIcon,
                        items: teachingLearning,
                    },
                    {
                        title: "Scheduling",
                        icon: CalendarClockIcon,
                        items: scheduling,
                    },
                ],
                footer: [
                    {
                        title: "System Logs",
                        icon: ClipboardListIcon,
                        url: "/logs",
                    },
                ],
            };

        case "STUDENT":
            return {
                dashboard: commonDashboard,
                sections: [
                    {
                        title: "My Academics",
                        icon: SchoolIcon,
                        items: [
                            {
                                title: "My Courses",
                                url: "/courses",
                                icon: BookOpenIcon,
                            },
                            {
                                title: "Enrollments",
                                url: "/enrollments",
                                icon: ClipboardListIcon,
                            },
                            {
                                title: "Student Record",
                                url: "/student-record",
                                icon: FileTextIcon,
                            },
                        ],
                    },
                    {
                        title: "Schedule",
                        icon: CalendarClockIcon,
                        items: [
                            {
                                title: "Academic Schedule",
                                url: "/academic-schedule",
                                icon: CalendarIcon,
                            },
                            {
                                title: "Events",
                                url: "/events",
                                icon: CalendarDaysIcon,
                            },
                        ],
                    },
                ],
            };

        case "INSTRUCTOR":
            return {
                dashboard: commonDashboard,
                sections: [
                    {
                        title: "My Courses",
                        icon: BookMarkedIcon,
                        items: [
                            {
                                title: "Course Offerings",
                                url: "/offering",
                                icon: LayoutGridIcon,
                            },
                            {
                                title: "Enrollments",
                                url: "/enrollments",
                                icon: ClipboardListIcon,
                            },
                            {
                                title: "Feedback Questions",
                                url: "/feedback-questions",
                                icon: MessageSquareIcon,
                            },
                        ],
                    },
                    {
                        title: "Schedule",
                        icon: CalendarClockIcon,
                        items: [
                            {
                                title: "Academic Schedule",
                                url: "/academic-schedule",
                                icon: CalendarIcon,
                            },
                            {
                                title: "Classrooms",
                                url: "/classrooms",
                                icon: BuildingIcon,
                            },
                        ],
                    },
                ],
            };

        case "ADVISOR":
            return {
                dashboard: commonDashboard,
                sections: [
                    {
                        title: "My Batch",
                        icon: LayersIcon,
                        items: [
                            {
                                title: "Students",
                                url: "/list/students",
                                icon: UsersIcon,
                            },
                            {
                                title: "Enrollments",
                                url: "/enrollments",
                                icon: ClipboardListIcon,
                            },
                        ],
                    },
                    {
                        title: "Schedule",
                        icon: CalendarClockIcon,
                        items: [
                            {
                                title: "Academic Schedule",
                                url: "/academic-schedule",
                                icon: CalendarIcon,
                            },
                            {
                                title: "Events",
                                url: "/events",
                                icon: CalendarDaysIcon,
                            },
                        ],
                    },
                ],
            };

        case "HOD":
            return {
                dashboard: commonDashboard,
                sections: [
                    {
                        title: "Academics",
                        icon: SchoolIcon,
                        items: [
                            {
                                title: "Departments",
                                url: "/departments",
                                icon: FolderOpenIcon,
                            },
                            {
                                title: "Students",
                                url: "/list/students",
                                icon: UsersIcon,
                            },
                            {
                                title: "Instructors",
                                url: "/list/instructors",
                                icon: UserIcon,
                            },
                        ],
                    },
                    {
                        title: "Teaching & Learning",
                        icon: BookMarkedIcon,
                        items: [
                            {
                                title: "Course Offerings",
                                url: "/offering",
                                icon: LayoutGridIcon,
                            },
                            {
                                title: "Enrollments",
                                url: "/enrollments",
                                icon: ClipboardListIcon,
                            },
                            {
                                title: "Courses",
                                url: "/courses",
                                icon: BookOpenIcon,
                            },
                        ],
                    },
                    {
                        title: "Scheduling",
                        icon: CalendarClockIcon,
                        items: [
                            {
                                title: "Academic Schedule",
                                url: "/academic-schedule",
                                icon: CalendarIcon,
                            },
                            {
                                title: "Semesters",
                                url: "/semesters",
                                icon: CalendarDaysIcon,
                            },
                            {
                                title: "Classrooms",
                                url: "/classrooms",
                                icon: BuildingIcon,
                            },
                        ],
                    },
                ],
            };

        default:
            return {
                dashboard: commonDashboard,
                sections: [],
            };
    }
}
