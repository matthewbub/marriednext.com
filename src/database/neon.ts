import postgres from "postgres";

const { DATABASE_URL } = process.env;

const db = postgres(DATABASE_URL!, { ssl: "require" });

export default db;
