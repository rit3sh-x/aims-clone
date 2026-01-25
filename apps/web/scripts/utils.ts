import { auth } from "@workspace/auth";
import { account, db, twoFactor, user, type UserRole } from "@workspace/db";
import { randomBytes } from "crypto";

export function randomHex(length = 32): string {
    if (length < 8 || length > 64) {
        throw new Error("length must be between 8 and 64");
    }

    return randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
}

export const createAuthHash = async (password: string) => {
    const hashFn = (await auth.$context).password.hash;
    return hashFn(password);
};

type CreateUserInput = {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
};

export const createUser = async ({
    name,
    email,
    role,
    password,
}: CreateUserInput) => {
    const userPassword = password ?? randomHex();
    const hashedPassword = await createAuthHash(userPassword);

    return db.transaction(async (tx) => {
        const [createdUser] = await tx
            .insert(user)
            .values({
                email: email.toLowerCase(),
                name,
                role,
                emailVerified: true,
                twoFactorEnabled: true,
            })
            .returning();

        if (!createdUser) {
            throw new Error(`Failed to add user with email: ${email}`);
        }

        await tx.insert(account).values({
            userId: createdUser.id,
            accountId: createdUser.id,
            providerId: "credential",
            password: hashedPassword,
        });

        await tx.insert(twoFactor).values({
            userId: createdUser.id,
            backupCodes: JSON.stringify([]),
        });

        return createdUser;
    });
};

type BulkUserInput = Omit<CreateUserInput, "password">;

export const createBulkUsers = async (users: BulkUserInput[]) => {
    if (users.length === 0) return [];

    return db.transaction(async (tx) => {
        const createdUsers = await tx
            .insert(user)
            .values(
                users.map((u) => ({
                    name: u.name,
                    email: u.email.toLowerCase(),
                    role: u.role,
                    emailVerified: true,
                    twoFactorEnabled: true,
                }))
            )
            .returning();

        if (createdUsers.length !== users.length) {
            throw new Error("Bulk user creation mismatch");
        }

        const accountsData = await Promise.all(
            createdUsers.map(async (u) => {
                const hashedPassword = await createAuthHash(randomHex());

                return {
                    userId: u.id,
                    accountId: u.id,
                    providerId: "credential",
                    password: hashedPassword,
                };
            })
        );

        await tx.insert(account).values(accountsData);

        await tx.insert(twoFactor).values(
            createdUsers.map((u) => ({
                userId: u.id,
                backupCodes: JSON.stringify([]),
            }))
        );

        return createdUsers;
    });
};
