import {Attendence, Delegate, SpeakersList, Status, Timer, Page, Directive} from "./structs";
import { Motions } from "./motions";

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
        this.pastdirectives = [];
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

    filterPresent(search) {
        return this.getPresent().filter((del) => del.getName().toLowerCase().includes(search.toLowerCase()));
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
            switch (this.currentMotion.type) {
                case Motions.Voting:
                    if (num % 2 === 0 ) {
                        return "For Speaker " + ((num % 2) + 1);
                    } else {
                        return "Against Speaker " + ((num % 2) + 1);
                    }
                case Motions.Mod:
                    return "Speaker " + (num + 1);
                case Motions.RoundRobin:
                    return "Speaker " + (num + 1);
                default:
                    break;
            }
        } else {
            return this.getSpeakersList().listSpeakers[num].getDelegate().getName();
        }

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
            return this.timer.getStatus();
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
        if (this.currentMotion) {
            return Object.values(Page)
                    .filter(page => {if (page === this.page){return false;} return true;})
                    .filter(page => {switch (this.currentMotion.type) {
                    case Motions.Mod:
                        if (page === Page.unmod) {return false} return true;
                    case Motions.Unmod:
                        if (page === Page.speakers) {return false} return true;
                    case Motions.Voting:
                        if (page === Page.unmod) {return false} return true;
                    default:
                        if (page === Page.speakers || page === Page.unmod) {return false} return true;
                    }});
        } else {
            return Object.values(Page)
                    .filter(page => {if (page === this.page){return false;} return true;})
                    .filter(page => {if (page === Page.speakers || page === Page.unmod) {return false} return true;});
        }
    }

    //Motion Methods
    addMotion(motion) {
        this.motions.push(motion);
    }

    getMotions(){
        const motions = this.motions.sort((a,b) => {
            if (a.rank > b.rank) {
                return 1;
            } else if (a.rank < b.rank) {
                return -1;
            } else {
                switch (a.type) {
                    case Motions.Voting:
                        if ((a.speakingTime * a.numSpeakers) < (b.speakingTime * b.numSpeakers) ) {
                            return 1;
                        } else if ((a.speakingTime * a.numSpeakers) > (b.speakingTime * b.numSpeakers) ) {
                            return -1;
                        } if (a.numSpeakers < b.numSpeakers) {
                            return 1;
                        } else if ((a.numSpeakers > b.numSpeakers) ) {
                            return -1;
                        } else {
                            return 0;
                        }

                    case Motions.Unmod:
                        if (a.overallTime < b.overallTime) {
                            return 1;
                        } else if (a.overallTime > b.overallTime) {
                            return -1;
                        } else {
                            return 0;
                        }    

                    case Motions.RoundRobin:
                        if (a.speakingTime < b.speakingTime) {
                            return 1;
                        } else if (a.speakingTime > b.speakingTime) {
                            return -1;
                        } else {
                            return 0;
                        }

                    case Motions.Mod:
                        if (a.overallTime < b.overallTime) {
                            return 1;
                        } else if (a.overallTime > b.overallTime) {
                            return -1;
                        } else if (a.numSpeakers < b.numSpeakers) {
                            return 1;
                        } else if (a.numSpeakers > b.numSpeakers) {
                            return -1;
                        } else {
                            return 0;
                        }  
                    
                    default:
                        return 0;
                }
            }
        });

        return motions;
    }

    passMotion(index){
        const motion = this.motions[index];
        motion.pass();
        this.currentMotion = motion;

        switch (motion.type) {
            case Motions.Voting:
                this.genMod(motion.speakers * 2, motion.speakingTime);
                this.toPage(Page.directives);
                break;
            case Motions.Introduce:
                this.toPage(Page.directives);
                break;
            case Motions.Unmod:
                this.genUnmod(motion.min, motion.sec);
                break;
            case Motions.RoundRobin:
                this.genMod(this.numPresent(), motion.speakingTime);
                break;
            case Motions.Mod:
                this.genMod(motion.numSpeakers, motion.speakingTime);
                break;
            default:
                break;
        }

        this.clearMotions();
    }

    failMotion(index){
        this.motions[index].fail();
    }

    removeMotion(index){
        this.motions.splice(index, 1);
    }

    clearMotions(){
        this.motions = [];
    }


    genUnmod(minutes, seconds) {
        this.setTimer(minutes, seconds);
        this.pauseTimer();
        this.toPage(Page.unmod);
    }

    genMod(numSpeakers, speakingTime){
        this.setTimer(0, speakingTime);
        this.pauseTimer();
        this.makeSpeakersList(numSpeakers);
        this.toPage(Page.speakers);
    }

    //Directive Methods
    addDirective() {
        this.directives.push(new Directive());
    }

    passDirective(index){
        switch (this.pastdirectives.indexOf(this.directives[index])) {
            case -1:
                this.directives[index].pass();
                this.pastdirectives.push(this.directives[index]);
                break;
            default:
                this.directives.splice(this.pastdirectives.indexOf(this.directives[index]), 1);
                this.directives[index].pass();
                this.pastdirectives.push(this.directives[index]);
                break;
        }
    }

    failDirective(index){
        switch (this.pastdirectives.indexOf(this.directives[index])) {
            case -1:
                this.directives[index].fail();
                this.pastdirectives.push(this.directives[index]);
                break;
            default:
                this.directives.splice(this.pastdirectives.indexOf(this.directives[index]), 1);
                this.directives[index].fail();
                this.pastdirectives.push(this.directives[index]);
                break;
        }
    }

    removeDirective(index){
        this.directives.splice(index, 1);
    }

    clearDirectives(){
        this.directives = [];
    }
}

