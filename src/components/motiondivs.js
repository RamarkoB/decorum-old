//Imports
import React, { useState } from 'react';
import { Motions, ExtendMod, ExtendUnmod, Voting, Introduce, Unmod, StrawPoll, RoundRobin, Mod } from '../state/motions';
import { Vote } from "../state/structs"
import { DirOrder } from "../state/directives";
import { stringify, VoteModule } from "./components"
import { state } from "./../state/state"


//Input Divs
function MakeExtendModDiv(props) {
    const [min, setMin] = useState("");
    const [sec, setSec] = useState("");

    function addMotion() {
        if (isNaN(Number(min)) || isNaN(Number(sec))) {
            console.log("we got a not a number ovah here!");
        } else {
            state.addMotion(new ExtendMod(props.delegate, state.currentMotion.topic, Number(min), Number(sec), state.currentMotion.speakingTime));
            props.setDel(null);
            setMin("");
            setSec("");
        }
    }

    return  [<div className="motion-inputs" key="modInput">
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setMin(e.target.value)} value={min}/> Min 
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSec(e.target.value)} value={sec}/> Sec 
                </p>
            </div>, 
            <button className='btn add-motion' onClick={addMotion} key="modButton">
                    Add Motion
            </button>]
}

function MakeExtendUnmodDiv(props) {
    const [min, setMin] = useState("");
    const [sec, setSec] = useState("");

    function addMotion() {
        if (isNaN(Number(min)) || isNaN(Number(sec))) {
            console.log("we got a not a number ovah here!");
        } else {
            state.addMotion(new ExtendUnmod(props.delegate, Number(min), Number(sec)));
            props.setDel(null);
            setMin("");
            setSec("");
        }
    }

    return  [<div className="motion-inputs" key="unmodInput">
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setMin(e.target.value)} value={min}/> Min 
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSec(e.target.value)} value={sec}/> Sec 
                </p>
            </div>, 
            <button className='btn add-motion' onClick={addMotion} key="UnmodButton">
                    Add Motion
            </button>]
}

function MakeVotingDiv(props) {
    const [min, setMin] = useState("");
    const [sec, setSec] = useState("");
    const [speakers, setSpeakers] = useState("");
    
    function addMotion() {
        if (isNaN(Number(min)) || isNaN(Number(sec)) || isNaN(Number(speakers))) {
            console.log("we got a not a number ovah here!");
        } else {
            state.addMotion(new Voting(props.delegate, DirOrder.introduced, Number(speakers), Number(60 * min + sec)));
            props.setDel(null);
            setMin("");
            setSec("");
            setSpeakers("");
        }
    }

    return  [<div className="motion-inputs" key="votingInput">
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setMin(e.target.value)} value={min}/> Min 
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSec(e.target.value)} value={sec}/> Sec 
                </p>
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSpeakers(e.target.value)} value={speakers}/> Speakers For/Against 
                </p>
            </div>,
            <button className='btn add-motion' onClick={addMotion} key="votingButton">
                    Add Motion
            </button>]
}

function MakeUnmodDiv(props) {
    const [min, setMin] = useState("");
    const [sec, setSec] = useState("");

    function addMotion() {
        if (isNaN(Number(min)) || isNaN(Number(sec))) {
            console.log("we got a not a number ovah here!");
        } else {
            state.addMotion(new Unmod(props.delegate, Number(min), Number(sec)));
            props.setDel(null);
            setMin("");
            setSec("");
        }
    }

    return  [<div className="motion-inputs" key="unmodInput">
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setMin(e.target.value)} value={min}/> Min 
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSec(e.target.value)} value={sec}/> Sec 
                </p>
            </div>, 
            <button className='btn add-motion' onClick={addMotion} key="UnmodButton">
                    Add Motion
            </button>]
}

