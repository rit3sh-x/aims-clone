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
    KeyIcon,
    HistoryIcon,
    GaugeIcon,
    SettingsIcon,
    CalendarDaysIcon,
    BuildingIcon,
    ClockIcon,
    ClipboardCheckIcon,
    StarIcon,
    LayoutGridIcon,
    BarChartIcon,
    LockIcon,
} from "lucide-react";
import { RoleType } from "@workspace/auth";

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

export const communication = [
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
    { title: "Documents", url: "/communication/documents", icon: FileTextIcon },
];

export const systemSecurity = [
    { title: "Users", url: "/system/users", icon: UsersIcon },
    { title: "Sessions", url: "/system/sessions", icon: HistoryIcon },
    { title: "Accounts", url: "/system/accounts", icon: FolderOpenIcon },
    { title: "Two-Factor Settings", url: "/system/two-factor", icon: KeyIcon },
    {
        title: "Verification / OTP Logs",
        url: "/system/otp-logs",
        icon: ShieldIcon,
    },
    { title: "Rate Limits", url: "/system/rate-limits", icon: GaugeIcon },
];

export const settings = [
    { title: "Semesters", url: "/settings/semesters", icon: CalendarDaysIcon },
    {
        title: "Holiday Calendar",
        url: "/settings/holidays",
        icon: CalendarIcon,
    },
    {
        title: "System Preferences",
        url: "/settings/preferences",
        icon: SettingsIcon,
    },
];

export function getSidebarOptions(role: RoleType) {
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
                    { title: "Academics", items: academics },
                    { title: "Teaching & Learning", items: teachingLearning },
                    { title: "Scheduling", items: scheduling },
                    { title: "Communication", items: communication },
                    { title: "System & Security", items: systemSecurity },
                    { title: "Settings", items: settings },
                ],
            };

        case "STUDENT":
            return {
                dashboard: commonDashboard,
                sections: [
                    {
                        title: "My Academics",
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

        case "BATCHADVISOR":
            return {
                dashboard: commonDashboard,
                sections: [
                    {
                        title: "My Batch",
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

        case "SUPERVISOR":
            return {
                dashboard: commonDashboard,
                sections: [
                    {
                        title: "Academics",
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
