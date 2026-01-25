import { createTRPCRouter } from "@workspace/api/init";
import { adminProcedure } from "../middleware";
import { auditLog, course, db, enrollment, student, user } from "@workspace/db";
import { desc, eq, gte, sql } from "drizzle-orm";
import { enrollmentChartDataInputSchema } from "../schema";

export const metricsViewer = createTRPCRouter({
    chartData: adminProcedure
        .input(enrollmentChartDataInputSchema)
        .query(async ({ input }) => {
            const { days } = input;
            const rows = await db
                .select({
                    date: sql<Date>`date_trunc('day', ${enrollment.createdAt})`,
                    pending: sql<number>`count(*) FILTER (WHERE ${enrollment.status} = 'PENDING')`,
                    approved: sql<number>`count(*) FILTER (WHERE ${enrollment.status} = 'APPROVED')`,
                })
                .from(enrollment)
                .where(
                    gte(
                        enrollment.createdAt,
                        sql`now() - interval '${sql.raw(String(days))} days'`
                    )
                )
                .groupBy(sql`date_trunc('day', ${enrollment.createdAt})`)
                .orderBy(sql`date_trunc('day', ${enrollment.createdAt})`);

            return rows.map((r) => ({
                date: r.date.toISOString().slice(0, 10),
                pending: r.pending,
                approved: r.approved,
            }));
        }),

    cardMetrics: adminProcedure.query(async ({ input }) => {
        const [{ count: usersCount } = { count: 0 }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(user);

        const [{ count: studentsCount } = { count: 0 }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(student);

        const [{ count: coursesCount } = { count: 0 }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(course);

        const [{ count: pendingCount } = { count: 0 }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(enrollment)
            .where(eq(enrollment.status, "PENDING"));

        return {
            totalUsers: Number(usersCount),
            totalStudents: Number(studentsCount),
            totalCourses: Number(coursesCount),
            pendingEnrollments: Number(pendingCount),
        };
    }),

    recentLogs: adminProcedure.query(async () => {
        return db
            .select({
                id: auditLog.id,
                action: auditLog.action,
                entityType: auditLog.entityType,
                entityId: auditLog.entityId,
                actorEmail: user.email,
                createdAt: auditLog.createdAt,
            })
            .from(auditLog)
            .leftJoin(user, eq(auditLog.actorId, user.id))
            .orderBy(desc(auditLog.createdAt))
            .limit(20);
    }),
});
