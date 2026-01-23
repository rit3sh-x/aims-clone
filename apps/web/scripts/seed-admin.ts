import "dotenv/config";
import { auth } from "@workspace/auth";
import { db, twoFactor, user, account } from "@workspace/db";
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

    const existing = await db.query.user.findFirst({
        where: eq(user.email, email.toLowerCase()),
    });

    if (existing) {
        console.log("ℹ️ Admin already exists:", email);
        return;
    }

    console.log("🚀 Creating admin:", email);

    const userId = crypto.randomUUID();
    const hashFn = (await auth.$context).password.hash;
    const hashedPassword = await hashFn(password);

    await db.transaction(async (tx) => {
        await tx.insert(user).values({
            id: userId,
            email: email.toLowerCase(),
            name,
            role: "ADMIN",
            emailVerified: true,
            twoFactorEnabled: true,
        });

        await tx.insert(account).values({
            userId,
            accountId: userId,
            providerId: "credential",
            password: hashedPassword,
        });

        await tx.insert(twoFactor).values({
            userId,
            backupCodes: JSON.stringify([]),
        });
    });

    console.log("✅ Admin user created successfully");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Failed to seed admin:", err);
        process.exit(1);
    });
