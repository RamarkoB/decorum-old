import { state } from "./../state/state"
import { DirOrder } from "../state/directives";
import { MakeMotionDiv, MotionDiv } from './motiondivs';
import { MakeDirectiveDiv, DirectiveDiv, DirVoteSpeakDiv } from "./directivedivs"
import { Attendence, Page, Status } from './../state/structs';
import { Motions } from '../state/motions';
import { useState } from 'react';

function stringify(num) {
    return (num < 10 ? "0" + String(num) : String(num));
}

//Module to vote on a Directive or Motion
function VoteModule(props) {
    function pass() {
        if (props.type === "motion"){
            state.passMotion(props.index);
        } else if (props.type === "directive") {
            state.passDirective(props.index);
        }
    }

    function fail() {
        if (props.type === "motion"){
            state.failMotion(props.index);
        } else if (props.type === "directive") {
            state.failDirective(props.index);
        }
    }

    function remove() {
        if (props.type === "motion"){
            state.removeMotion(props.index);
        } else if (props.type === "directive") {
            state.removeDirective(props.index);
        }
    }


    return  <ul className="list-inline pass-module">
                <li className="list-inline-item">
                    <button type="button" className="btn btn-demo" onClick={pass}>Pass</button>
                </li>
                <li className="list-inline-item">
                    <button type="button" className="btn btn-demo" onClick={fail}>Fail</button>
                </li>
                <li className="list-inline-item">
                    <button type="button" className="btn btn-demo" onClick={remove}>Remove</button>
                </li>
            </ul>
}

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
    const [search, setSearch] = useState("");
    const present = state.filterPresent(search);

    function changeDel(del){
        const index = state.getDelegates().indexOf(del);
        
        props.parent.removeSpeaker(props.index);
        props.parent.addSpeaker(props.index, index);
    }

    const presentDels = (state.getPresent().length > 0) ?
    [<input placeholder='Search...' onChange={(e) => setSearch(e.target.value)} key="search" ></input>,
    present.length > 0 ? 
        present.map(del => 
            <button className="dropdown-item text-center text-uppercase" onClick={() => changeDel(del)} key={del.getName()}>
                {del.getName()} {del.getTimesSpoken()}
            </button>):
        <button className="dropdown-item text-center text-uppercase"> No Delegates Found </button>]:
    <button className="dropdown-item text-center text-uppercase"> No Delegates Present </button>;
    

  return  <div className="dropdown">
              <button data-bs-toggle="dropdown">
                  <div className={props.spoken? "card mini speaker pink" : "card mini speaker"}>
                      <p>{props.name}</p>
                  </div>
              </button>
              <div className="dropdown-menu">
                    {presentDels}
              </div>
          </div>
}

