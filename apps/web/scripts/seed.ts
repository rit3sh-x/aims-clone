import "dotenv/config";
import { authSeed, ROLES } from "@workspace/auth";
import { randomUUID } from "crypto";
import {
    db,
    twoFactor,
    user,
    DEPARTMENT_LABELS,
    department,
    departmentCodeEnum,
} from "@workspace/db";
import { eq } from "drizzle-orm";

async function main() {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    const name = process.env.SEED_ADMIN_NAME;

    if (!email || !password || !name) {
        console.error(
            "❌ Missing SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD or SEED_ADMIN_NAME"
        );
        process.exit(1);
    }

    await seedDepartments();

    const existing = await db.query.user.findFirst({
        where: eq(user.email, email),
    });

    if (existing) {
        console.log("ℹ️ Admin already exists:", email);
        return;
    }

    console.log("🚀 Creating admin:", email);

    const { user: admin } = await authSeed.api.createUser({
        body: {
            email,
            password,
            name,
            role: ROLES.ADMIN,
        },
    });

    if (!admin) {
        console.log("❌ Admin not created:", email);
    }

    const { id } = admin;

    await db.insert(twoFactor).values({
        id: randomUUID(),
        userId: id,
        backupCodes: JSON.stringify([]),
    });

    await db
        .update(user)
        .set({ twoFactorEnabled: true })
        .where(eq(user.id, id));

    console.log("✅ Admin user created successfully");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Failed to seed admin:", err);
        process.exit(1);
    });

async function seedDepartments() {
    console.log("🌱 Seeding departments...");

    const codes = departmentCodeEnum.enumValues;

    for (const code of codes) {
        const exists = await db.query.department.findFirst({
            where: eq(department.code, code),
        });

        if (exists) continue;

        await db.insert(department).values({
            id: randomUUID(),
            code: code,
            name: DEPARTMENT_LABELS[code],
        });

        console.log(`  ➕ ${code} - ${DEPARTMENT_LABELS[code]}`);
    }
}
