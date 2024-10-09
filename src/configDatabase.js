import mysql from "mysql2/promise";

async function connectToDatabase(dbName, port = "3306") {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: port,
      user: "root",
      password: "1234",
      database: dbName,
    });
    console.log(`Connected to database! ${dbName}`);
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

export { connectToDatabase };
