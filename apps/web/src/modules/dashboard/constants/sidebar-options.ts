import {
    FolderOpenIcon,
    GraduationCapIcon,
    BookOpenIcon,
    UsersIcon,
    UserIcon,
    LayersIcon,
    LinkIcon,
    ClipboardListIcon,
    CheckSquareIcon,
    CalendarIcon,
    MessageSquareIcon,
    BellIcon,
    FileTextIcon,
    ShieldIcon,
    LockIcon,
    HistoryIcon,
    BarChartIcon,
    SettingsIcon,
    CalendarDaysIcon,
    BuildingIcon,
    ClockIcon,
    ClipboardCheckIcon,
    StarIcon,
    LayoutGridIcon,
    BookMarkedIcon,
    SchoolIcon,
    CalendarClockIcon,
    UserCogIcon,
} from "lucide-react";
import { UserRole } from "@workspace/db";

// TODO: Correct the urls and make them according to app

export const academics = [
    {
        title: "Departments",
        url: "/academics/departments",
        icon: FolderOpenIcon,
    },
    { title: "Programs", url: "/academics/programs", icon: GraduationCapIcon },
    { title: "Courses", url: "/academics/courses", icon: BookOpenIcon },
    { title: "Batches", url: "/academics/batches", icon: LayersIcon },
    { title: "Students", url: "/academics/students", icon: UsersIcon },
    { title: "Instructors", url: "/academics/instructors", icon: UserIcon },
    { title: "Prerequisites", url: "/academics/prerequisites", icon: LinkIcon },
];

export const teachingLearning = [
    {
        title: "Course Offerings",
        url: "/teaching/course-offerings",
        icon: LayoutGridIcon,
    },
    {
        title: "Enrollments",
        url: "/teaching/enrollments",
        icon: ClipboardListIcon,
    },
    { title: "Attendance", url: "/teaching/attendance", icon: CheckSquareIcon },
    {
        title: "Assessments",
        url: "/teaching/assessments",
        icon: ClipboardCheckIcon,
    },
    { title: "Grades", url: "/teaching/grades", icon: StarIcon },
    {
        title: "Course Feedback",
        url: "/teaching/feedback",
        icon: MessageSquareIcon,
    },
];

export const scheduling = [
    { title: "Time Slots", url: "/scheduling/time-slots", icon: ClockIcon },
    { title: "Classrooms", url: "/scheduling/classrooms", icon: BuildingIcon },
    {
        title: "Class Schedules",
        url: "/scheduling/class-schedules",
        icon: CalendarIcon,
    },
    { title: "Exams", url: "/scheduling/exams", icon: ClipboardListIcon },
    {
        title: "Exam Schedules",
        url: "/scheduling/exam-schedules",
        icon: CalendarDaysIcon,
    },
];

export const settings = [
    { title: "Semesters", url: "/settings/semesters", icon: CalendarDaysIcon },
];

