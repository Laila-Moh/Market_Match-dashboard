// Required dependencies
const mysql = require("mysql2");
const express = require("express");
const router = express.Router();
router.use(express.json());

// Database connection
global.con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "computer_application",
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Database connected");
});

// ========== USER ROUTES ========== //

// Create new user (Admin or non-admin)
// Create new user (Admin or non-admin)
router.post("/user", (req, res) => {
    const { user_name, user_email, user_address, role, user_type } = req.body;

    // Check if all required fields are provided
    if (!user_name || !user_email || !user_address || !role || !user_type) {
        return res.status(400).json({ Message: "All fields are required." });
    }

    // Query to insert new user into the database
    const query = "INSERT INTO user (user_name, user_email, user_address, role, user_type) VALUES (?, ?, ?, ?, ?)";

    con.query(query, [user_name, user_email, user_address, role, user_type], (err, result) => {
        if (err) {
            console.error("Insert error:", err);
            return res.status(500).json({ Message: "Database error" });
        }
        res.status(201).json({ Message: "User added successfully" });
    });
});


// Get users (excluding soft-deleted)
router.get("/user", (req, res) => {
    const user_ID = req.query.user_ID;

    const sql = user_ID
        ? "SELECT * FROM user WHERE is_deleted = 0 AND user_ID = ?"
        : "SELECT * FROM user WHERE is_deleted = 0";

    const params = user_ID ? [user_ID] : [];

    con.query(sql, params, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});
// Update user
router.put('/user', (req, res) => {
    const { user_ID, user_name, user_email, user_address, role, user_type } = req.body;

    // Validate input
    if (!user_ID || !user_name || !user_email || !user_address || !role || !user_type) {
        return res.status(400).json({ Message: "All fields are required." });
    }

    // Check if the user exists
    const checkQuery = "SELECT * FROM user WHERE user_ID = ?";
    con.query(checkQuery, [user_ID], (err, result) => {
        if (err) {
            console.error("Error checking user existence:", err);
            return res.status(500).json({ Message: "Database error while checking user" });
        }

        if (result.length === 0) {
            return res.status(404).json({ Message: `User ID [${user_ID}] not found` });
        }

        // Query to update the user
        const query = "UPDATE user SET user_name = ?, user_email = ?, user_address = ?, role = ?, user_type = ? WHERE user_ID = ?";

        con.query(query, [user_name, user_email, user_address, role, user_type, user_ID], (err, result) => {
            if (err) {
                console.error("Update error:", err);
                return res.status(500).json({ Message: "Database error" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ Message: "User not found" });
            }

            res.status(200).json({ Message: "User updated successfully" });
        });
    });
});



// Soft delete user

router.delete("/user", (req, res) => {
    const user_ID = req.query.user_ID;

    con.query("SELECT is_deleted FROM user WHERE user_ID = ?", [user_ID], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.json({ "Status": "Error", "Message": `User ID [${user_ID}] not found` });
        }

        if (result[0].is_deleted === 1) {
            return res.json({ "Status": "Error", "Message": `User ID [${user_ID}] is already deleted` });
        }

        con.query("UPDATE user SET is_deleted = 1 WHERE user_ID = ?", [user_ID], (err, result) => {
            if (err) throw err;
            res.json({ "Status": "OK", "Message": `User ID [${user_ID}] deleted successfully` });
        });
    });
});

// Restore soft-deleted user
router.patch("/user/restore", (req, res) => {
    const user_ID = req.query.user_ID;

    con.query("UPDATE user SET is_deleted = 0 WHERE user_ID = ?", [user_ID], (err, result) => {
        if (err) throw err;
        res.json({ "Status": "OK", "Message": `User ID [${user_ID}] restored successfully` });
    });
});

// Search user
router.get("/user/search", (req, res) => {
    const keyword = req.query.keyword;
    const keyvalue = req.query.keyvalue;
    const sort = req.query.sort || "ASC";

    con.query(`SELECT * FROM user WHERE ${keyword} = ? AND is_deleted = 0 ORDER BY user_ID ${sort}`, [keyvalue], (err, result) => {
        if (err) {
            res.json({ "Status": "Error", "Message": err });
        } else {
            res.json(result);
        }
    });
});

// User login
router.post("/user/login", (req, res) => {
    const { email, password } = req.body;

    con.query("SELECT * FROM user WHERE email = ? AND password = ? AND is_deleted = 0", [email, password], (err, result) => {
        if (err) return res.json({ "Status": "Error", "Message": err });

        if (result.length === 0) {
            return res.json({ "Status": "Error", "Message": "Authentication Failed. Check credentials." });
        }

        res.json({ "Status": "OK", "Message": "Logged in successfully" });
    });
});

// User logout (dummy logout for stateless JWT/token-based systems)
router.post("/user/logout", (req, res) => {
    // If using sessions, destroy session here
    res.json({ "Status": "OK", "Message": "Logged out successfully" });
});

module.exports = router;
