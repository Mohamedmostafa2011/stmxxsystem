const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" } // IMPORTANT: Allows Vercel to connect
});

let deviceData = { battery: "--", wifiName: "Waiting..." };

io.on('connection', (socket) => {
    console.log('Connection established');

    // 1. Receive Data from Laptop
    socket.on('agent_update', (data) => {
        deviceData = data;
        io.emit('dashboard_update', deviceData); // Send to phone
    });

    // 2. Handle Login from Phone
    socket.on('try_login', (pass) => {
        if(pass === "init_override_77") {
            socket.emit('login_success', "ACCESS GRANTED");
            socket.emit('dashboard_update', deviceData);
        } else {
            socket.emit('login_fail', "DENIED");
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));