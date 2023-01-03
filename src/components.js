import { Attendence, Status } from './structs';
import state from './state';
import {Motions, Extend, Voting, Introduce, Unmod, StrawPoll, RoundRobin, Mod} from './motions';


//Small Components
function DelegateDiv(props) {
  function updateAttendence(){
    if (state.getAttendence(props.index) == Attendence.Absent){
      state.markPresent(props.index);
    } else {
      state.markAbsent(props.index);
    }
  }

  if (props.attendence == Attendence.Absent){
    return <div className="card mini delegate absent" onClick={updateAttendence}><p>{props.name}</p></div>
  } else {
    return <div className="card mini delegate" onClick={updateAttendence}><p>{props.name}</p></div>
  }
}

function LilMotionDiv(props) {
  function addMotion() {
      switch (props.motion) {
          case Motions.Extend:
              state.addMotion(new Extend());
              break;
          case Motions.Voting:
              state.addMotion(new Voting(0, 0));
              break;
          case Motions.Introduce:
              state.addMotion(new Introduce());
              break;
          case Motions.Unmod:
              state.addMotion(new Unmod(0, 0));
              break;
          case Motions.RoundRobin:
              state.addMotion(new RoundRobin());
              break;
          case Motions.StrawPoll:
              state.addMotion(new StrawPoll());
              break;
          case Motions.Mod:
              state.addMotion(new Mod(0, 0));
              break;
      }
  }

  return  <div className="card mini motion" onClick={addMotion}><p>{props.motion}</p></div>
}

function BigMotionDiv(props) {
  return  <div className="card bigMotion">
              <h3>{props.motion}</h3>
          </div>
}

function SpeakerDiv(props) {
  function changeDel(del){
      const index = state.getDelegates().indexOf(del);
      state.addSpeaker(props.index, index);
  }

  const present = state.getPresent();
  const presentDels = present.map(del => <a className="dropdown-item text-center text-uppercase" onClick={() => changeDel(del)} key={del.getName()}>
      {del.getName()}
      </a>)

  return  <div className="dropdown">
              <a href="#" data-bs-toggle="dropdown">
                  <div className={props.spoken == "yes"? "card mini speaker spoken" : "card mini speaker"}>
                      <p>{props.name}</p>
                  </div>
              </a>
              <div className="dropdown-menu">
                  {presentDels}
              </div>
          </div>
}

function TimerDiv() {
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
      const minutesString = document.getElementById("timer-min").value;
      const secondsString = document.getElementById("timer-sec").value;

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
      <input id={"timer-min"} placeholder={placeholderMin} maxLength="2" pattern="\d*"></input> Min 
      <input id={"timer-sec"} placeholder={placeholderSec} maxLength="2" pattern="\d*"></input> Sec
      </p>
  } else {
      timerNums = <div>
      <p className='timer-active' onClick={write}>
          <span id="timer-min" className='timer-text timer-min h1 font-weight-bold'>{timerMin}</span> Min 
          <span id="timer-sec" className='timer-text timer-sec h1 font-weight-bold'>{timerSec}</span> Sec
      </p>
      </div>
  }


  return  <div>
              <div className="timerDiv">
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
          </div>
      
}


//Page Components
function DelegatePage() {
  const delegates = state.getDelegates().map((del, index) =>
      <DelegateDiv attendence={del.attendence} name={del.name} index={index} key={index}/>
  );
  const numPresent = state.numPresent();

  return [<div id="delList" className="side col-8 scroll" key="delList">{delegates}</div>, 
          <div id="delMain" className="side col-4 scroll" key="delMain">
            <div className='delegateCount'>
                <div className='card'>
                    <p>There are</p>
                    <h1>{numPresent}</h1>
                    <p>Delegates</p>
                </div>
            </div>
            <div className='delegateCount'>
                <div className='card'>
                    <p>A 2/3 Majority requires</p>
                    <h1>{Math.round(numPresent * 2/3)}</h1>
                    <p>Delegates</p>
                </div>
            </div>
            <div className='delegateCount'>
                <div className='card'>
                    <p>A Simple Majority requires</p>
                    <h1>{Math.round(numPresent * 1/2)}</h1>
                    <p>Delegates</p>
                </div>
            </div>
            <div className='delegateCount'>
                <div className='card'>
                    <p>A Directive requires</p>
                    <h1>{Math.round(numPresent * 1/2)}</h1>
                    <p>Signatories</p>
                </div>
            </div> 
          </div>]
}

function UnmodPage() {
  return <TimerDiv />
}

function ModPage() {
  const speakers = state.getSpeakers().map((speaker, index) =>
      <SpeakerDiv spoken={speaker.hasSpoken() ? "yes" : "no"} name={state.getSpeaker(index)} index={index} key={index}/>
  );

  return [<div id="speakersList" className="side col-4 scroll" key="speakersList">
              {speakers}
          </div>,
          <div id="modMain" className="side col-8" key="modMain">
              <TimerDiv />
          </div>]
}

function DirectivesPage() {
  return [<div id="directivesList" className="side col-4 scroll" key="directivesList"></div>,
          <div id="directivesMain" className="side col-8" key="directivesMain"></div>];
}

function MotionsPage() {
  const motionTypes = Object.values(Motions).map((motion) =>
      <LilMotionDiv motion={motion} key={motion}/>
  );
  const motions = state.getMotions().map((motion) =>
      <BigMotionDiv motion={motion.type} key={motion.rank}/>
  )

  return [<div id="motionSelect" className="side col-4 scroll" key="motionSelect">{motionTypes}</div>,
          <div id="motionsMain" className="side col-8" key="motionsMain">{motions}</div>]
}

export {state, DelegatePage, UnmodPage, ModPage, DirectivesPage, MotionsPage};