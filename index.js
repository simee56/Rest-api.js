const express = require('express');
const usersData = require('./MOCK_DATA.json');
const fs = require('fs');

const app = express();
const PORT = 8000;


//  MIDDLEWARE to connect POSTMAN
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Creating our own middleware
app.use((req, res, next) => {
    fs.appendFile('log.txt', `\n${Date.now()}: ${req.ip}: ${req.method}: ${req.path}`, (err, data) => {
        if(err){
            return res.end("Error", err)
        };
        next();
    });
})


//GET METHOD 
app.get('/api/usersData', (req, res) => {
    return res.json(usersData);
})


//GET METHOD for the finding user
app.get('/api/usersData/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userData = usersData.find((userData) => userData.id === userId);
    // Check if the user exists
    if (!userData) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    return res.json(userData);
})


//POST METHOd
app.post('/api/usersData', (req, res) => {
    const body = req.body;
    usersData.push({ ...body, id: usersData.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(usersData), (err, data) => {
        return res.json({ status: "success" });
    })
})


//PATCH METHOD 
app.patch('/api/usersData/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userData = usersData.find((userData) => userData.id === userId);

    // Check if the user exists
    if (!userData) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Update the user with new data
    Object.assign(userData, req.body);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(usersData), (err, data) => {
        if (err) {
            return res.status(500).json({ status: "Error", message: "Error detected", err })
        }
        return res.status(200).json({ status: "success", data: userData });
    });
});


//DELETE METHOD
app.delete('/api/usersData/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userData = usersData.findIndex((userData) => userData.id === userId);

    // Check if the user exists
    if (!userData) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Remove the user from the array
    const deletedUser = usersData.splice(userData, 1)[0];

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(usersData), (err, data) => {
        if (err) {
            return res.status(500).json({ status: "Error", message: "Error detected", err })
        }
        return res.status(200).json({ status: "success", data: deletedUser });
    });
})


app.listen(PORT, () => {
    console.log("THE SERVER HAS STARTED AT THE PORT", PORT);
})