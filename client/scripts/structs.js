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

    removeDelegate(i, del) {
        this.listSpeakers[i].removeDelegate(del);
    }

    // getName(num) {
    //     return this.listSpeakers[num].getName();
    // }

    hasNext(){
        return (this.speakerNum < this.NumSpeakers);
    }

    nextSpeaker() {
        this.listSpeakers[this.speakerNum].speak();
        this.speakerNum++;
        return this.listSpeakers[this.speakerNum];
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

//Motions
const Motion = {
    Introduce: "Introduce Directives",
    Moderated: "Moderated Caucus",
    Unmoderated: "Unmoderated Caucus",
    StrawPoll: "Straw Poll",
    RoundRobin: "Round Robin"
}

//State
class State {
    constructor(delegates){
        this.dels = delegates.map((del) => new Delegate(del));
        this.speakers = null;
        this.currentSpeaker = null;
        this.timer = new Timer();
        this.page = Page.delegates;
        this.toPage(this.page);
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


    //State Speaker Methods
    makeSpeakersList(num){
        this.speakers = new SpeakersList(num);
        socket.emit("makeSpeakersList", num);
    }

    addSpeaker(i, delnum) {
        this.speakers.addDelegate(i, this.dels[delnum]);
        socket.emit("addSpeaker", i, delnum);
    }

    removeSpeaker(num) {
        this.speakers.removeDelegate(num);
        socket.emit("removeSpeaker", num);
    }

    nextSpeaker(){
        this.currentSpeaker = this.getSpeakersList().nextSpeaker();
        socket.emit("nextSpeaker");
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
            this.currentSpeaker = this.getSpeakersList().nextSpeaker();
        }
    }


    //State Timer Methods
    setTimer(min, sec) {
        this.timer.set(min,sec);
        socket.emit("set", min, sec);
    }

    playTimer() {
        const deadline = this.timer.play();
        socket.emit("play", deadline);
    }
    
    pauseTimer() {
        const offset = this.timer.pause();
        socket.emit("pause", offset);
    }

    resetTimer() {
        this.timer.reset();
        socket.emit("reset");
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
        document.getElementById(oldPage).classList.remove("active");
        document.getElementById(this.page).classList.add("active");
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