const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const users = require('./routes/api/users');
const tweets = require('./routes/api/tweets');

const GameState = require('./models/GameState');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

const db = require('./config/keys').mongoURI;
mongoose
  .connect(db, {useNewUrlParser: true})
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Server is running on port ${port}`));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

app.use('/api/users', users);
app.use('/api/tweets', tweets);


// Websocket io connections
const io = socketIO(server);

io.on('connection', socket => {
  console.log('User connected');
  // console.log(socket.handshake.query.room);

  socket.room = socket.handshake.query.room;
  socket.join(socket.room);

  socket.on('join room', (room) => {
    console.log('joined new room')
    socket.leave(socket.room);
    socket.room = room;
    socket.join(socket.room);
    socket.to(socket.room).emit('room change', socket.room);
  })

  socket.on('change color', (color) => {
    console.log('Color changed to: ', color);
    socket.to(socket.room).emit('change color', color);
  });

  socket.on('set gameState', (receivedState) => {
    console.log('GameState will be changed to: ', receivedState);
    // const newGameState = new GameState({
      // GameState: receivedState
    // });
    // newGameState.save().then(() => {
    socket.to(socket.room).emit('receive gameState', receivedState);
    // })
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    socket.leave(socket.room);
  });

})


server.listen(port);

// app.get("/", (req, res) => {
//   res.send("Hello World")
// });

