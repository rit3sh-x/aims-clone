import "dotenv/config";
import { db, user } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createUser } from "./utils";

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

    await createUser({
        email,
        name,
        role: "ADMIN",
        password,
    });

    console.log("✅ Admin user created successfully");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Failed to seed admin:", err);
        process.exit(1);
    });
