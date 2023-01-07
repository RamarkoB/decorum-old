import { Vote } from "./structs";

//Motions
const Motions = {
    Extend: "Extend Current Motion",
    Voting: "Enter Voting Procedure",
    Introduce: "Introduce Directives",
    Unmod: "Unmoderated Caucus",
    StrawPoll: "Straw Poll",
    RoundRobin: "Round Robin",
    Mod: "Moderated Caucus",
}

class Motion {
    constructor(type, rank) {
        this.type = type;
        this.rank = rank;
        this.status = Vote.NA;
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
}

class Extend extends Motion {
    constructor() {
        super(Motions.Extend, 0);
    }
}

class Voting extends Motion {
    constructor(speakers, speakingTime) {
        super(Motions.Voting, 1);
        this.speakers = speakers;
        this.speakingTime = speakingTime;
    }
}

class Introduce extends Motion {
    constructor() {
        super(Motions.Introduce, 2);
    }
}

class Unmod extends Motion {
    constructor(min, sec) {
        super(Motions.Unmod, 3);
        this.min = min;
        this.sec = sec;
    }
}

class StrawPoll extends Motion {
    constructor() {
        super(Motions.StrawPoll, 4)
    }
}

class RoundRobin extends Motion {
    constructor(speakingTime) {
        super(Motions.RoundRobin, 4.5);
        this.speakingTime = speakingTime;
    }
}

class Mod extends Motion {
    constructor(min, sec, speakingTime) {
        super(Motions.Mod, 5);
        this.min = min;
        this.sec = sec;
        this.overallTime = min * 60 + sec;
        this.speakingTime = speakingTime;
        this.numSpeakers = this.calcSpeakers();
    }

    calcSpeakers() {
        if (this.overallTime % this.speakingTime !== 0) {
            return NaN;
        } else {
            return (this.overallTime / this.speakingTime)
        }
    }
}


export {Motions, Vote, Extend, Voting, Introduce, Unmod, StrawPoll, RoundRobin, Mod};