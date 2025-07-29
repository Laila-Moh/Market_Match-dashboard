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
    console.log("organization_representative Database is connected");
});

// Create new organization_representative
router.post("/organization_representative", (req, res) => {
    const {
      organization_name,
      industry_focus,
      department,
      annual_budget,
      position,
      size,
      crm_ID,
      email,
      password
    } = req.body;
  
    // Validation
    if (!organization_name || !industry_focus || !department || !annual_budget || !position || !size || !email || !password) {
      return res.status(400).json({ Message: "All required fields must be filled." });
    }
  
    // Insert Query
    const query = `
INSERT INTO organization_representative 
(organization_name, industry_focus, department, annual_budget, position, size, crm_ID, email, password, is_deleted)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;
  
    con.query(
      query,
      [organization_name, industry_focus, department, annual_budget, position, size, crm_ID, email, password],
      (err, result) => {
        if (err) {
          console.error("Insert error:", err);
          return res.status(500).json({ Message: "Database error", Error: err });
        }
        res.status(201).json({ Message: "Organization representative added successfully" });
      }
    );
  });
  

// Get organization_representative that are not soft deleted
router.get('/organization_representative', (req, res) => {
    const org_rep_ID = req.query.org_rep_ID;

    if (!org_rep_ID) {
        // Return ALL non-deleted records
        con.query("SELECT * FROM organization_representative WHERE is_deleted = 0", (err, result) => {
            if (err) return res.status(500).json({ Message: "Database error", Error: err });
            res.json(result);
        });
    } else if (org_rep_ID == '%') {
        con.query("SELECT * FROM organization_representative WHERE is_deleted = 0 AND org_rep_ID LIKE ?", [org_rep_ID], (err, result) => {
            if (err) return res.status(500).json({ Message: "Database error", Error: err });
            res.json(result);
        });
    } else {
        con.query("SELECT * FROM organization_representative WHERE is_deleted = 0 AND org_rep_ID = ?", [org_rep_ID], (err, result) => {
            if (err) return res.status(500).json({ Message: "Database error", Error: err });
            res.json(result);
        });
    }
});



// Soft Delete organization_representative
router.delete('/organization_representative', (req, res) => {
    const org_rep_ID = req.query.org_rep_ID;

    con.query("SELECT is_deleted FROM organization_representative WHERE org_rep_ID = ?", [org_rep_ID], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.json({ "Status": "Error", "Message": `Record Id [${org_rep_ID}] not found` });
        }

        if (result[0].is_deleted === 1) {
            return res.json({ "Status": "Error", "Message": `Record Id [${org_rep_ID}] is already deleted` });
        }

        con.query("UPDATE organization_representative SET is_deleted = 1 WHERE org_rep_ID = ?", [org_rep_ID], (err, result) => {
            if (err) throw err;
            res.json({ "Status": "OK", "Message": `Record Id [${org_rep_ID}] deleted Successfully` });
            console.log(`Soft deleted organization_representative record [${org_rep_ID}]`);
        });
    });
});
   

// Update organization representative
router.put("/organization_representative", (req, res) => {
    const {
      org_rep_ID,
      organization_name,
      industry_focus,
      department,
      annual_budget,
      position,
      size,
      crm_ID,
      email,
      password
    } = req.body;
  
    // Validate required fields
    if (!org_rep_ID) {
      return res.status(400).json({ Message: "org_rep_ID is required for updating the record." });
    }
  
    // Update query
    const query = `
      UPDATE organization_representative
      SET 
        organization_name = ?,
        industry_focus = ?,
        department = ?,
        annual_budget = ?,
        position = ?,
        size = ?,
        crm_ID = ?,
        email = ?,
        password = ?
      WHERE org_rep_ID = ?
    `;
  
    con.query(
      query,
      [
        organization_name,
        industry_focus,
        department,
        annual_budget,
        position,
        size,
        crm_ID,
        email,
        password,
        org_rep_ID
      ],
      (err, result) => {
        if (err) {
          console.error("Update error:", err);
          return res.status(500).json({ Message: "Database update failed", Error: err });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ Message: "No record found with the given org_rep_ID." });
        }
  
        res.status(200).json({ Message: "Organization representative updated successfully" });
      }
    );
  });
  
  

    //search
    router.get('/organization_representative/search',(req,res)=>{
        keyword = req.query.keyword;
        keyvalue = req.query.keyvalue;
        sort = req.query.sort;
        con.query("SELECT * FROM organization_representative where " + keyword + " = ? order by org_rep_ID " + sort , [keyvalue],
        function (err, result, fields) {
        if (err) {
            res.json({"Status": "Error","Message": err});
        }else{
            res.json(result);
            console.log(result);
        }
        });
        console.log ("Incoming SEARCH Request");
    });
        
    //login
    router.get('/organization_representative/login',(req,res)=>{
        con.query("SELECT * FROM organization_representative where email = ? and password = ?",
        [req.body.email, req.body.password], function (err, result, fields) {
        if (err) {
            res.json({"Status": "Error","Message": err});
        }
        else{
            if (result.length == 0){
                res.json({"Status": "Error","Message": "Authentication Failed, Check username or password ...!!!"}); console.log(result);
            }
            else{
                res.json({"Status": "OK","Message": "Loged In Successfully"});
                console.log(result);
            }
        }
        });
        console.log ("Incoming SEARCH Request");
    });
        
    
    module.exports = router;