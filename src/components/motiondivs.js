//Imports
import React, { useState } from 'react';
import { Motions, Extend, Voting, Introduce, Unmod, StrawPoll, RoundRobin, Mod } from '../state/motions';
import { Vote } from "../state/structs"
import state from "./../state/state"

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


//Input Divs
// function ExtendInputDiv() {
//     if (!state.currentMotion) {
//         return [];
//     }

//     switch (state.currentMotion.type) {
//         case Motions.Mod: return <MakeModDiv />;
//         case Motions.Unmod: return <MakeUnmodDiv />;
//         default: return [];
//     }
// }

function MakeVotingDiv() {
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
    const [speakers, setSpeakers] = useState(0);
    
    function addMotion() {
        if (isNaN(Number(min)) || isNaN(Number(sec)) || isNaN(Number(speakers))) {
            console.log("we got a not a number ovah here!");
        } else {
            state.addMotion(new Voting(speakers, 60 * min + sec));
        }
    }

    return  [<div key="votingInput">
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setMin(e.target.value)}></input> Min 
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSec(e.target.value)}></input> Sec 
                </p>
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSpeakers(e.target.value)}></input> Speakers For/Against 
                </p>
            </div>,
            <button className='btn' onClick={addMotion} key="votingButton">
                    Add Motion
            </button>]
}

function MakeUnmodDiv() {
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);

    function addMotion() {
        if (isNaN(Number(min)) || isNaN(Number(sec))) {
            console.log("we got a not a number ovah here!");
        } else {
            state.addMotion(new Unmod(min, sec));
        }
    }

    return  [<div key="unmodInput">
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setMin(e.target.value)}></input> Min 
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSec(e.target.value)}></input> Sec 
                </p>
            </div>, 
            <button className='btn' onClick={addMotion} key="UnmodButton">
                    Add Motion
            </button>]
}

function MakeModDiv() {
    const [topic, setTopic] = useState("");
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
    const [speakingTime, setSpeakingTime] = useState(0);

    function addMotion() {
        if (isNaN(Number(min)) || isNaN(Number(sec)) || isNaN(Number(speakingTime))) {
            console.log("we got a not a number ovah here!");
        } else {
            state.addMotion(new Mod(topic, Number(min), Number(sec), Number(speakingTime)));
        }
    }

    return  [<div key="modInput">
                <p className="motion-input">
                    <input id="makemod-topic" placeholder="Topic" onChange={(e) => setTopic(e.target.value)}></input> 
                </p>
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setMin(e.target.value)}></input> Min 
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSec(e.target.value)}></input> Sec 
                </p>
                <p className="motion-input">
                <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSpeakingTime(e.target.value)}></input> Speaking Time </p>
            </div>, 
            <button className='btn' onClick={addMotion} key="modButton">
                    Add Motion
            </button>]
}

function MakeRoundRobinDiv() {
    const [speakingTime, setSpeakingTime] = useState(0);

    function addMotion() {
        if (isNaN(Number(speakingTime))) {
            console.log("we got a not a number ovah here!");
        } else {
            state.addMotion(new RoundRobin(speakingTime));
        }
    }

    return  [<div key="roundRobinInput">
                <p className="motion-input">
                    <input placeholder="00" maxLength="2" pattern="\d*" onChange={(e) => setSpeakingTime(e.target.value)}></input> Speaking Time 
                </p>
            </div>,
            <button className='btn' onClick={addMotion} key="roundRobinButton">
                Add Motion
            </button>]
}

function MakeMotionDiv(props) {
    const [expanded, setExpand] = useState(false);

    function getMotionInput() {
        switch (props.motion) {
            // case Motions.Extend:        return <ExtendInputDiv setMods={setMods} />;
            case Motions.Voting:        return <MakeVotingDiv key="votingInputs"/>;
            case Motions.Unmod:         return <MakeUnmodDiv key="unmodInputs"/>;
            case Motions.Mod:           return <MakeModDiv key="modInputs"/>;
            case Motions.RoundRobin:    return <MakeRoundRobinDiv key="roundRobinInputs"/>;
            default:                    
                return  <button className='btn' onClick={addMotion} key="button">
                            Add Motion
                        </button>;
        }
    }

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

                // no default
        }
    }

    function switchExpand() {
        if (expanded === true) {
            setExpand(false);
        } else if (expanded === false) {
            setExpand(true);
        }
    }

    return  <div className="card mini motion" >
                {expanded? [<p key="Motion Name" onClick={switchExpand}>{props.motion}</p>, getMotionInput()] 
                : <p onClick={switchExpand}>{props.motion}</p>}
            </div>
}

//Motion Divs
function ExtendDiv() {
    switch (state.currentMotion) {
        case Motions.Mod: return <ModDiv />;
        case Motions.Unmod: return <UnmodDiv />;
        default: return [];
    }
}

function VotingDiv(props) {
    return  <p className="motion-text">
                <span>{stringify(props.motion.speakingTime)}</span>  Speaking Time 
                <span>{stringify(props.motion.speakers)}</span>  Speakers For/Against 
            </p>
}

function UnmodDiv(props) {
    return  <p className="motion-text">
                <span>{stringify(props.motion.min)}</span> Min 
                <span>{stringify(props.motion.sec)}</span> Sec 
            </p>
            
}

function ModDiv(props) {
    return  [<p className='motion-text mod-topic'>
                <span>{props.motion.topic}</span>
            </p>
            ,<p className="motion-text">
                <span>{stringify(props.motion.min)}</span> Min 
                <span>{stringify(props.motion.sec)}</span> Sec 
                <span>{stringify(props.motion.speakingTime)}</span> Speaking Time
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
            case Motions.Extend:        return <ExtendDiv motion={props.motion} />
            case Motions.Voting:        return <VotingDiv motion={props.motion} />
            case Motions.Unmod:         return <UnmodDiv motion={props.motion} />
            case Motions.Mod:           return <ModDiv motion={props.motion} />
            case Motions.RoundRobin:    return <RoundRobinDiv motion={props.motion} />
            default:                    return <div></div>
        }
    }

    return  <div className={statusClass()}>
                <h3>{props.motion.type}</h3>
                {getMotion()}
                <VoteModule index={props.index} type={"motion"}/>
            </div>
}

//Directive Div
function DirectiveDiv(props){
    function statusClass() {
        if (props.status === Vote.Passed) {
            return "card directive green";
        } else if (props.status === Vote.Failed) {
            return "card directive pink";
        } else {
            return "card directive";
        }
    }

    return  <div className={statusClass()}>
                <h3><input placeholder="New Directive..."></input></h3>
                <VoteModule index={props.index} type={"directive"}/>
            </div>
}

//Exports
export { MakeMotionDiv, MotionDiv, DirectiveDiv, stringify};