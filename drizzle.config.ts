import type { Config } from "drizzle-kit";
export default {
    schema: "./src/server/db/schemas/schema.ts",
    out: "./src/server/db/drizzle",
    driver: 'mysql2',
    dbCredentials: {
        uri: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/trpc-test?ssl={"rejectUnauthorized":true}`,
    }
} satisfies Config;