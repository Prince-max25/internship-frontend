const bcrypt = require("bcryptjs");
const { pool } = require("./config/db");

const createAdmin = async () => {
  try {
    const password = "Admin@123";

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO admins
      (full_name, username, email, password)
      VALUES (?, ?, ?, ?)`,
      [
        "System Administrator",
        "admin",
        "admin@portal.com",
        hashedPassword,
      ]
    );

    console.log("Admin account created successfully.");

    console.log("Username: admin");
    console.log("Email: admin@portal.com");
    console.log("Password: Admin@123");

    process.exit(0);

  } catch (error) {
    console.error("Error creating admin:", error);

    process.exit(1);
  }
};

createAdmin();