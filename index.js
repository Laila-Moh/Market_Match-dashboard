const express= require('express');
const bodyParser= require('body-parser');
const mysql= require('mysql2');
const dotenv= require('dotenv');

const cors=require('cors')

// const https = require('https');  
// const fs = require('fs');  

const app= express();

dotenv.config();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST','PUT','DELETE']
}));

app.use(bodyParser.json());

const db=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306
});

db.connect((err) => {
    if (err) throw err;
    console.log('index is connected to MySql');
});

app.get('/',(req,res)=>{
    res.send('Backend is working!');
});

const userRoute=require('./Routes/user.services');
app.use('/api',userRoute);

const crmRoute = require('./Routes/crm.services');
app.use('/api', crmRoute);

const organization_representativeRoute = require('./Routes/organization_representative.services');
app.use('/api', organization_representativeRoute);

const marketerRouter = require('./Routes/marketer.services');
app.use('/api', marketerRouter);

const campaignRouter = require('./Routes/campaign.services');
app.use('/api', campaignRouter);

const bid_historyRouter = require('./Routes/bid_history.services');
app.use('/api', bid_historyRouter);


// 3lshan 3amleen HTTPS 
// const options = {
//     key: fs.readFileSync('C:/Users/win10/mycert.pem'),
//     cert: fs.readFileSync('C:/Users/win10/mycert.pem')
// };


// const PORT = 3000;
// https.createServer(options, app).listen(PORT, () => {
//     console.log(`Server running on https://localhost:${PORT}`);
// });

// law http bs 

const PORT=5000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

