import { db } from "./client";
import { auditLog, type AuditAction, type AuditEntity } from "./schema";

export const logAuditEvent = async (event: {
    userId: string;
    action: AuditAction;
    entityType: AuditEntity;
    entityId?: string;
    before?: any;
    after?: any;
    ipAddress?: string | null;
    userAgent?: string | null;
}) => {
    const { action, entityType, userId, after, before, entityId, ipAddress, userAgent } = event;
    try {
        await db.insert(auditLog).values({
            actorId: userId,
            action,
            entityType,
            entityId,
            before,
            after,
            ipAddress,
            userAgent,
        });
    } catch (error) {
        console.error("Failed to log audit event:", error);
    }
};