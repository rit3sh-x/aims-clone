import { Users, GraduationCap, BookOpen, Clock } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useMetricCards } from "@/modules/dashboard/hooks/use-metrics";

export const AdminSectionCards = () => {
    const { data: cardMetrics } = useMetricCards();

    return (
        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-4 lg:px-6">
            <Card>
                <CardHeader>
                    <CardDescription>Total Users</CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                        {cardMetrics.totalUsers}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <Users className="size-4" />
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                    All registered accounts
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Active Students</CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                        {cardMetrics.totalStudents}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <GraduationCap className="size-4" />
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                    Enrolled students
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Total Courses</CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                        {cardMetrics.totalCourses}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <BookOpen className="size-4" />
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                    Across all departments
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Pending Enrollments</CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                        {cardMetrics.pendingEnrollments}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="destructive">
                            <Clock className="size-4" />
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                    Requires approval
                </CardFooter>
            </Card>
        </div>
    );
};

export const AdminSectionCardsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-4 lg:px-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-20" />
                    </CardHeader>
                    <CardFooter>
                        <Skeleton className="h-4 w-32" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};
