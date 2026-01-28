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

export const createCourseDescription = (
    summary: string,
    objectives: string[],
    outcomes: string[]
) => {
    return [
        {
            type: "heading",
            props: {
                level: 2,
                textColor: "default",
                backgroundColor: "default",
                textAlignment: "left",
            },
            content: [
                {
                    type: "text",
                    text: "Course Overview",
                    styles: { bold: true },
                },
            ],
            children: [],
        },
        {
            type: "paragraph",
            props: {
                textColor: "default",
                backgroundColor: "default",
                textAlignment: "left",
            },
            content: [{ type: "text", text: summary, styles: {} }],
            children: [],
        },
        {
            type: "heading",
            props: {
                level: 3,
                textColor: "default",
                backgroundColor: "default",
                textAlignment: "left",
            },
            content: [
                {
                    type: "text",
                    text: "Learning Objectives",
                    styles: { bold: true },
                },
            ],
            children: [],
        },
        ...objectives.map((obj) => ({
            type: "bulletListItem",
            props: {
                textColor: "default",
                backgroundColor: "default",
                textAlignment: "left",
            },
            content: [{ type: "text", text: obj, styles: {} }],
            children: [],
        })),
        {
            type: "heading",
            props: {
                level: 3,
                textColor: "default",
                backgroundColor: "default",
                textAlignment: "left",
            },
            content: [
                {
                    type: "text",
                    text: "Course Outcomes",
                    styles: { bold: true },
                },
            ],
            children: [],
        },
        ...outcomes.map((out) => ({
            type: "bulletListItem",
            props: {
                textColor: "default",
                backgroundColor: "default",
                textAlignment: "left",
            },
            content: [{ type: "text", text: out, styles: {} }],
            children: [],
        })),
    ];
};

export function withAlias(baseEmail: string, alias: string) {
    const [local, domain] = baseEmail.split("@");
    return `${local}+${alias}@${domain}`;
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

export const createBulkUsers = async (users: CreateUserInput[]) => {
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
            createdUsers.map(async (createdUser, index) => {
                const inputUser = users[index]!;
                const plainPassword = inputUser.password ?? randomHex();
                const hashedPassword = await createAuthHash(plainPassword);

                return {
                    userId: createdUser.id,
                    accountId: createdUser.id,
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
