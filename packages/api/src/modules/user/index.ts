import { createTRPCRouter, protectedProcedure } from "@workspace/api/init";
import { imageUploadInput } from "./schema";
import { TRPCError } from "@trpc/server";
import { removeUserProfileImage, uploadUserProfileImage } from "./utils";
import { db, document, user } from "@workspace/db";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
    changeProfileImage: protectedProcedure
        .input(imageUploadInput)
        .mutation(async ({ ctx, input }) => {
            const { user: currentUser } = ctx.session;
            const { image } = input;

            const arrayBuffer = await image.arrayBuffer();

            const { key, mimeType, size } = await uploadUserProfileImage({
                bytes: arrayBuffer,
                userId: currentUser.id,
            });

            let oldKey: string | null = null;
            let documentId: string | null = null;

            try {
                await db.transaction(async (tx) => {
                    const existing = await tx.query.document.findFirst({
                        where: (d, { eq }) => eq(d.userId, currentUser.id),
                    });

                    if (existing) {
                        oldKey = existing.key;
                        documentId = existing.id;

                        await tx
                            .update(document)
                            .set({ key, mimeType, size })
                            .where(eq(document.id, existing.id));
                    } else {
                        const [newDoc] = await tx
                            .insert(document)
                            .values({
                                key,
                                mimeType,
                                size,
                                userId: currentUser.id,
                            })
                            .returning({ id: document.id });

                        documentId = newDoc!.id;
                    }

                    await tx
                        .update(user)
                        .set({ image: `/api/image/${documentId}` })
                        .where(eq(user.id, currentUser.id));
                });

                if (oldKey && oldKey !== key) {
                    await removeUserProfileImage({
                        key: oldKey,
                        userId: currentUser.id,
                    });
                }

                return {
                    imageUrl: `/api/image/${documentId}`,
                };
            } catch (error) {
                await removeUserProfileImage({
                    key,
                    userId: currentUser.id,
                });

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to update profile image",
                });
            }
        }),

    removeProfileImage: protectedProcedure.mutation(async ({ ctx }) => {
        const { user: currentUser } = ctx.session;
        let oldKey: string | null = null;

        try {
            await db.transaction(async (tx) => {
                const existing = await tx.query.document.findFirst({
                    where: (d, { eq }) => eq(d.userId, currentUser.id),
                });

                if (!existing) return;

                oldKey = existing.key;

                await tx.delete(document).where(eq(document.id, existing.id));

                await tx
                    .update(user)
                    .set({ image: null })
                    .where(eq(user.id, currentUser.id));
            });

            if (oldKey) {
                await removeUserProfileImage({
                    key: oldKey,
                    userId: currentUser.id,
                });
            }
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to remove profile image",
            });
        }
    }),
});
