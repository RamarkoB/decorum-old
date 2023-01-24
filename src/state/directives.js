import { Vote, SpeakersList } from "./structs";
import { state } from "./state";

//Directive Classes
class Directive {
    constructor(name, num) {
        this.name = name;
        this.status = Vote.NA;
        this.speakers = null;
        
        if (num) {
            this.genSpeakersList(num);
        }
    }

    pass() {
        this.status = Vote.Passed;
    }

    fail() {
        this.status = Vote.Failed;
    }

    reset() {
        this.status = Vote.NA;
    }

    getName() {
        return this.name;
    }

    genSpeakersList(num) {
        this.speakers = new SpeakersList(num * 2);
    }

    getSpeakersList(){
        return this.speakers;
    }

    getSpeakers(){
        if (this.speakers === null){
            return [];
        } else {
            return this.speakers.speakers;
        }
    }

    getSpeaker(num){
        if (this.getSpeakersList().speakers[num].hasDel) {
            return this.getSpeakersList().speakers[num].getDelegate().getName();
        } else {
            switch (num % 2) {
                case 0: return "For Speaker " + (Math.ceil(num / 2) + 1);
                default: return "Against Speaker " + (Math.ceil(num / 2));
            }
        }
    }

    addSpeaker(i, delnum) {
        this.speakers.addDelegate(i, state.dels[delnum]);
        // socket.emit("addSpeaker", i, delnum);
    }

    removeSpeaker(num) {
        this.speakers.removeDelegate(num);
        // socket.emit("removeSpeaker", num);
    }
}

const DirOrder = {
    introduced: "Introduced",
    revIntroduced: "Reverse Introduced",
    alphabetical: "Alphabetical",
    revAlphabetical: "Reverse Alphabetical"
}

class DirState {
    constructor(){
        this.currDirectives = [];
        this.pastDirectives = [];
        this.speakers = null;
        this.numspeakers = null;
        this.speakerNum = null;
    }

    //individual directive methods
    add(name) {
        const dir = name?
            new Directive(name):
            new Directive();

        this.currDirectives.push(dir);
    }

    remove(index){
        this.currDirectives.splice(index, 1);
    }

    pass(index){
        switch (this.pastdirectives.indexOf(this.currDirectives[index])) {
            case -1:
                this.currDirectives[index].pass();
                this.pastdirectives.push(this.currDirectives[index]);
                break;
            default:
                this.currDirectives[index].pass();
                this.pastdirectives[this.pastdirectives.indexOf(this.currDirectives[index])].pass();
                break;
        }
    }

    fail(index){
        switch (this.pastdirectives.indexOf(this.currDirectives[index])) {
            case -1:
                this.currDirectives[index].fail();
                this.pastdirectives.push(this.currDirectives[index]);
                break;
            default:
                this.currDirectives[index].pass();
                this.pastdirectives[this.pastdirectives.indexOf(this.currDirectives[index])].fail();
                break;
        }
    }

    //multiple directive methods
    getCurrDirectives(order = DirOrder.introduced) {
        switch (order) {
            case DirOrder.introduced:
                return this.currDirectives;
            case DirOrder.revIntroduced:
                return this.currDirectives.reverse();
            case DirOrder.alphabetical:
                return this.currDirectives.sort((a,b) => {
                    if (a.name > b.name) { return 1; }
                    else if (a.name < b.name) { return -1;}
                    else {return 0;}
                });
            case DirOrder.revAlphabetical:
                return this.currDirectives.sort((a,b) => {
                    if (a.name > b.name) { return 1; }
                    else if (a.name < b.name) { return -1;}
                    else {return 0;}
                }).reverse();

            //no default
        }
    }

    getPastDirectives(order = DirOrder.introduced) {
        switch (order) {
            case DirOrder.introduced:
                return this.pastDirectives;
            case DirOrder.revIntroduced:
                return this.pastDirectives.reverse();
            case DirOrder.alphabetical:
                return this.pastDirectives.sort((a,b) => {
                    if (a.name > b.name) { return 1; }
                    else if (a.name < b.name) { return -1;}
                    else {return 0;}
                });
            case DirOrder.revAlphabetical:
                return this.pastDirectives.sort((a,b) => {
                    if (a.name > b.name) { return 1; }
                    else if (a.name < b.name) { return -1;}
                    else {return 0;}
                }).reverse();

            //no default
        }
    }

    getPassedDirecitves(order = DirOrder.introduced) {
        state.getPastDirectives(order).filter((dir) => 
        { switch (dir.status) {
            case Vote.Passed: return true;
            default: return false;
        }})
    }

    getFailedDirecitves(order = DirOrder.introduced) {
        state.getPastDirectives(order).filter((dir) => 
        { switch (dir.status) {
            case Vote.Failed: return true;
            default: return false;
        }})
    }

    clear(){
        this.currDirectives = [];
    }


    //directive speaker methods
    makeDirSpeakersList(num, order = DirOrder.introduced){
        this.currDirectives.forEach((dir) => {dir.genSpeakersList(num)})
        this.speakers = this.getCurrDirectives(order).map((dir) => dir.getSpeakersList().speakers).flat(1);
        this.numSpeakers = this.speakers.length;
        this.speakerNum = 0;
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

export { Directive, DirOrder, DirState };