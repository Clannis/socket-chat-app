const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const PORT = 8080
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})
const STATIC_CHANNELS = [
    {
        id: 1,
        name: 'Global Chat',
        participants: 0,
        sockets: []
    },
    {
        id: 2,
        name: "Funny",
        participants: 0,
        sockets: []
    }
];

app.use(cors({
    origin: 'http://localhost:3000'
}))

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`)
})

io.on('connection', (socket) => {
    console.log('new client connected')
    socket.emit('connection', null)
    socket.on('channel-join', id => {
        STATIC_CHANNELS.forEach( c => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == (-1)) {
                    c.sockets.push(socket.id);
                    c.participants++;
                    io.emit('channel', c);
                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                if(index != (-1)) {
                    c.sockets.splice(index, 1);
                    c.participants--;
                    io.emit('channel', c)
                }
            }
        })
        return id
    })

    socket.on('send-message', message => {
        io.emit('message', message);
    })

    socket.on('disconnect', () => {
        STATIC_CHANNELS.forEach( c => {
            let index = c.sockets.indexOf(socket.id);
            if (index != (-1)) {
                c.sockets.splice(index, 1);
                c.participants--;
                io.emit('channel', c)
            }
        })
    })
})

app.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
})