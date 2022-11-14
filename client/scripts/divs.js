function SpeakerDiv(props) {
    function updateAttendence(){
      if (state.getAttendence(props.index) == Attendence.Absent){
        state.markPresent(props.index);
      } else {
        state.markAbsent(props.index);
      }
    }
  
    if (props.attendence == Attendence.Absent){
      return <div className="speaker spoken" onClick={updateAttendence}><p>{props.name}</p></div>
    } else {
      return <div className="card speaker" onClick={updateAttendence}><p>{props.name}</p></div>
    }
  }
  
function TimerDiv(props) {
function write(){
    state.writeTimer();
}

function statusCheck(){
    if (state.getTimerStatus() == Status.Inactive){
    return "Start";
    } else if (state.getTimerStatus() == Status.Active){
    return "Pause";
    } else {
    return "Play";
    }
}

function reset() {
    state.resetTimer();
}

function buttonCheck(){
    if (state.getTimerStatus() == Status.Inactive) {
    const minutesString = document.getElementById(props.section + "-timer-min").value;
    const secondsString = document.getElementById(props.section + "-timer-sec").value;

    const minutes = (minutesString == "") ? 0 : parseInt(minutesString);
    const seconds = (secondsString == "") ? 0 : parseInt(secondsString);

    state.setTimer(minutes, seconds);
    state.playTimer();
    } else if (state.getTimerStatus() == Status.Active) {
    state.pauseTimer();
    } else {
    state.playTimer();
    }

}

function stringify(num) {
    return (num < 10 ? "0" + String(num) : String(num));
}

const placeholderMin = stringify(state.getLength().min);
const placeholderSec = stringify(state.getLength().sec);
const timerMin = stringify(state.getTime().minutes);
const timerSec = stringify(state.getTime().seconds);


let timerNums;
if (state.getTimerStatus() == Status.Inactive){
    timerNums = <p className="timer-inactive">
    <input id={props.section + "-timer-min"} placeholder={placeholderMin} maxLength="2" pattern="\d*"></input> Min 
    <input id={props.section + "-timer-sec"} placeholder={placeholderSec} maxLength="2" pattern="\d*"></input> Sec
    </p>
} else {
    timerNums = <div>
    <p className='timer-active' onClick={write}>
        <span id="timer-min" className='timer-text timer-min h1 font-weight-bold'>{timerMin}</span> Min 
        <span id="timer-sec" className='timer-text timer-sec h1 font-weight-bold'>{timerSec}</span> Sec
    </p>
    </div>
}


return  <div className="timerDiv">
            <div className="timer py-4" key="timer">
                {timerNums}
            </div>
            <ul className="list-inline">
                <li className="list-inline-item">
                    <button type="button" className="btn btn-demo" onClick={reset}>Reset</button>
                </li>
                <li className="list-inline-item">
                    <button type="button" className="btn btn-demo" onClick={buttonCheck}>{statusCheck()}</button>
                </li>
            </ul>
        </div>
    

}