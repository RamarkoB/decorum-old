socket.on("stateInit", (delNames) => {
    state = new State(delNames);
    console.log(state);
});

socket.on("markPresent", (index) => {
    state.attendenceInit(index, Attendence.Present);
});