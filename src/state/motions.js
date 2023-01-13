import { Vote } from "./structs";

//Motions
const Motions = {
    Extend: "Extend Current Motion",
    IntroduceVoting: "Introduce Directives and Enter Voting Procedure",
    Voting: "Enter Voting Procedure",
    Introduce: "Introduce Directives",
    Unmod: "Unmoderated Caucus",
    StrawPoll: "Straw Poll",
    RoundRobin: "Round Robin",
    Mod: "Moderated Caucus",
}

class Motion {
    constructor(type, rank) {
        this.hasDel = false;
        this.delegate = null;
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

    addDelegate(del) {
        this.delegate = del;
        this.hasDel = true;
    }

    removeDelegate() {
        if (this.hasDel) {
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
}

class Extend extends Motion {
    constructor() {
        super(Motions.Extend, 0);
    }
}

class IntroduceVoting extends Motion {
    constructor() {
        super(Motions.IntroduceVoting, 1)
    }
}

class Voting extends Motion {
    constructor(speakers, speakingTime) {
        super(Motions.Voting, 2);
        this.speakers = speakers;
        this.speakingTime = speakingTime;
    }
}

class Introduce extends Motion {
    constructor() {
        super(Motions.Introduce, 3);
    }
}

class Unmod extends Motion {
    constructor(min, sec) {
        super(Motions.Unmod, 4);
        this.min = min;
        this.sec = sec;
        this.overallTime = min * 60 + sec;
    }
}

class StrawPoll extends Motion {
    constructor() {
        super(Motions.StrawPoll, 5)
    }
}

class RoundRobin extends Motion {
    constructor(speakingTime) {
        super(Motions.RoundRobin, 6);
        this.speakingTime = speakingTime;
    }
}

class Mod extends Motion {
    constructor(topic, min, sec, speakingTime) {
        super(Motions.Mod, 7);
        this.topic = topic;
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

export {Motions, Vote, Extend, Voting, Introduce, IntroduceVoting, Unmod, StrawPoll, RoundRobin, Mod};