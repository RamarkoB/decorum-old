socket.on("stateInit", (delNames) => {
    state = new State(delNames);
    console.log(state);
});

socket.on("markPresent", (index) => {
    console.log("Delegate Update: Marked " + state.getName(index) + " Present");
    state.updateAttendence(index, Attendence.Present);
});

socket.on("markAbsent", (index) => {
    console.log("Delegate Update: Marked " + state.getName(index) + " Absent");
    state.updateAttendence(index, Attendence.Absent);
});

socket.on("set", (min, sec) => {
    state.updateTimer("set", (min, sec));
    console.log("Timer Update: Set timer to (" + min + ":" + sec + ")" );
})

socket.on("play", (deadline) => {
  state.updateTimer("play", new Date(deadline));
  console.log("Timer Update: Play timer until (" + deadline + ")" );
})

socket.on("pause", (offset) => {
  state.updateTimer("pause", offset);
  console.log("Timer Update: Pause timer at (" + offset + ")" );
})

socket.on("reset", () => {
  state.updateTimer("reset");
  console.log("Timer Update: Reset timer to (" + state.getLength().min + ":" + state.getLength().sec + ")" );
})

socket.on("makeSpeakersList", (num) => {
  state.updateSpeakers("makeSpeakersList", num);
  console.log("Speakers Update: Generated Speakers list with " + num + " speakers");
});

socket.on("addSpeaker", (i, delnum) => {
  // state.addSpeaker(i, delnum);
  state.updateSpeakers("addSpeaker", [i, delnum]);
  console.log("Speakers Update: Speaker " + i +  " is " + state.getName(delnum));
});

socket.on("removeSpeaker", (num) => {
  state.updateSpeakers("removeSpeaker", num);
  console.log("Speakers Update: Removed" + state.getName(num) + "from speakers list");
});

socket.on("nextSpeaker", () => {
  state.updateSpeakers("nextSpeaker");
  console.log("Speakers Update: Next Speaker"); //return to add more
});