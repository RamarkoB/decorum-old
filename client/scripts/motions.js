//Motions
const Motions = {
    Extend: "Extend Current Motion",
    Voting: "Voting Procedure",
    Introduce: "Introduce Directives",
    Unmod: "Unmoderated Caucus",
    StrawPoll: "Straw Poll",
    RoundRobin: "Round Robin",
    Mod: "Moderated Caucus",
}

const Vote = {
    NA: "NA",
    Passed: "Passed",
    Failed: "Failed"
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