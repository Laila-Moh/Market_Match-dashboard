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
    console.log("campaign Database is connected");
});

// Create new campaign
router.post("/campaign", (req, res) => {
    console.log("post Request Received");

    con.query("INSERT INTO campaign (name, description, org_rep_ID, crm_ID) VALUES (?, ?, ?, ?)", 
        [req.body.name, req.body.description, req.body.org_rep_ID, req.body.crm_ID], 
    function(err,result,fields){
    if (err) throw err;
        res.json({ "Status": "OK", "Message": `Record Added Successfully with Id ${result.insertId}` });
   console.log("Record added"+ result.insertId);
    });
});


// Get campaign that are not soft deleted
// Fetch all campaigns (not soft-deleted)
router.get('/campaign', (req, res) => {
    var campaign_ID = req.query.campaign_ID;

    if (campaign_ID) {
        con.query("SELECT * FROM campaign WHERE is_deleted = 0 AND campaign_ID = ?", [campaign_ID], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    } else {
        con.query("SELECT * FROM campaign WHERE is_deleted = 0", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
});




// Soft Delete campaign
router.delete('/campaign', (req, res) => {
    const campaign_ID = req.query.campaign_ID;

    con.query("SELECT is_deleted FROM campaign WHERE campaign_ID = ?", [campaign_ID], function (err, result) {
        if (err) return res.status(500).json({ "Status": "Error", "Message": err });

        if (result.length === 0) {
            return res.json({ "Status": "Error", "Message": `Record Id [${campaign_ID}] not found` });
        }

        if (result[0].is_deleted === 1) {
            return res.json({ "Status": "Error", "Message": `Record Id [${campaign_ID}] is already deleted` });
        }

        con.query("UPDATE campaign SET is_deleted = 1 WHERE campaign_ID = ?", [campaign_ID], function (err, result) {
            if (err) return res.status(500).json({ "Status": "Error", "Message": err });

            res.json({ "Status": "OK", "Message": `Record Id [${campaign_ID}] soft-deleted successfully` });
            console.log(`Soft delete applied to campaign [${campaign_ID}]`);
        });
    });
});
  

// Update 
router.put('/campaign',(req,res)=>{
    console.log("PUT Request Received");
    var campaign_ID= req.query.campaign_ID;
    con.query("UPDATE campaign SET name = ?, description = ?, org_rep_ID = ?, crm_ID = ? WHERE campaign_ID =" + campaign_ID ,
    [req.body.name, req.body.description, req.body.org_rep_ID, req.body.crm_ID, campaign_ID],  function (err, result, fields) {
    if (err) throw err;
    res.json({"Status":"OK", "Message": "Record Id ["+ campaign_ID + "] is Updated Successfully"});
    console.log("Record Id ["+ campaign_ID+ "] is Updated Successfully");
    });
    });


//search
router.get('/campaign/search',(req,res)=>{
    keyword = req.query.keyword;
    keyvalue = req.query.keyvalue;
    sort = req.query.sort;
    con.query("SELECT * FROM campaign where " + keyword + " = ? order by campaign_ID " + sort , [keyvalue],
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
router.get('/campaign/login',(req,res)=>{
    con.query("SELECT * FROM campaign where campaign_ID = ? and name = ?",
    [req.body.campaign_ID, req.body.name], function (err, result, fields) {
    if (err) {
        res.json({"Status": "Error","Message": err});
    }
    else{
        if (result.length == 0){
            res.json({"Status": "Error","Message": "Authentication Failed, Check campain_ID or name ...!!!"}); console.log(result);
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