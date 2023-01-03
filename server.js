const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);

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
        this.hasDel = false;
        this.spoken = false;
    }

    addDelegate(del) {
        this.delegate = del;
        this.hasDel = true;
        // this.delegate.addTimeSpoken();
    }

    removeDelegate() {
        this.delegate.removeTimeSpoken();
        this.delegate = null;
    }

    hasDelegate(){
        return this.hasDel;
    }

    getDelegate(){
        return this.delegate;
    }

    getName(){
        if (this.hasDel) {
            return this.delegate.getName();
        } else {
            return "None";
        }
    }

    speak() {
        this.spoken = true;
    }

    hasSpoken(){
        return this.spoken;
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

    // removeDelegate(i, del) {
    //     this.listSpeakers[i].removeDelegate(del);
    // }

    // getName(num) {
    //     return this.listSpeakers[num].getName();
    // }

    hasNext(){
        return (this.speakerNum < this.NumSpeakers);
    }

    nextSpeaker() {
        if (this.speakernum > 0) {
            this.listSpeakers[this.speakerNum].speak();
        }

        this.speakerNum++;
        return this.listSpeakers[this.speakerNum - 1];
    }
}


//Timer Classes
const Status = {
    Inactive: 'inactive',
    Active: 'active',
    Paused: 'paused'
}

class Timer {
    constructor() {
        this.length = {min:0, sec:0};
        this.offset = 0;
        this.deadline = null;
        this.interval = null;
        this.status = Status.Inactive;
    }

    play(deadline) {
        function timerPlay(timer) {
            function update(){ timer.update(); }
            return setInterval(update, 100);
        }

        if (deadline == undefined){
            this.deadline = new Date(Date.parse(new Date()) + this.offset);        
        } else {
            this.deadline = deadline;
        }

        this.interval = timerPlay(this);
        this.status = Status.Active;

        return this.deadline;
    }

    pause(offset) {
        clearInterval(this.interval);
        this.deadline = null;
        this.interval = null;
        this.status = Status.Paused;

        if (offset != undefined){
            this.offset = offset;
        }

        return this.offset;
    }

    update() {
        this.offset = this.deadline - new Date();
        if (this.offset <= 0) {
            clearInterval(this.interval);
            this.offset = 0;
            this.active = false;
        }
    }

    set(min, sec){
        this.length.min = min;
        this.length.sec = sec;
        this.offset = Number(this.length.min) * 60 * 1000 + Number(this.length.sec) * 1000;
    }

    reset() {
        this.pause();
        this.offset = Number(this.length.min) * 60 * 1000 + Number(this.length.sec) * 1000;
        this.status = Status.Paused;
    }

    write() {
        this.pause();
        this.status = Status.Inactive;
    }

    getStatus() {
        return this.status;
    }

    getLength() {
        return this.length;
    }

