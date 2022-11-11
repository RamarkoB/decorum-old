const Attendence = {
    Present: 'present',
    Voting: 'voting',
    Absent:'absent'
  };
  
class Delegate {
    constructor(name, attendence) {
        this.name = name;
        this.attendence = (attendence === undefined) ? Attendence.Absent : attendence;
        this.timesSpoken = 0;
    }

    updateAttendence() {
        if (this.attendence == Attendence.Absent){
        this.attendence = Attendence.Present;
        } else {
        this.attendence = Attendence.Absent;
        }
        socket.emit("delegateUpdate", delegates);
    }
}

class Speaker {
    constructor(del) {
        this.delegate = del;
        this.spoken = false;
        this.delegate.timesSpoken++;
    }

    speak() {
        this.spoken = true;
    }
}

class SpeakersList {
    constructor(delList){
        this.list = delList;
        this.NumSpeakers = delList.length;
        this.speakerNum = 0;
    }

    hasNext(){
        return (this.speakerNum < this.NumSpeakers);
    }

    getCurrentSpeaker() {
        return this.list[this.speakerNum];
    }

    nextSpeaker() {
        this.list[this.speakerNum].speak();
        this.speakerNum++;
    }
}
