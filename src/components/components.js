import state from '../state/state';
import { MakeMotionDiv, MotionDiv, DirectiveDiv, stringify } from './motiondivs';
import { Attendence, Status } from './../state/structs';
import { Motions } from '../state/motions';

//Small Components
function DelegateDiv(props) {
  function updateAttendence(){
    if (state.getAttendence(props.index) === Attendence.Absent){
      state.markPresent(props.index);
    } else {
      state.markAbsent(props.index);
    }
  }

  if (props.attendence === Attendence.Absent){
    return <div className="card mini delegate pink" onClick={updateAttendence}><p>{props.name}</p></div>
  } else {
    return <div className="card mini delegate" onClick={updateAttendence}><p>{props.name}</p></div>
  }
}

function SpeakerDiv(props) {
  function changeDel(del){
      const index = state.getDelegates().indexOf(del);
      
      state.removeSpeaker(props.index);
      state.addSpeaker(props.index, index);
  }

  const present = state.getPresent();
  const presentDels = present.length > 0 ?
    present.map(del => <a className="dropdown-item text-center text-uppercase" onClick={() => changeDel(del)} key={del.getName()}>
        {del.getName()} {del.getTimesSpoken()}
        </a>):
        <a className="dropdown-item text-center text-uppercase"> No Delegates Present </a>
    

  return  <div className="dropdown">
              <a href="#" data-bs-toggle="dropdown">
                  <div className={props.spoken === "yes"? "card mini speaker pink" : "card mini speaker"}>
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
      if (state.getTimerStatus() === Status.Inactive){
      return "Start";
      } else if (state.getTimerStatus() === Status.Active){
      return "Pause";
      } else {
      return "Play";
      }
  }

  function reset() {
      state.resetTimer();
  }

  function buttonCheck(){
      if (state.getTimerStatus() === Status.Inactive) {
      const minutesString = document.getElementById("timer-min").value;
      const secondsString = document.getElementById("timer-sec").value;

      const minutes = (minutesString === "") ? 0 : parseInt(minutesString);
      const seconds = (secondsString === "") ? 0 : parseInt(secondsString);

      state.setTimer(minutes, seconds);
      state.playTimer();
      } else if (state.getTimerStatus() === Status.Active) {
      state.pauseTimer();
      } else {
      state.playTimer();
      }

  }

  const placeholderMin = stringify(state.getLength().min);
  const placeholderSec = stringify(state.getLength().sec);
  const timerMin = stringify(state.getTime().minutes);
  const timerSec = stringify(state.getTime().seconds);


  let timerNums;
  if (state.getTimerStatus() === Status.Inactive){
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
              <div className={state.getTimerStatus() === Status.Done ? "timerDiv pink" : "timerDiv"}>
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

    var sigCount =  <div id='sigcount' className='notready card inactive'>
                        <p>A Directive requires</p>
                        <h1>{state.signum}</h1>
                        <p>Signatories</p>
                    </div>


    return [<div id="delList" className="left side col-8" key="delList">{delegates}</div>, 
            <div id="delMain" className="side col-4" key="delMain">
                <div className='card'>
                    <p>There are</p>
                    <h1>{numPresent}</h1>
                    <p>Delegates</p>
                </div>
                <div className='card'>
                    <p>A 2/3 Majority requires</p>
                    <h1>{Math.round(numPresent * 2/3)}</h1>
                    <p>Delegates</p>
                </div>
                <div className='card'>
                    <p>A Simple Majority requires</p>
                    <h1>
                        {numPresent === 0 ? 0: numPresent % 2 === 0 ?
                        Math.round(numPresent * 1/2) + 1:
                        Math.round(numPresent * 1/2)}
                    </h1>
                    <p>Delegates</p>
                </div>
                {sigCount}
            </div>]
}

function UnmodPage() {
  return <div id="unmodMain">
            <TimerDiv />
        </div>
  
}

function ModPage() {
  function lastSpeaker() {
    state.lastSpeaker();
  }

  function nextSpeaker() {
    state.nextSpeaker();
  }

  const speakers = state.getSpeakers().map((speaker, index) =>
  <SpeakerDiv spoken={speaker.hasSpoken() ? "yes" : "no"} name={state.getSpeaker(index)} index={index} key={index}/>
);

  const speakerChange = <ul className="list-inline">
                            <li className="list-inline-item">
                                <button type="button" className="btn btn-demo" onClick={lastSpeaker}>Last Speaker</button>
                            </li>
                            <li className="list-inline-item">
                                <button type="button" className="btn btn-demo" onClick={nextSpeaker}>Next Speaker</button>
                            </li>
                        </ul>

  const speakerNum = state.speakers?
    <h1>{Math.min(state.speakers.numSpeakers, state.speakers.speakerNum + 1)} / {speakers.length} Speakers</h1>:
    <h1> No Speakers List</h1>;

  return    [<div id="speakersList" className="left side col-4" key="speakersList">
                {speakers}
            </div>,
            <div id="modMain" className="side col-8" key="modMain">
                <TimerDiv />
                {speakerChange}
                {speakerNum}
            </div>]
}

function DirectivesPage() {
    const directives = state.directives.map((directive, index) =>
        <DirectiveDiv status={directive.status} index={index} key={index}/>
    )

    return  [<div id="directivesList" className="left side col-4" key="directivesList">
                <ul >
                    <li className='dirButton'>
                        <button className="btn btn-demo" onClick={() => state.addDirective()}>Add Directive</button>
                    </li>
                    <li className='dirButton'>
                        <button className="btn btn-demo" onClick={() => state.clearDirectives()}>Clear Directives</button>
                    </li>
                </ul>
            </div>,
            <div id="directivesMain" className="side col-8" key="directivesMain">
                {directives}
            </div>];
}

function MotionsPage() {
  const motionTypes = Object.values(Motions).map((motion) =>
      <MakeMotionDiv motion={motion} key={motion}/>
  );
  const motions = state.getMotions().map((motion, index) =>
      <MotionDiv motion={motion} index={index} key={index}/>
  )

  return [<div id="motionSelect" className="left side col-4" key="motionSelect">{motionTypes}</div>,
          <div id="motionsMain" className="side col-8" key="motionsMain">{motions}</div>]
}

export {DelegatePage, UnmodPage, ModPage, DirectivesPage, MotionsPage};