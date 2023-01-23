import { Vote } from "./structs";

//Motions
const Motions = {
    ExtendMod: "Extend Current Mod",
    ExtendUnmod: "Extend Current Unmod",
    IntroduceVoting: "Introduce Directives and Enter Voting Procedure",
    Voting: "Enter Voting Procedure",
    Introduce: "Introduce Directives",
    Unmod: "Unmoderated Caucus",
    StrawPoll: "Straw Poll",
    RoundRobin: "Round Robin",
    Mod: "Moderated Caucus",
}

class Motion {
    constructor(delegate, type, rank) {
        this.hasDel = false;
        this.delegate = delegate;
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

    getDelegate(){
        return this.delegate;
    }
}

class ExtendMod extends Motion {
    constructor(delegate, topic, min, sec, speakingTime) {
        super(delegate, Motions.ExtendMod, 0);
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

class ExtendUnmod extends Motion {
    constructor(delegate, min, sec) {
        super(delegate, Motions.ExtendUnmod, 0);
        this.min = min;
        this.sec = sec;
        this.overallTime = min * 60 + sec;
    }
}

class IntroduceVoting extends Motion {
    constructor(delegate) {
        super(delegate, Motions.IntroduceVoting, 1)
    }
}

class Voting extends Motion {
    constructor(delegate, order, numSpeakers, speakingTime) {
        super(delegate, Motions.Voting, 2);
        this.order = order;
        this.numSpeakers = numSpeakers;
        this.speakingTime = speakingTime;
    }
}

class Introduce extends Motion {
    constructor(delegate) {
        super(delegate, Motions.Introduce, 3);
    }
}

class Unmod extends Motion {
    constructor(delegate, min, sec) {
        super(delegate, Motions.Unmod, 4);
        this.min = min;
        this.sec = sec;
        this.overallTime = min * 60 + sec;
    }
}

class StrawPoll extends Motion {
    constructor(delegate) {
        super(delegate, Motions.StrawPoll, 5)
    }
}

class RoundRobin extends Motion {
    constructor(delegate, speakingTime) {
        super(delegate, Motions.RoundRobin, 6);
        this.speakingTime = speakingTime;
    }
}

class Mod extends Motion {
    constructor(delegate, topic, min, sec, speakingTime) {
        super(delegate, Motions.Mod, 7);
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

export {Motions, ExtendMod, ExtendUnmod, Voting, Introduce, IntroduceVoting, Unmod, StrawPoll, RoundRobin, Mod};