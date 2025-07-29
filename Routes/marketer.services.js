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
    console.log("marketer Database is connected");
});

// Create new marketer
router.post("/marketer", (req, res) => {
    console.log("post Request Received");

    con.query("INSERT INTO marketer (portfolio, logo, authorization, years_of_experience, certifications, crm_ID,email,password) VALUES (?, ?, ?, ?, ?, ?,?,?)", 
    [req.body.portfolio,req.body.logo,req.body.authorization,req.body.years_of_experience,req.body.certifications,req.body.crm_ID,req.body.email,req.body.password], 
    function(err,result,fields){
    if (err) throw err;
        res.json({ "Status": "OK", "Message": `Record Added Successfully with Id ${result.insertId}` });
   console.log("Record added"+ result.insertId);
    });
});

// Get marketer that are not soft deleted


router.get('/marketer', (req, res) => {
    var marketer_ID = req.query.marketer_ID;

    if (marketer_ID) {
        // if marketer_ID is provided
        con.query("SELECT * FROM marketer WHERE is_deleted = 0 AND marketer_ID = ?", [marketer_ID], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    } else {
        // if no marketer_ID provided, get all
        con.query("SELECT * FROM marketer WHERE is_deleted = 0", function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
});

// Soft Delete marketer
router.delete('/marketer', (req, res) => {
    const marketer_ID = req.query.marketer_ID;

    con.query("SELECT is_deleted FROM marketer WHERE marketer_ID = ?", [marketer_ID], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.json({ "Status": "Error", "Message": `Record Id [${marketer_ID}] not found` });
        }

        if (result[0].is_deleted === 1) {
            return res.json({ "Status": "Error", "Message": `Record Id [${marketer_ID}] is already deleted` });
        }

        con.query("UPDATE marketer SET is_deleted = 1 WHERE marketer_ID = ?", [marketer_ID], (err, result) => {
            if (err) throw err;
            res.json({ "Status": "OK", "Message": `Record Id [${marketer_ID}] deleted Successfully` });
            console.log(`Soft deleted marketer record [${marketer_ID}]`);
        });
    });
});

// Update 
router.put('/marketer',(req,res)=>{
    console.log("PUT Request Received");
    var marketer_ID= req.query.marketer_ID;
    con.query("UPDATE marketer SET portfolio = ?, logo = ?, authorization = ?, years_of_experience = ?, certifications = ? ,email=?,password=? WHERE marketer_ID = " + marketer_ID,
    [req.body.portfolio,req.body.logo,req.body.authorization,req.body.years_of_experience,req.body.certifications,req.body.email,req.body.password,marketer_ID], function (err, result, fields) {
    if (err) throw err;
    res.json({"Status":"OK", "Message": "Record Id ["+ marketer_ID + "] is Updated Successfully"});
    console.log("Record Id ["+ marketer_ID+ "] is Updated Successfully");
    });
    });

    //search
    router.get('/marketer/search',(req,res)=>{
        keyword = req.query.keyword;
        keyvalue = req.query.keyvalue;
        sort = req.query.sort;
        con.query("SELECT * FROM marketer where " + keyword + " = ? order by marketer_ID " + sort , [keyvalue],
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
    router.post('/marketer/login',(req,res)=>{
        con.query("SELECT * FROM marketer where email = ? and password = ?",
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