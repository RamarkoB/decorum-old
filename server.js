const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + "/client"));
app.get('/client', (req, res) => {});

const Attendence = {
  Present: 'present',
  Voting: 'voting',
  Absent:'absent'
};

class Delegate {
  constructor(name) {
    this.name = name;
    this.attendence = Attendence.Absent;
  }

  present() {
    if (this.attendence == Attendence.Absent){
      this.attendence = Attendence.Present;
    } else {
      this.attendence = Attendence.Absent;
    }
    socket.emit("delegateUpdate", delegates);
  }
}

let delNames = ["Carolyn", "Joseph", "Jingwen", "Bertrand", "Laura", "Christine", "Ramarko",  "Ariel"]
let delegates = delNames.map((delName) => new Delegate(delName));

io.on('connection', (socket) => {
  socket.emit("delegateInit", delegates);
  socket.on("delegateUpdate", (dels) => {
    console.log(dels)
    io.emit("delegateUpdate", dels)
  });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
  });