export function getSidebarOptions(role: UserRole) {
    const commonDashboard = [
        { title: "Overview", url: "/dashboard", icon: BarChartIcon },
    ];

    switch (role) {
        case "ADMIN":
            return {
                dashboard: [
                    ...commonDashboard,
                    {
                        title: "Audit Logs",
                        url: "/dashboard/audit-logs",
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
                    {
                        title: "Settings",
                        icon: SettingsIcon,
                        items: settings,
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
                                url: "/my-academics/courses",
                                icon: BookOpenIcon,
                            },
                            {
                                title: "Attendance",
                                url: "/my-academics/attendance",
                                icon: CheckSquareIcon,
                            },
                            {
                                title: "Grades",
                                url: "/my-academics/grades",
                                icon: StarIcon,
                            },
                            {
                                title: "Course Feedback",
                                url: "/my-academics/feedback",
                                icon: MessageSquareIcon,
                            },
                        ],
                    },
                    {
                        title: "Schedule",
                        icon: CalendarClockIcon,
                        items: [
                            {
                                title: "Class Schedule",
                                url: "/schedule/classes",
                                icon: CalendarIcon,
                            },
                            {
                                title: "Exam Schedule",
                                url: "/schedule/exams",
                                icon: CalendarDaysIcon,
                            },
                        ],
                    },
                    {
                        title: "Communication",
                        icon: MessageSquareIcon,
                        items: [
                            {
                                title: "Announcements",
                                url: "/communication/announcements",
                                icon: MessageSquareIcon,
                            },
                            {
                                title: "Notifications",
                                url: "/communication/notifications",
                                icon: BellIcon,
                            },
                            {
                                title: "Documents",
                                url: "/communication/documents",
                                icon: FileTextIcon,
                            },
                        ],
                    },
                    {
                        title: "Profile",
                        icon: UserCogIcon,
                        items: [
                            {
                                title: "Personal Info",
                                url: "/profile/info",
                                icon: UserIcon,
                            },
                            {
                                title: "Change Password",
                                url: "/profile/password",
                                icon: LockIcon,
                            },
                            {
                                title: "Security Settings",
                                url: "/profile/security",
                                icon: ShieldIcon,
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
                                url: "/my-courses/offerings",
                                icon: LayoutGridIcon,
                            },
                            {
                                title: "Enrollments",
                                url: "/my-courses/enrollments",
                                icon: ClipboardListIcon,
                            },
                            {
                                title: "Attendance",
                                url: "/my-courses/attendance",
                                icon: CheckSquareIcon,
                            },
                            {
                                title: "Assessments",
                                url: "/my-courses/assessments",
                                icon: ClipboardCheckIcon,
                            },
                            {
                                title: "Grades",
                                url: "/my-courses/grades",
                                icon: StarIcon,
                            },
                            {
                                title: "Course Feedback",
                                url: "/my-courses/feedback",
                                icon: MessageSquareIcon,
                            },
                        ],
                    },
                    {
                        title: "Schedule",
                        icon: CalendarClockIcon,
                        items: [
                            {
                                title: "My Class Schedule",
                                url: "/schedule/classes",
                                icon: CalendarIcon,
                            },
                            {
                                title: "My Exam Schedule",
                                url: "/schedule/exams",
                                icon: CalendarDaysIcon,
                            },
                        ],
                    },
                    {
                        title: "Communication",
                        icon: MessageSquareIcon,
                        items: [
                            {
                                title: "Announcements",
                                url: "/communication/announcements",
                                icon: MessageSquareIcon,
                            },
                            {
                                title: "Notifications",
                                url: "/communication/notifications",
                                icon: BellIcon,
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
                                url: "/my-batch/students",
                                icon: UsersIcon,
                            },
                            {
                                title: "Enrollments",
                                url: "/my-batch/enrollments",
                                icon: ClipboardListIcon,
                            },
                            {
                                title: "Attendance",
                                url: "/my-batch/attendance",
                                icon: CheckSquareIcon,
                            },
                            {
                                title: "Grades",
                                url: "/my-batch/grades",
                                icon: StarIcon,
                            },
                            {
                                title: "Course Feedback",
                                url: "/my-batch/feedback",
                                icon: MessageSquareIcon,
                            },
                        ],
                    },
                    {
                        title: "Schedule",
                        icon: CalendarClockIcon,
                        items: [
                            {
                                title: "Class Schedule",
                                url: "/schedule/classes",
                                icon: CalendarIcon,
                            },
                            {
                                title: "Exam Schedule",
                                url: "/schedule/exams",
                                icon: CalendarDaysIcon,
                            },
                        ],
                    },
                    {
                        title: "Communication",
                        icon: MessageSquareIcon,
                        items: [
                            {
                                title: "Announcements",
                                url: "/communication/announcements",
                                icon: MessageSquareIcon,
                            },
                            {
                                title: "Notifications",
                                url: "/communication/notifications",
                                icon: BellIcon,
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
                                title: "Batches",
                                url: "/academics/batches",
                                icon: LayersIcon,
                            },
                            {
                                title: "Students",
                                url: "/academics/students",
                                icon: UsersIcon,
                            },
                            {
                                title: "Instructors",
                                url: "/academics/instructors",
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
                                url: "/teaching/course-offerings",
                                icon: LayoutGridIcon,
                            },
                            {
                                title: "Enrollments",
                                url: "/teaching/enrollments",
                                icon: ClipboardListIcon,
                            },
                            {
                                title: "Attendance",
                                url: "/teaching/attendance",
                                icon: CheckSquareIcon,
                            },
                            {
                                title: "Assessments",
                                url: "/teaching/assessments",
                                icon: ClipboardCheckIcon,
                            },
                            {
                                title: "Grades",
                                url: "/teaching/grades",
                                icon: StarIcon,
                            },
                        ],
                    },
                    {
                        title: "Scheduling",
                        icon: CalendarClockIcon,
                        items: [
                            {
                                title: "Class Schedules",
                                url: "/scheduling/class-schedules",
                                icon: CalendarIcon,
                            },
                            {
                                title: "Exams",
                                url: "/scheduling/exams",
                                icon: ClipboardListIcon,
                            },
                            {
                                title: "Exam Schedules",
                                url: "/scheduling/exam-schedules",
                                icon: CalendarDaysIcon,
                            },
                        ],
                    },
                    {
                        title: "Communication",
                        icon: MessageSquareIcon,
                        items: [
                            {
                                title: "Announcements",
                                url: "/communication/announcements",
                                icon: MessageSquareIcon,
                            },
                            {
                                title: "Notifications",
                                url: "/communication/notifications",
                                icon: BellIcon,
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
