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
        return this.delegate.getName();
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
        socket.emit("markPresent", num);
    };

    markVoting(num){
        this.dels[num].markVoting();
        socket.emit("markVoting", num);
    };

    markAbsent(num){
        this.dels[num].markAbsent();
        socket.emit("markAbsent", num);
    };

    attendenceInit(num, attendence){
        const del = this.dels[num];
        
        if (attendence == Attendence.Present){
            del.markPresent();
        } else if (attendence = Attendence.Voting) {
            del.markVoting();
        }
    }



    //State Speaker Methods
    makeSpeakersList(num){
        this.speakers = new SpeakersList(num);
        socket.emit("makeSpeakersList", num);
    }

    addSpeaker(speaker, delegate) {
        this.speakers.addDelegate(speaker, delegate);
        socket.emit("AddSpeaker", speaker, delegate);
    }

    removeSpeaker(num) {
        this.speakers.removeDelegate(num);
        socket.emit("RemoveSpeaker", num);
    }

    nextSpeaker(){
        this.currentSpeaker = speakersList.nextSpeaker();
        socket.emit("nextSpeaker");
        return this.currentSpeaker.getName();
    }


    //State Timer Methods
    makeTimer(min, sec) {
        this.timer = new Timer(min,sec);
        socket.emit("makeTimer", min,sec);
    }

    playTimer() {
        this.timer.play();
        socket.emit("play");
    }

    pauseTimer() {
        this.timer.pause();
        socket.emit("pause");
    }

    getTime() {
        this.timer.getTime();
    }

}