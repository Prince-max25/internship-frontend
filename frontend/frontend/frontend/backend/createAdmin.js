const bcrypt = require("bcryptjs");
const { pool } = require("./config/db");

const resetAdminPassword = async () => {
try {
const password = "Admin@123";
const hashedPassword = await bcrypt.hash(password, 10);

const [result] = await pool.query(
  `UPDATE admins
   SET password = ?
   WHERE username = ?`,
  [hashedPassword, "admin"]
);

if (result.affectedRows === 0) {
  console.log(
    "No admin account was updated. Check the username."
  );
} else {
  console.log("Admin password updated successfully.");
  console.log("Username: admin");
  console.log("Email: admin@portal.com");
  console.log("Password: Admin@123");
}


} catch (error) {
console.error(
"Error updating admin password:",
error.message
);
} finally {
await pool.end();
}
};

resetAdminPassword();