function MakeRoundRobinDiv(props) {
    const [speakingTime, setSpeakingTime] = useState("");

    function addMotion() {
        if (isNaN(Number(speakingTime))) {
            console.log("we got a not a number ovah here!");
        } else {
            state.addMotion(new RoundRobin(props.delegate, Number(speakingTime)));
            props.setDel(null);
            setSpeakingTime("");
        }
    }

    return  [<div className="motion-inputs" key="roundRobinInput">
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSpeakingTime(e.target.value)} value={speakingTime}/> Speaking Time 
                </p>
            </div>,
            <button className='btn add-motion' onClick={addMotion} key="roundRobinButton">
                Add Motion
            </button>]
}

function MakeModDiv(props) {
    const [topic, setTopic] = useState("");
    const [min, setMin] = useState("");
    const [sec, setSec] = useState("");
    const [speakingTime, setSpeakingTime] = useState("");

    function addMotion() {
        if (isNaN(Number(min)) || isNaN(Number(sec)) || isNaN(Number(speakingTime))) {
            console.log("we got a not a number ovah here!");
        } else {
            state.addMotion(new Mod(props.delegate, topic, Number(min), Number(sec), Number(speakingTime)));
            props.setDel(null);
            setTopic("");
            setMin("");
            setSec("");
            setSpeakingTime("");
        }
    }

    return  [<div className="motion-inputs" key="modInput">
                <p className="motion-input">
                    <input id="makemod-topic" placeholder="Topic" onChange={(e) => setTopic(e.target.value)}  value={topic}/> 
                </p>
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setMin(e.target.value)} value={min}/> Min 
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSec(e.target.value)} value={sec}/> Sec 
                </p>
                <p className="motion-input">
                <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSpeakingTime(e.target.value)} value={speakingTime}/> Speaking Time </p>
            </div>, 
            <button className='btn add-motion' onClick={addMotion} key="modButton">
                    Add Motion
            </button>]
}

function MakeMotionDiv(props) {
    const [expanded, setExpand] = useState(false);
    const [search, setSearch] = useState("");
    const [delegate, setDel] = useState(null);
    const present = state.filterPresent(search);

    function getMotionInput() {
        switch (props.motion) {
            case Motions.IntroduceVoting:   return <MakeVotingDiv delegate={delegate} setDel={setDel} key="votingInputs"/>;
            case Motions.ExtendMod:         return <MakeExtendModDiv delegate={delegate} setDel={setDel} key="votingInputs"/>;
            case Motions.ExtendUnmod:       return <MakeExtendUnmodDiv delegate={delegate} setDel={setDel} key="votingInputs"/>;
            case Motions.Voting:            return <MakeVotingDiv delegate={delegate} setDel={setDel} key="votingInputs"/>;
            case Motions.Unmod:             return <MakeUnmodDiv delegate={delegate} setDel={setDel} key="unmodInputs"/>;
            case Motions.Mod:               return <MakeModDiv delegate={delegate} setDel={setDel} key="modInputs"/>;
            case Motions.RoundRobin:        return <MakeRoundRobinDiv delegate={delegate} setDel={setDel} key="roundRobinInputs"/>;
            default:                    
                return  <button className='btn add-motion' onClick={addMotion} key="button">
                            Add Motion
                        </button>;
        }
    }

    function addMotion() {
        switch (props.motion) {
            case Motions.Introduce:
                state.addMotion(new Introduce(delegate));
                break;
            case Motions.RoundRobin:
                state.addMotion(new RoundRobin(delegate));
                break;
            case Motions.StrawPoll:
                state.addMotion(new StrawPoll(delegate));
                break;

                // no default
        }
        setDel(null);
    }

    function switchExpand() {
        if (expanded === true) {
            setExpand(false);
        } else if (expanded === false) {
            setExpand(true);
        }
    }

    const presentDels = (state.getPresent().length > 0) ?
      [<input placeholder='Search...' onChange={(e) => setSearch(e.target.value)} key="getDel"/>,
      present.length > 0 ? 
          present.map(del => 
              <button className="dropdown-item text-center text-uppercase" onClick={() => setDel(del.getName())} key={del.getName()}>
                  {del.getName()}
              </button>):
          <button className="dropdown-item text-center text-uppercase"> No Delegates Found </button>]:
      <button className="dropdown-item text-center text-uppercase"> No Delegates Present </button>;

    return  <div className="card mini motion" >
                {expanded? 
                    [<p key="Motion Name" onClick={switchExpand}>{props.motion}</p>,
                    <div key="dropdown" className="dropdown">
                        <button data-bs-toggle="dropdown">
                            <div className="motionDelegate">
                                { delegate ?
                                    <p>{delegate}</p>:
                                    <p className='grey-text'>No Delegate Chosen</p>
                                }
                                
                            </div>
                        </button>
                        <div className="dropdown-menu">
                                {presentDels}
                        </div>
                    </div>,
                    getMotionInput()] 
                    : <p onClick={switchExpand}>{props.motion}</p>}
            </div>
}

