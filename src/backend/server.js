require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path');

const ATEM = require('applest-atem');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const atem = new ATEM();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const switcherIPAddress = process.env.SWITCHER_IP_ADDRESS;

// app.use(express.static(path.join(__dirname, '../build')));

atem.connect(switcherIPAddress);

let channels = [];
let programInput = null;
let newProgramInput = null;
let mySocket = null;

io.on('connection', function (socket) {
    mySocket = socket;
});

atem.on('connect', function () {
    // console.log(atem.state)
    channels = atem.state.channels;
    programInput = atem.state.video.ME[0].programInput;
});

atem.on('stateChanged', function (error, state) {
    // console.log(state)
    try {
        const newProgramInput = state.video.ME[0].programInput;
        if (newProgramInput !== programInput) {
            programInput = newProgramInput;
            if (mySocket) {
                mySocket.emit('newActiveChannel', { activeChannel: newProgramInput});
            }
        }
    }
    catch(e) {
        //to not blow up if object doesn't exist
    }

    if (error) {
        console.error(error);
    }
});

app.get('/api/fetchChannels', function fetchAndSendChannelsToClient(req, res) {
    let activeChannels = populateActiveChannels(channels);

    function populateActiveChannels(channels) {
        let activeChannels = [];
        let i = 1;
        while (i < 9) {
            channels[i].id = i;
            activeChannels.push(channels[i]);
            i++;
        }
        return activeChannels;
    }
    const data = {
        activeChannels,
        activeChannel: programInput
    }
    res.send(data);
});

app.post('/api/changeProgramInput', function changeProgramInput(req, res) {
    try {
        atem.changeProgramInput(req.body.id);
        res.send('success');
    }
    catch(e) {
        res.send('failure');
    }
});

//if we deployed, we let the service we use (like heroku) set our port for us
const port = process.env.PORT || 8080;

server.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
    console.log(switcherIPAddress)
});

// app.listen(port, () => {
//     console.log(`Server listening on port ${port}!`);
//     console.log(switcherIPAddress)
// });

// atem.on('ping', function () {
//     const newProgramInput = atem.state.video.ME.programInput;
//     if (newProgramInput !== programInput) {
//         //learn to listen from ping from server on client.
//     }
// });

/*

channels =

{ '0': { name: 'Black', label: 'Blk' },
     '1': { name: 'Camera 1', label: 'Cam1' },
     '2': { name: 'Camera 2', label: 'Cam2' },
     '3': { name: 'Camera 3', label: 'Cam3' },
     '4': { name: 'Camera 4', label: 'Cam4' },
     '5': { name: 'Camera 5', label: 'Cam5' },
     '6': { name: 'Camera 6', label: 'Cam6' },
     '7': { name: 'Camera 7', label: 'Cam7' },
     '8': { name: 'Camera 8', label: 'Cam8' },
     '1000': { name: 'Color Bars', label: 'Bars' },


*/

/*
SOME API CALLS
    // atem.changeProgramInput(1); // ME1(0)
    // atem.changePreviewInput(2); // ME1(0)
    // atem.autoTransition(); // ME1(0)
    // atem.changeProgramInput(3, 1); // ME2(1)
*/