function TimerDiv() {
    const placeholderMin = stringify(state.getLength().min);
    const placeholderSec = stringify(state.getLength().sec);
    const timerMin = stringify(state.getTime().minutes);
    const timerSec = stringify(state.getTime().seconds);

    let timerNums;


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
    const numPresent = state.numPresent();
    const delegates = state.getDelegates().map((del, index) =>
        <DelegateDiv attendence={del.attendence} name={del.name} index={index} key={index}/>
    );
    const sigCount =    <div id='sigcount' className='notready card inactive'>
                            <p>A Directive Requires</p>
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
                    <p>A 2/3 Majority Requires</p>
                    <h1>{Math.round(numPresent * 2/3)}</h1>
                    <p>Delegates</p>
                </div>
                <div className='card'>
                    <p>A Simple Majority Requires</p>
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

function SpeakersPage() {
    const speakers = state.getSpeakers().map((speaker, index) =>
    <SpeakerDiv parent={state} spoken={speaker.hasSpoken()} name={state.getSpeaker(index)} index={index} key={index}/>
    );

    const speakerNum = state.speakers?
    <h1>{Math.min(state.speakers.numSpeakers, state.speakers.speakerNum + 1)} / {speakers.length} Speakers</h1>:
    <h1> No Speakers List</h1>;

    const speakerChange = <ul className="list-inline">
                            <li className="list-inline-item">
                                <button type="button" className="btn btn-demo" onClick={lastSpeaker}>Last Speaker</button>
                            </li>
                            <li className="list-inline-item">
                                <button type="button" className="btn btn-demo" onClick={nextSpeaker}>Next Speaker</button>
                            </li>
                        </ul>

    function lastSpeaker() {
        state.lastSpeaker();
    }

    function nextSpeaker() {
        state.nextSpeaker();
    }

    return  [<div id="speakersList" className="left side col-4" key="speakersList">
                {speakers}
            </div>,
            <div id="modMain" className="side col-8" key="modMain">
                <h1>{state.currentMotion.topic}</h1>
                <TimerDiv />
                {speakerChange}
                {speakerNum}
            </div>]
}

function VotingPage() {
    const directives = state.getDirectives(DirOrder.introduced).map((dir, index) =>
        <DirVoteSpeakDiv dir={dir} status={dir.status} index={index} key={index}/>
    );

    // const speakerNum = state.speakers?
    // <h1>{Math.min(state.speakers.numSpeakers, state.speakers.speakerNum + 1)} / {speakers.length} Speakers</h1>:
    // <h1> No Speakers List</h1>;

    const speakerChange = <ul className="list-inline">
                            <li className="list-inline-item">
                                <button type="button" className="btn btn-demo" onClick={lastSpeaker}>Last Speaker</button>
                            </li>
                            <li className="list-inline-item">
                                <button type="button" className="btn btn-demo" onClick={nextSpeaker}>Next Speaker</button>
                            </li>
                        </ul>

    function lastSpeaker() {
        state.lastSpeaker();
    }

    function nextSpeaker() {
        state.nextSpeaker();
    }
    
    return  [<div id="dirSpeakersList" className="left side col-4" key="speakersList">
                {directives}
            </div>,
            <div id="dirSpeakersMain" className="side col-8" key="modMain">
                <TimerDiv />
                {speakerChange}
                {/* {speakerNum} */}
            </div>]
}

function DirectivesPage() {
    const directives = state.getDirectives().map((dir, index) =>
        <DirectiveDiv dir={dir} status={dir.status} index={index} key={index}/>
    );

    // function pastDirectives() {
    //     console.log(state.getPastDirectives());
    // }

    // function passedDirectives() {
    //     console.log(state.getPassedDirectives());
    // }

    // function failedDirectives() {
    //     console.log(state.getFailedDirectives());
    // }

    function voteOnDirective() {
        state.genVoting(state.currentMotion.numSpeakers, state.currentMotion.speakingTime);
        state.toPage(Page.speakers);
    }

    return  [<div id="directivesList" className="left side col-4" key="directivesList">
                <MakeDirectiveDiv />
                {state.getCurrentMotionType() === Motions.Voting ?
                    <button className="btn btn-demo" onClick={voteOnDirective}>Vote on Directives</button>:
                    <div></div>
                }

                <button className="btn btn-demo" onClick={() => state.clearDirectives()}>Clear Directives</button>
                {/* <button className="btn btn-demo notready" onClick={pastDirectives}>All Past Directives</button>
                <button className="btn btn-demo notready" onClick={passedDirectives}>Passed Directives</button>
                <button className="btn btn-demo notready" onClick={failedDirectives}>Failed Directives</button> */}
            </div>,
            <div id="directivesMain" className="side col-8" key="directivesMain">
                {directives}
            </div>];
}

function MotionsPage() {
  const motionTypes = state.getMotionTypes().map((motion) => {
    if (state.currentMotion === null) {
        if (motion !== Motions.Extend) {
            return <MakeMotionDiv motion={motion} key={motion}/>
        }
    } else if ((state.currentMotion.type === Motions.Mod) || (state.currentMotion.type === Motions.Unmod)) {
        return <MakeMotionDiv motion={motion} key={motion}/>
    } else {
        if (motion !== Motions.Extend) {
            return <MakeMotionDiv motion={motion} key={motion}/>
        }       
    }
    return [];
  });
  
  const motions = state.getMotions()
                .map((motion, index) => <MotionDiv motion={motion} index={index} key={index}/> );

  return [<div id="motionSelect" className="left side col-4" key="motionSelect">{motionTypes}</div>,
          <div id="motionsMain" className="side col-8" key="motionsMain">{motions}</div>]
}

export { VoteModule, SpeakerDiv, stringify };
export { DelegatePage, UnmodPage, SpeakersPage, DirectivesPage, MotionsPage, VotingPage };