//Motion Divs
function ExtendModDiv(props) {
    return  <p className="motion-text">
                <span>{stringify(props.motion.min)}</span> Min 
                <span>{stringify(props.motion.sec)}</span> Sec 
            </p>     
}

function ExtendUnmodDiv(props) {
    return  <p className="motion-text">
                <span>{stringify(props.motion.min)}</span> Min 
                <span>{stringify(props.motion.sec)}</span> Sec 
            </p>     
}

function VotingDiv(props) {
    return  <p className="motion-text">
                <span>{stringify(props.motion.speakingTime)}</span>  Speaking Time 
                <span>{stringify(props.motion.numSpeakers)}</span>  Speakers For/Against 
            </p>
}

function UnmodDiv(props) {
    return  <p className="motion-text">
                <span>{stringify(props.motion.min)}</span> Min 
                <span>{stringify(props.motion.sec)}</span> Sec 
            </p>         
}

function ModDiv(props) {
    return  [<p className='motion-text mod-topic' key="topic">
                {
                    props.motion.topic?
                    <span>{props.motion.topic}</span>:
                    <span className='grey-text'>No Topic Given</span> 
                }
                
            </p>
            ,<p className="motion-text" key="modifications">
                <span>{stringify(props.motion.min)}</span> Min 
                <span>{stringify(props.motion.sec)}</span> Sec 
                <span>{stringify(props.motion.speakingTime)}</span> Speaking Time
            </p>,
            <p className="motion-text" key="speakers">
                <span>({stringify(props.motion.numSpeakers)}</span> Speakers<span className="speaker-paren">)</span>
            </p>]
}

function RoundRobinDiv(props) {
    return  <p className="motion-text">
                <span>{stringify(props.motion.speakingTime)}</span> Speaking Time
            </p>
}

function MotionDiv(props) {
    function statusClass() {
        if (props.motion.status === Vote.Passed) {
            return "card green";
        } else if (props.motion.status === Vote.Failed) {
            return "card pink";
        } else {
            return "card";
        }
    }

    function getMotion() {
        switch (props.motion.type) {
            case Motions.ExtendMod:     return <ExtendModDiv motion={props.motion} />
            case Motions.ExtendUnmod:   return <ExtendUnmodDiv motion={props.motion} />
            case Motions.Voting:        return <VotingDiv motion={props.motion} />
            case Motions.Unmod:         return <UnmodDiv motion={props.motion} />
            case Motions.Mod:           return <ModDiv motion={props.motion} />
            case Motions.RoundRobin:    return <RoundRobinDiv motion={props.motion} />
            default:                    return <div></div>
        }
    }

    return  <div className={statusClass()}>
                <h3>{props.motion.type}</h3>
                { props.motion.delegate ?
                    <p className='propose-text'>Proposed by <span>{props.motion.delegate}</span></p>:
                    <p className='propose-text grey-text'> No Delegate Chosen </p>
                }
                {getMotion()}
                <VoteModule index={props.index} type={"motion"}/>
            </div>
}

//Exports
export { MakeMotionDiv, MotionDiv};