    getDeadline() {
        return this.deadline;
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

//Page
const Page = {
    delegates: "delegates",
    motions: "motions",
    directives: "directives",
    mod: "mod",
    unmod: "unmod",
}

//State
class State {
    constructor(delegates){
        this.dels = delegates.map((del) => new Delegate(del));
        this.speakers = null;
        this.currentSpeaker = null;
        this.timer = new Timer();
        this.page = Page.delegates;
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

    updateAttendence(num, attendence){
        const del = this.dels[num];
        
        if (attendence == Attendence.Present){
            del.markPresent();
        } else if (attendence = Attendence.Voting) {
            del.markVoting();
        } else {
            del.markAbsent();
        }
    }

    numPresent() {
        let count = 0;
        this.dels.forEach(del => {
            if (del.getAttendence() == Attendence.Present) {
                count += 1;
            }
        });
        return count;
    }

    getPresent() {
        let present = [];
        this.dels.forEach((del) => {
            if (del.getAttendence() == Attendence.Present) {
                present.push(del);
            }
        });
        return present;
    }


    //State Speaker Methods
    makeSpeakersList(num){
        this.speakers = new SpeakersList(num);
    }

    addSpeaker(i, delnum) {
        this.speakers.addDelegate(i, this.dels[delnum]);
    }

    removeSpeaker(num) {
        this.speakers.removeDelegate(num);
    }

    nextSpeaker(){
        this.currentSpeaker = this.getSpeakersList().nextSpeaker();
    }

    getSpeakersList(){
        return this.speakers;
    }

    getSpeakers(){
        if (this.speakers == null){
            return [];
        } else {
            return this.speakers.listSpeakers;
        }
    }

    getSpeaker(num){
        if (this.getSpeakersList().listSpeakers[num].getDelegate() == null) {
            return "None";
        }
        return this.getSpeakersList().listSpeakers[num].getDelegate().getName();
    }

    updateSpeakers(cmd, args){
        if (cmd == "makeSpeakersList") {
            this.speakers = new SpeakersList(args);
        } else if (cmd == "addSpeaker") {
            this.speakers.addDelegate(args[0], this.dels[args[1]]);
        // } else if (cmd = "removeSpeaker"){
        //     this.speakers.removeDelegate(args);
        } else if (cmd = "nextSpeaker") {
            this.speakers.nextSpeaker();
        }
    }


    //State Timer Methods
    setTimer(min, sec) {
        this.timer.set(min,sec);
    }

    playTimer() {
        this.timer.play();
    }
    
    pauseTimer() {
        this.timer.pause();
    }

    resetTimer() {
        this.timer.reset();
    }

    writeTimer() {
        this.timer.write();
    }

    getLength(){
        return this.timer.length;
    }

    getTimerStatus(){
        if (this.timer == null) {
            return Status.Inactive;
        } else {
            return this.timer.status;
        }
    }

    getTime() {
        return this.timer.timeLeft();
    }

    getDeadline() {
        return this.timer.getDeadline();
    }

    updateTimer(cmd, args) {
        if (cmd == "set") {
            this.timer.set(args[0], args[1]);
        } else if (cmd == "play") {
            this.timer.play(args);
        } else if (cmd == "pause") {
            this.timer.pause(args);
        } else {
            this.timer.reset();
        }
    }

    //Page Methods
    toPage(page) {
        const oldPage = this.page;
        this.page = page;
    }

    getOtherPages() {
        return Object.values(Page).filter(page => {if (page == this.page){return false;} return true;})
    }

    //Motion Methods
    genMod(minutes, speakingTime){
        const seconds = minutes * 60;
        if (seconds % speakingTime != 0) {
            console.error("The number of minutes is not divisible by the number of speakers");
        }
    
        const speakers = Math.round(seconds / speakingTime);
        this.setTimer(0, speakingTime);
        this.pauseTimer();
        this.makeSpeakersList(speakers);
    }
}


let delNames = ['Alex Obtre Lumumba',
        'Amb. Ernest Niyokindi',
        'Amb. Francois Nkulikiyimfura',
        'Amb. Jean Tambu Mikuma',
        'Amb. Samwel Shelukundo',
        'Christophe Bazivamo',
        'Dr. Anthony L. Kafumbe',
        'Dr. James Otieno Jowi',
        'Dr. Kevit Desai',
        'Dr. Novat Twungubumwe',
        'Dr. Patrick Njoroge',
        'Emile Nguza Arao',
        'Eng. Steven D.M. Mlote',
        'H.E. Ms. Doreen Ruth Amule',
        'H.E. Prof. Judy Wakhungu',
        'Hon. Amb. Ezéchiel Nibigira',
        'Justice Nestor Kayobera',
        'Kenneth A. Bagamuhunda',
        'Lilian K. Mukoronia',
        'Muyambi Fortunate',
        'Prof. Gaspard Banyankimbona',
        'Rt. Hon Martin Ngoga',
        'Vivienne Yeda Apopo',
        'Yufnalis N. Okubo'];
let state = new State(delNames);

io.on('connection', (socket) => {

  //Initalize Client State
  socket.emit("stateInit", delNames);
  state.getDelegates().map((del, index) => {
    attendence = (del).getAttendence();
    if (attendence == Attendence.Present) {
      socket.emit("markPresent", index);
    }
  });
  if (state.getTimerStatus() == Status.Active) {
    socket.emit("play", state.getDeadline());
  } else if (state.getTimerStatus() == Status.Paused) {
    socket.emit("pause", state.getTime().total);
  } else {
    socket.broadcast.emit("set", state.getLength().min, state.getLength().sec);
  }

  if (state.getSpeakersList()) {
    socket.emit("makeSpeakersList", state.getSpeakersList().numSpeakers);
    state.getSpeakers().forEach((speaker, index) => {
        if(speaker.hasDelegate()) {
            socket.emit("addSpeaker", index, state.getDelegates().indexOf(speaker.getDelegate()));
        }
    });

    for (let i = 0; i < state.getSpeakersList().speakerNum; i++) {
        socket.emit("nextSpeaker");
    }
  }

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

  socket.on("set", (min, sec) => {
    state.setTimer(min, sec);
    console.log("Timer Update: Set timer to (" + min + ":" + sec + ")" );
    socket.broadcast.emit("set", min, sec);
  })

  socket.on("play", (deadline) => {
    state.playTimer(new Date(deadline));
    console.log("Timer Update: Play timer until (" + deadline + ")" );
    socket.broadcast.emit("play", deadline);
  })

  socket.on("pause", (offset) => {
    state.pauseTimer(offset);
    console.log("Timer Update: Pause timer at (" + offset + ")" );
    socket.broadcast.emit("pause", offset);
  })

  socket.on("reset", () => {
    state.resetTimer();
    console.log("Timer Update: Reset timer to (" + state.getLength().min + ":" + state.getLength().sec + ")" );
    socket.broadcast.emit("reset");
  })

  socket.on("makeSpeakersList", (num) => {
    state.makeSpeakersList(num);
    console.log("Speakers Update: Generated Speakers list with " + num + " speakers");
    socket.broadcast.emit("makeSpeakersList", num);
  });

  socket.on("addSpeaker", (i, delnum) => {
    state.addSpeaker(i, delnum);
    console.log("Speakers Update: Speaker " + i +  " is " + state.getName(delnum));
    socket.broadcast.emit("addSpeaker", i, delnum);
  });

  socket.on("removeSpeaker", (num) => {
    state.removeSpeaker(num);
    console.log("Speakers Update: Removed" + state.getName(num) + "from speakers list");
    socket.broadcast.emit("removeSpeaker", num);
  });

  socket.on("nextSpeaker", () => {
    state.updateSpeakers("nextSpeaker");
    console.log("Speakers Update: Next Speaker"); //return to add more
    socket.broadcast.emit("nextSpeaker");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, function(){
    console.log('listening on *:', PORT);
});