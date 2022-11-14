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