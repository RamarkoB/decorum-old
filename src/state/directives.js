import { Vote, SpeakersList } from "./structs";

//Directive Classes
class Directive {
    constructor(name, num) {
        this.name = name;
        this.status = Vote.NA;
        if (num) {
            this.speakers = new SpeakersList(num);
        } else {
            this.speakers = null;
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
        this.speakers = new SpeakersList(num);
    }
}

const DirOrder = {
    introduced: "Introduced",
    revIntroduced: "Reverse Introduced",
    alphabetical: "Alphabetical",
    revAlphabetical: "Reverse Alphabetical"
}

export { Directive, DirOrder };