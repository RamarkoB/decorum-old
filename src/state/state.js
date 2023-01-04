import {Attendence, Delegate, SpeakersList, Status, Timer, Page, Directive} from "./structs";

//State
class State {
    constructor(delegates){
        //Delegates and Signatory Number
        this.dels = delegates.map((del) => new Delegate(del));
        this.signum = 0;

        //Speakers
        this.currentSpeaker = null;
        this.speakers = null;
        
        //Motions
        this.currentMotion = null;
        this.motions = [];

        //Timer
        this.timer = new Timer();

        //Pages
        this.page = Page.delegates;

        //Directives
        this.directives = [];
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
        // socket.emit("markPresent", num);
    };

    markVoting(num){
        this.dels[num].markVoting();
        // socket.emit("markVoting", num);
    };

    markAbsent(num){
        this.dels[num].markAbsent();
        // socket.emit("markAbsent", num);
    };

    numPresent() {
        let count = 0;
        this.dels.forEach(del => {
            if (del.getAttendence() === Attendence.Present) {
                count += 1;
            }
        });
        return count;
    }

    getPresent() {
        let present = [];
        this.dels.forEach((del) => {
            if (del.getAttendence() === Attendence.Present) {
                present.push(del);
            }
        });
        return present;
    }

    updateAttendence(num, attendence){
        const del = this.dels[num];
        
        if (attendence === Attendence.Present){
            del.markPresent();
        } else if (attendence === Attendence.Voting) {
            del.markVoting();
        } else {
            del.markAbsent();
        }
    }


    //State Speaker Methods
    makeSpeakersList(num){
        this.speakers = new SpeakersList(num);
        // socket.emit("makeSpeakersList", num);
    }

    addSpeaker(i, delnum) {
        this.speakers.addDelegate(i, this.dels[delnum]);
        // socket.emit("addSpeaker", i, delnum);
    }

    removeSpeaker(num) {
        this.speakers.removeDelegate(num);
        // socket.emit("removeSpeaker", num);
    }

    nextSpeaker(){
        this.currentSpeaker = this.speakers.nextSpeaker();
        this.resetTimer();
        // socket.emit("nextSpeaker");
    }

    lastSpeaker(){
        this.currentSpeaker = this.speakers.lastSpeaker();
        // socket.emit("nextSpeaker");
    }

    getSpeakersList(){
        return this.speakers;
    }

    getSpeakers(){
        if (this.speakers === null){
            return [];
        } else {
            return this.speakers.listSpeakers;
        }
    }

    getSpeaker(num){
        if (this.getSpeakersList().listSpeakers[num].getDelegate() === null) {
            return "None";
        }
        return this.getSpeakersList().listSpeakers[num].getDelegate().getName();
    }

    updateSpeakers(cmd, args){
        if (cmd === "makeSpeakersList") {
            this.speakers = new SpeakersList(args);
        } else if (cmd === "addSpeaker") {
            this.speakers.addDelegate(args[0], this.dels[args[1]]);
        // } else if (cmd = "removeSpeaker"){
        //     this.speakers.removeDelegate(args);
        } else if (cmd === "nextSpeaker") {
            this.currentSpeaker = this.getSpeakersList().nextSpeaker();
        }
    }


    //State Timer Methods
    setTimer(min, sec) {
        this.timer.set(min,sec);
        // socket.emit("set", min, sec);
    }

    playTimer() {
        this.timer.play()
        // const deadline = this.timer.play();
        // socket.emit("play", deadline);
    }
    
    pauseTimer() {
        this.timer.pause()
        // const offset = this.timer.pause();
        // socket.emit("pause", offset);
    }

    resetTimer() {
        this.timer.reset();
        // socket.emit("reset");
    }

    writeTimer() {
        this.timer.write();
    }

    getLength(){
        return this.timer.length;
    }

    getTimerStatus(){
        if (this.timer === null) {
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
        if (cmd === "set") {
            this.timer.set(args[0], args[1]);
        } else if (cmd === "play") {
            this.timer.play(args);
        } else if (cmd === "pause") {
            this.timer.pause(args);
        } else {
            this.timer.reset();
        }
    }

    //Page Methods
    toPage(page) {
        this.page = page;
    }

    getPage(){
        return this.page;
    }

    getOtherPages() {
        return Object.values(Page).filter(page => {if (page === this.page){return false;} return true;})
    }

    //Motion Methods
    addMotion(motion) {
        this.motions.push(motion);
    }

    getMotions(){
        return this.motions;
    }

    passMotion(index){
        this.motions[index].pass();
        this.currentMotion = this.motions[index];
    }

    failMotion(index){
        this.motions[index].fail();
    }

    removeMotion(index){
        this.motions.splice(index, 1);
    }


    genUnmod(minutes, seconds) {
        this.setTimer(minutes, seconds);
        this.pauseTimer();
    }

    genMod(minutes, speakingTime){
        const seconds = minutes * 60;
        if (seconds % speakingTime !== 0) {
            console.error("The number of minutes is not divisible by the number of speakers");
        }
    
        const speakers = Math.round(seconds / speakingTime);
        this.setTimer(0, speakingTime);
        this.pauseTimer();
        this.makeSpeakersList(speakers);
    }

    addDirective() {
        this.directives.push(new Directive());
    }

    passDirective(index){
        this.directives[index].pass();
    }

    failDirective(index){
        this.directives[index].fail();
    }

    removeDirective(index){
        this.directives.splice(index, 1);
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
state.genMod(8, 30)

export default state;
