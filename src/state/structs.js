const Vote = {
    NA: "NA",
    Passed: "Passed",
    Failed: "Failed"
}

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


//Speaker Classes
class Speaker {
    constructor() {
        this.delegate = null;
        this.spoken = false;
        this.hasDel = false;
    }

    addDelegate(del) {
        this.delegate = del;
        this.delegate.addTimeSpoken();
        this.hasDel = true;
    }

    removeDelegate() {
        if (this.hasDel) {
            this.delegate.removeTimeSpoken();
            this.delegate = null;
            this.hasDel = false;
        }
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

    unspeak() {
        this.spoken = false;
    }

    hasSpoken(){
        return this.spoken;
    }
}

class SpeakersList {
    constructor(numSpeakers){
        this.numSpeakers = numSpeakers;
        this.speakers = [];
        for (let i = 0; i < this.numSpeakers; i ++) {
            this.speakers.push(new Speaker());
        }
        this.speakerNum = 0;
    }

    addDelegate(i, del) {
        this.speakers[i].addDelegate(del);
    }

    removeDelegate(i) {
        this.speakers[i].removeDelegate();
    }

    getName(num) {
        return this.speakers[num].getName();
    }

    getSpeakers(){
        return this.speakers;
    }

    hasNext(){
        return (this.speakerNum < this.NumSpeakers);
    }

    nextSpeaker() {
        if (this.speakerNum < this.numSpeakers) {
            this.speakers[this.speakerNum].speak();
            this.speakerNum++;
            return this.speakers[this.speakerNum];
        }
    }

    lastSpeaker() {
        if (this.speakerNum > 0) {
            this.speakerNum--;
            this.speakers[this.speakerNum].unspeak();
            return this.speakers[this.speakerNum];
        }
    }
}


//Timer Classes
const Status = {
    Inactive: 'inactive',
    Active: 'active',
    Paused: 'paused',
    Done: 'finished'
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

        if (deadline === undefined){
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

        if (offset !== undefined){
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
            this.status = Status.Done;
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
    speakers: "speakers",
    unmod: "unmod",
}

export {Attendence, Vote, Delegate, Speaker, SpeakersList, Status, Timer, Page};