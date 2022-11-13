let socket = io();
let el;
let state;

const speakers = ReactDOM.createRoot(document.getElementById('speakers')); 
const timerDiv = ReactDOM.createRoot(document.getElementById('timer')); 

function SpeakerDiv(props) {
  function updateAttendence(){
    if (state.getAttendence(props.index) == Attendence.Absent){
      state.markPresent(props.index);
    } else {
      state.markAbsent(props.index);
    }
  }

  if (props.attendence == Attendence.Absent){
    return <div className="card speaker spoken" onClick={updateAttendence}><p>{props.name}</p></div>
  } else {
    return <div className="card speaker" onClick={updateAttendence}><p>{props.name}</p></div>
  }
}

function TimerDiv(props) {
  return <div className="timer py-4" key="timer">
  <p className="timer-inactive">
    <input placeholder="00" maxLength="2" pattern="\d*"></input> Min 
    <input placeholder="00" maxLength="2" pattern="\d*"></input> Sec
  </p>
</div>
}

function TimerButtons(props) {
  function statusCheck(status){
    if (status = Status.Inactive){
      return "Start";
    } else if (status = Status.Active){
      return "Pause";
    } else {
      return "Play";
    }
  }


  return <ul className="list-inline">
            <li className="list-inline-item">
              <button type="button" className="btn btn-demo">Reset</button>
            </li>
            <li className="list-inline-item">
              <button type="button" className="btn btn-demo">{statusCheck(props.status)}</button>
            </li>
        </ul>
}

function tick(){
  const listItems = state.getDelegates().map((del, index) =>
    <SpeakerDiv attendence={del.attendence} name={del.name} index={index} key={index}/>
  );
  speakers.render(listItems);
  const timerItems = 
    [<TimerDiv key="timer"/>,
    <TimerButtons status={Status.Inactive} key="timerButtons"/>];
    
    timerDiv.render(timerItems);
}

setInterval(tick, 100);