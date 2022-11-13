const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const babel = require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"],
});

app.use(express.static(__dirname + "/client"));
app.get('/client', (req, res) => {});

//Delegate Classes
const Attendence = {
  Present: 'present',
  Voting: 'voting',
  Absent: 'absent'
};

class Delegate {
  constructor(name, attendence) {
      this.name = name;
      this.attendence = (attendence === undefined) ? Attendence.Absent : attendence;
      this.timesSpoken = 0;
  }

  getName(){
      return this.name;
  }

  getAttendence(){
      return this.attendence;
  }

  getTimesSpoken(){
      return this.timesSpoken
  }


  markPresent(){
      this.attendence = Attendence.Present;
  }

  markVoting(){
      this.attendence = Attendence.Voting;
  }

  markAbsent(){
      this.attendence = Attendence.Absent;
  }

  addTimeSpoken(){
      this.timesSpoken++;
  }

  removeTimeSpoken(){
      this.timesSpoken--;
  }
}


//Speakers List Classes
class Speaker {
  constructor() {
      this.delegate = null;
      this.spoken = false;
  }

  addDelegate(del) {
      this.delegate = del;
      this.delegate.addTimeSpoken();
  }

  removeDelegate() {
      this.delegate.removeTimeSpoken();
      this.delegate = null;
  }

  getName(){
    return this.delegate.name;
  }

  speak() {
      this.spoken = true;
  }
}

class SpeakersList {
  constructor(numSpeakers){
      this.numSpeakers = numSpeakers;
      let listSpeakers = [];
      for (let i = 0; i < this.numSpeakers; i ++) {
          listSpeakers.push(new Speaker());
      }
      this.listSpeakers = listSpeakers;
      this.speakerNum = 0;
  }

  addDelegate(i, del) {
      this.listSpeakers[i].addDelegate(del);
  }

  removeDelegate(i, del) {
      this.listSpeakers[i].removeDelegate(del);
  }

  hasNext(){
      return (this.speakerNum < this.NumSpeakers);
  }

  nextSpeaker() {
      if (this.speakernum > 0) {
          this.list[this.speakerNum].speak();
      }

      this.speakerNum++;
      return this.list[this.speakerNum - 1];
  }
}


//Timer Classes
const Status = {
  Inactive: 'inactive',
  Active: 'active',
  Paused: 'paused'
}

class Timer {
  constructor(min, sec) {
      this.offset = Number(min) * 60 * 1000 + Number(sec) * 1000;
      this.deadline = null;
      this.interval = null;
      this.status = Status.Active;
  }

  play() {
      function timerPlay(timer) {
          function update(){ timer.updateTimer(); }
          return setInterval(update, 1000);
      }

      this.deadline = new Date(Date.parse(new Date()) + this.offset);
      this.interval = timerPlay(this);
      this.status = Status.Active;

      return this.timeLeft();
  }

  pause() {
      clearInterval(this.interval);
      this.deadline = null;
      this.interval = null;
      this.status = Status.Paused;

      return this.timeLeft();
  }

  updateTimer() {
      this.offset = this.deadline - new Date();
      if (this.offset <= 0) {
          clearInterval(this.interval);
          this.offset = 0;
          this.active = false;
      }
  }

  timeLeft() {
      const t = this.offset;
      const seconds = Math.floor( (t/1000) % 60 );
      const minutes = Math.floor( (t/1000/60));
      const hours = Math.floor( (t/(1000*60*60)) % 24 );
      const days = Math.floor( t/(1000*60*60*24) );
      return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
  }
}

//State
class State {
  constructor(delegates){
      this.dels = delegates.map((del) => new Delegate(del));
      this.speakers = null;
      this.currentSpeaker = null;
      this.timer = null;
  }

  //State Delegate Methods
  getDelegates(){
      return this.dels;
  }

  getName(num){
      return this.dels[num].getName();
  };

  getAttendence(num){
      return this.dels[num].getAttendence();
  }

  getTimesSpoken(num){
      return this.dels[num].getTimesSpoken();
  }

  markPresent(num){
      this.dels[num].markPresent();
  };

  markVoting(num){
      this.dels[num].markVoting();
  };

  markAbsent(num){
      this.dels[num].markAbsent();
  };



  //State Speaker Methods
  makeSpeakersList(num){
      this.speakers = new SpeakersList(num);
  }

  addSpeaker(speaker, delegate) {
      this.speakers.addDelegate(speaker, delegate);
  }

  removeSpeaker(num) {
      this.speakers.removeDelegate(num);
  }

  nextSpeaker(){
      this.currentSpeaker = speakersList.nextSpeaker();
      return this.currentSpeaker.getName();
  }


  //State Timer Methods
  makeTimer(min, sec) {
      this.timer = new Timer(min,sec);
  }

  playTimer() {
      this.timer.play();
  }

  pauseTimer() {
      this.timer.pause();
  }

  getTime() {
      this.timer.getTime();
  }
}


let delNames = ["Carolyn", "Joseph", "Jingwen", "Bertrand", "Laura", "Christine", "Ramarko", "Ariel", "Marcos", "Helen", "Nina", "Zane", "Pascual", "Danny"];
let state = new State(delNames);

io.on('connection', (socket) => {
  socket.emit("stateInit", delNames);
  state.getDelegates().map((del, index) => {
    attendence = (del).getAttendence();
    if (attendence == Attendence.Present) {
      socket.emit("markPresent", index);
    }
  }
  )

  socket.on("markPresent", (index) => {
    state.markPresent(index);
    console.log("Delegate Update: Marked " + state.getName(index) + " Present");
    socket.broadcast.emit("markPresent", index);
  });

  socket.on("markAbsent", (index) => {
    state.markAbsent(index);
    console.log("Delegate Update: Marked " + state.getName(index) + " Absent");
    socket.broadcast.emit("markAbsent", index);
  });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
  });