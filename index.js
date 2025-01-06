const express = require('express');
const usersData = require('./MOCK_DATA.json');
const fs = require('fs');

const app = express();
const PORT = 8000;

//  MIDDLEWARE
app.use(express.urlencoded({extended :false}));

//GET METHOD 
app.get('/api/usersData', (req, res) => {
    return res.json(usersData);
})


//GET METHOD for finding user
app.get('/api/usersData/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userData = usersData.find((userData) => userData.id === userId);
    return res.json(userData);
})

app.listen(PORT, () => {
    console.log("THE SERVER HAS STARTED AT THE PORT", PORT);
})  

