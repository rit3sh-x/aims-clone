import {
    Building2Icon,
    GraduationCapIcon,
    UserCogIcon,
    CrownIcon,
    UsersIcon,
    BookOpenIcon,
    MessageCircleQuestionIcon,
    CalendarIcon,
    CalendarRangeIcon,
    ScrollTextIcon,
    Grid3x3Icon,
    FileUserIcon,
    CalendarClockIcon,
    UserCheckIcon,
    ClipboardCheckIcon,
} from "lucide-react";
import type { UserRole } from "@workspace/db";
import type { Route } from "next";
import type { ElementType } from "react";

type SidebarItem = {
    title: string;
    url: Route;
    icon: ElementType;
};

type SidebarSection = {
    title: string;
    items: SidebarItem[];
};

export type SidebarConfig = {
    sections: SidebarSection[];
    footer?: SidebarItem[];
};

export function getSidebarOptions(role: UserRole): SidebarConfig {
    switch (role) {
        case "ADMIN":
            return {
                sections: [
                    {
                        title: "Academics",
                        items: [
                            {
                                title: "Departments",
                                url: "/departments",
                                icon: Building2Icon,
                            },
                            {
                                title: "Instructors",
                                url: "/instructors",
                                icon: GraduationCapIcon,
                            },
                            {
                                title: "Advisors",
                                url: "/advisors",
                                icon: UserCogIcon,
                            },
                            {
                                title: "HODs",
                                url: "/hods",
                                icon: CrownIcon,
                            },
                            {
                                title: "Students",
                                url: "/students",
                                icon: UsersIcon,
                            },
                        ],
                    },
                    {
                        title: "Teaching & Learning",
                        items: [
                            {
                                title: "Courses",
                                url: "/courses",
                                icon: BookOpenIcon,
                            },
                            {
                                title: "Feedback Questions",
                                url: "/feedback-questions",
                                icon: MessageCircleQuestionIcon,
                            },
                        ],
                    },
                    {
                        title: "Scheduling",
                        items: [
                            {
                                title: "Academic Schedule",
                                url: "/academic-schedule",
                                icon: CalendarIcon,
                            },
                            {
                                title: "Semesters",
                                url: "/semesters",
                                icon: CalendarRangeIcon,
                            },
                        ],
                    },
                ],
                footer: [
                    {
                        title: "System Logs",
                        icon: ScrollTextIcon,
                        url: "/logs",
                    },
                ],
            };

        case "STUDENT":
            return {
                sections: [
                    {
                        title: "Academics",
                        items: [
                            {
                                title: "Courses",
                                url: "/courses",
                                icon: BookOpenIcon,
                            },
                            {
                                title: "Course Offerings",
                                url: "/offerings",
                                icon: Grid3x3Icon,
                            },
                            {
                                title: "Student Record",
                                url: "/student-record",
                                icon: FileUserIcon,
                            },
                        ],
                    },
                    {
                        title: "Schedule",
                        items: [
                            {
                                title: "Events",
                                url: "/events",
                                icon: CalendarClockIcon,
                            },
                        ],
                    },
                ],
            };

        case "INSTRUCTOR":
            return {
                sections: [
                    {
                        title: "Teaching",
                        items: [
                            {
                                title: "Courses",
                                url: "/courses",
                                icon: BookOpenIcon,
                            },
                            {
                                title: "Enrollments",
                                url: "/enrollments",
                                icon: UserCheckIcon,
                            },
                            {
                                title: "Attendance",
                                url: "/attendance",
                                icon: ClipboardCheckIcon,
                            },
                        ],
                    },
                ],
            };

        case "ADVISOR":
            return {
                sections: [
                    {
                        title: "My Batch",
                        items: [
                            {
                                title: "Students",
                                url: "/list/students",
                                icon: UsersIcon,
                            },
                            {
                                title: "Enrollments",
                                url: "/enrollments",
                                icon: UserCheckIcon,
                            },
                        ],
                    },
                ],
            };

        case "HOD":
            return {
                sections: [
                    {
                        title: "Department",
                        items: [
                            {
                                title: "Students",
                                url: "/list/students",
                                icon: UsersIcon,
                            },
                            {
                                title: "Instructors",
                                url: "/list/instructors",
                                icon: GraduationCapIcon,
                            },
                        ],
                    },
                    {
                        title: "Academics",
                        items: [
                            {
                                title: "Courses",
                                url: "/courses",
                                icon: BookOpenIcon,
                            },
                            {
                                title: "Course Offerings",
                                url: "/offerings",
                                icon: Grid3x3Icon,
                            },
                        ],
                    },
                ],
            };

        default:
            return {
                sections: [],
            };
    }
}