function genDelegates(num){
    const emotions = ["Happy", "Sad", "Excited", "Scared", "Angry", "Shy", "Silly", 
                    "Bored", "Tired", "Calm", "Dissapointed", "Suprised", "Jealous",
                    "Proud", "Disgusted", "Rambunctious", "Obnoxious", "Confused",
                    "Bossy", "Sneaky", "Nervous", "Sleepy", "Mean", "Grumpy", "Impatient",
                    "Fearful", "Frustrated", "Curious", "Confident", "Optimistic", "Creative",
                    "Lonely", "Powerful", "Energetic", "Apathetic", "Respected", "Loving"]
    const fruits = ["Apple", "Grape", "Banana", "Orange", "Pineapple", "Mango", "Pear", 
                    "Watermelon", "Lemon", "Lime", "Peach", "Kiwi", "Plum", "Cherry", 
                    "Guava", "Lychee", "Strawberry", "Blueberry", "Papaya", "Dragonfruit",
                    "Coconut", "Pomegranate", "Passion Fruit", "Raspberry", "Apricot",
                    "Clementine", "Cantelope", "Date", "Fig", "Kumquat", "Mandarin", 
                    "Prune", "Raisin", "Grapefruit", "Blackberry", "Honeywdew"]
    const names = []
    for (let i = 0; i < num; i++)
    {
        const emotion = emotions[Math.round((emotions.length - 1) * Math.random())]
        const fruit = fruits[Math.round((fruits.length - 1) * Math.random())]
        names.push(emotion + " " + fruit)
    }
    return names;
}

// const delNames = ['Alex Obtre Lumumba',
//         'Amb. Ernest Niyokindi',
//         'Amb. Francois Nkulikiyimfura',
//         'Amb. Jean Tambu Mikuma',
//         'Amb. Samwel Shelukundo',
//         'Christophe Bazivamo',
//         'Dr. Anthony L. Kafumbe',
//         'Dr. James Otieno Jowi',
//         'Dr. Kevit Desai',
//         'Dr. Novat Twungubumwe',
//         'Dr. Patrick Njoroge',
//         'Emile Nguza Arao',
//         'Eng. Steven D.M. Mlote',
//         'H.E. Ms. Doreen Ruth Amule',
//         'H.E. Prof. Judy Wakhungu',
//         'Hon. Amb. Ezéchiel Nibigira',
//         'Justice Nestor Kayobera',
//         'Kenneth A. Bagamuhunda',
//         'Lilian K. Mukoronia',
//         'Muyambi Fortunate',
//         'Prof. Gaspard Banyankimbona',
//         'Rt. Hon Martin Ngoga',
//         'Vivienne Yeda Apopo',
//         'Yufnalis N. Okubo'];
const state = new State(genDelegates(200));

export default state;
