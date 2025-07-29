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
    console.log("bid_history Database is connected");
});

// Create new bid_history
router.post("/bid_history", (req, res) => {
    console.log("post Request Received");

    con.query("INSERT INTO bid_history (type, status, amount, date_time, org_rep_ID, campaign_ID) VALUES (?, ?, ?, ?, ?, ?)", 
        [req.body.type, req.body.status, req.body.amount, req.body.date_time, req.body.org_rep_ID, req.body.campaign_ID], 
    function(err,result,fields){
    if (err) throw err;
        res.json({ "Status": "OK", "Message": `Record Added Successfully with Id ${result.insertId}` });
   console.log("Record added"+ result.insertId);
    });
});

// Get bid_history

router.get('/bid_history', (req, res) => {
    var bid_ID = req.query.bid_ID;

    if (bid_ID) {
        // if bid_ID is provided
        con.query("SELECT * FROM bid_history WHERE is_deleted = 0 AND bid_ID = ?", [bid_ID], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    } else {
        // if no bid_ID provided, get all
        con.query("SELECT * FROM bid_history WHERE is_deleted = 0", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
});

// Soft delete bid_history
router.delete('/bid_history', (req, res) => {
    const bid_ID = req.query.bid_ID;

    con.query("SELECT is_deleted FROM bid_history WHERE bid_ID = ?", [bid_ID], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.json({ "Status": "Error", "Message": `Record Id [${bid_ID}] not found` });
        }

        if (result[0].is_deleted === 1) {
            return res.json({ "Status": "Error", "Message": `Record Id [${bid_ID}] is already deleted` });
        }

        con.query("UPDATE bid_history SET is_deleted = 1 WHERE bid_ID = ?", [bid_ID], (err, result) => {
            if (err) throw err;
            res.json({ "Status": "OK", "Message": `Record Id [${bid_ID}] deleted Successfully` });
            console.log(`Soft deleted bid_history record [${bid_ID}]`);
        });
    });
});
 

// Update 
router.put('/bid_history',(req,res)=>{
    console.log("PUT Request Received");
    var bid_ID= req.query.bid_ID;
    con.query("UPDATE bid_history SET type = ?, status = ?, amount = ?, date_time = ?, org_rep_ID = ?, campaign_ID = ? WHERE bid_ID = ?", 
        [req.body.type, req.body.status, req.body.amount, req.body.date_time, req.body.org_rep_ID, req.body.campaign_ID, bid_ID],  function (err, result, fields) {
    if (err) throw err;
    res.json({"Status":"OK", "Message": "Record Id ["+ bid_ID + "] is Updated Successfully"});
    console.log("Record Id ["+ bid_ID+ "] is Updated Successfully");
    });
    });


//search
router.get('/bid_history/search',(req,res)=>{
    keyword = req.query.keyword;
    keyvalue = req.query.keyvalue;
    sort = req.query.sort;
    con.query("SELECT * FROM bid_history where " + keyword + " = ? order by bid_ID " + sort , [keyvalue],
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
router.get('/bid_history/login',(req,res)=>{
    con.query("SELECT * FROM bid_history where bid_ID = ? ",
    [req.body.bid_ID], function (err, result, fields) {
    if (err) {
        res.json({"Status": "Error","Message": err});
    }
    else{
        if (result.length == 0){
            res.json({"Status": "Error","Message": "Authentication Failed, Check bid_ID...!!!"}); console.log(result);
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