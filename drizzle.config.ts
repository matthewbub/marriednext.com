// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_p0MIeGDVPA4J@ep-small-bush-afr8vgj8-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});
