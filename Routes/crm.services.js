const mysql = require("mysql2"); 
const express = require("express"); 
const router = express.Router();
router.use(express.json());

global.con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "computer_application",
});

con.connect(function(err) {
    if (err) throw err;
    console.log("crm Database is connected");
});

// Create new CRM
router.post("/crm", (req, res) => {
    const { client_name, email, phone, company_name, industry } = req.body;

    if (!client_name || !email || !phone || !company_name || !industry) {
        return res.status(400).json({ Message: "All fields must be filled." });
    }

    const query = `
        INSERT INTO crm (client_name, email, phone, company_name, industry, created_at, updated_at, is_deleted)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 0)
    `;

    con.query(query, [client_name, email, phone, company_name, industry], (err, result) => {
        if (err) return res.status(500).json({ Message: "Database error", Error: err });
        res.status(201).json({ Message: `CRM record added with ID ${result.insertId}` });
    });
});

// Get CRM records (with optional filter)
router.get('/crm', (req, res) => {
    const crm_id = req.query.crm_id;

    if (crm_id) {
        con.query("SELECT * FROM crm WHERE is_deleted = 0 AND crm_id = ?", [crm_id], (err, result) => {
            if (err) return res.status(500).json({ Message: "Database error", Error: err });
            res.json(result);
        });
    } else {
        con.query("SELECT * FROM crm WHERE is_deleted = 0", (err, result) => {
            if (err) return res.status(500).json({ Message: "Database error", Error: err });
            res.json(result);
        });
    }
});

// Soft delete CRM record
router.delete('/crm', (req, res) => {
    const crm_id = req.query.crm_id;

    con.query("SELECT is_deleted FROM crm WHERE crm_id = ?", [crm_id], (err, result) => {
        if (err) return res.status(500).json({ Message: "Database error", Error: err });

        if (result.length === 0) {
            return res.status(404).json({ Message: `CRM ID ${crm_id} not found.` });
        }

        if (result[0].is_deleted === 1) {
            return res.status(400).json({ Message: `CRM ID ${crm_id} already deleted.` });
        }

        con.query("UPDATE crm SET is_deleted = 1 WHERE crm_id = ?", [crm_id], (err, result) => {
            if (err) return res.status(500).json({ Message: "Database error", Error: err });
            res.json({ Message: `CRM ID ${crm_id} deleted successfully.` });
        });
    });
});

// Update CRM
router.put('/crm', (req, res) => {
    const { crm_id, client_name, email, phone, company_name, industry } = req.body;

    if (!crm_id) {
        return res.status(400).json({ Message: "crm_id is required for update." });
    }

    const query = `
        UPDATE crm
        SET client_name = ?, email = ?, phone = ?, company_name = ?, industry = ?, updated_at = NOW()
        WHERE crm_id = ?
    `;

    con.query(query, [client_name, email, phone, company_name, industry, crm_id], (err, result) => {
        if (err) return res.status(500).json({ Message: "Update failed", Error: err });

        if (result.affectedRows === 0) {
            return res.status(404).json({ Message: "No CRM record found with the given ID." });
        }

        res.json({ Message: `CRM ID ${crm_id} updated successfully.` });
    });
});

// Search CRM
router.get('/crm/search', (req, res) => {
    const keyword = req.query.keyword;
    const keyvalue = req.query.keyvalue;
    const sort = req.query.sort?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    if (!keyword || !keyvalue) {
        return res.status(400).json({ Message: "Missing search keyword or keyvalue." });
    }

    const query = `SELECT * FROM crm WHERE is_deleted = 0 AND \`${keyword}\` = ? ORDER BY crm_id ${sort}`;
    con.query(query, [keyvalue], (err, result) => {
        if (err) return res.status(500).json({ Message: "Search failed", Error: err });
        res.json(result);
    });
});

module.exports = router;
