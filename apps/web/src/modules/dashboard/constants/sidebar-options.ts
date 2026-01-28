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
import type { Route } from "next";
import type { ElementType } from "react";

type SidebarItem = {
    title: string;
    url: Route;
    icon: ElementType;
};

type SidebarSection = {
    title: string;
    icon: ElementType;
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
                        icon: SchoolIcon,
                        items: [
                            {
                                title: "Departments",
                                url: "/departments",
                                icon: FolderOpenIcon,
                            },
                            {
                                title: "Instructors",
                                url: "/instructors",
                                icon: UserIcon,
                            },
                            {
                                title: "Advisors",
                                url: "/advisors",
                                icon: LayersIcon,
                            },
                            {
                                title: "HODs",
                                url: "/hods",
                                icon: LayersIcon,
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
                        icon: BookMarkedIcon,
                        items: [
                            {
                                title: "Courses",
                                url: "/courses",
                                icon: BookOpenIcon,
                            },
                            {
                                title: "Feedback Questions",
                                url: "/feedback-questions",
                                icon: MessageSquareIcon,
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
                        ],
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
                sections: [
                    {
                        title: "Academics",
                        icon: SchoolIcon,
                        items: [
                            {
                                title: "Courses",
                                url: "/courses",
                                icon: BookOpenIcon,
                            },
                            {
                                title: "Course Offerings",
                                url: "/offerings",
                                icon: LayoutGridIcon,
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
                sections: [
                    {
                        title: "Teaching",
                        icon: BookMarkedIcon,
                        items: [
                            {
                                title: "Courses",
                                url: "/courses",
                                icon: BookOpenIcon,
                            },
                            {
                                title: "Enrollments",
                                url: "/enrollments",
                                icon: ClipboardListIcon,
                            },
                            {
                                title: "Attendance",
                                url: "/attendance",
                                icon: CheckSquareIcon,
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
                ],
            };

        case "HOD":
            return {
                sections: [
                    {
                        title: "Department",
                        icon: SchoolIcon,
                        items: [
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
                        title: "Academics",
                        icon: BookMarkedIcon,
                        items: [
                            {
                                title: "Courses",
                                url: "/courses",
                                icon: BookOpenIcon,
                            },
                            {
                                title: "Course Offerings",
                                url: "/offerings",
                                icon: LayoutGridIcon,
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
