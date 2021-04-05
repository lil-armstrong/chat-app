const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const port = 4000;

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
    v = c == "x" ? r: (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

app.use(express.static(path.join(__dirname, 'src')));
// console.log(path.join(__dirname, 'public','index.html'))
app.get('/', (req, res)=> {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

io.on('connection', (socket) => {
  let id = socket.client.conn.id;
  console.log(`(User: ${id}) connected`);
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', {
      body: msg,
      id : uuid(),
      type:'recipient'
    })
  });
  socket.on('typing', ()=>{
    socket.broadcast.emit('user-typing');
  })
  socket.on('disconnect', () => {
    console.log(`(User: ${id}) disconnected`);
  });
});

http.listen(port, ()=> {
  console.log('Server running on port '+port)
})