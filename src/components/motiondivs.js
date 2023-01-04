import { Motions } from "../state/motions"
import { Vote } from "../state/structs"
import state from "./../state/state"

function VoteDiv(props) {
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

function ExtendDiv() {
    switch (state.currentMotion) {
        case Motions.Mod:
            return <ModDiv />
        case Motions.Unmod:
            return <ModDiv />
        default:
            return <div></div>
    }
}

function VotingDiv() {
    return  <p className="motion-input">
                <input placeholder="00" maxLength="2" pattern="\d*"></input> Min 
                <input placeholder="00" maxLength="2" pattern="\d*"></input> Sec
                <input placeholder="00" maxLength="2" pattern="\d*"></input> Speakers For/Against 
            </p>
}

function UnmodDiv() {
    return  <p className="motion-input">
                <input placeholder="00" maxLength="2" pattern="\d*"></input> Min 
                <input placeholder="00" maxLength="2" pattern="\d*"></input> Sec
            </p>
}

function ModDiv() {
    return  <p className="motion-input">
                <input placeholder="00" maxLength="2" pattern="\d*"></input> Min 
                <input placeholder="00" maxLength="2" pattern="\d*"></input> Sec
                <input placeholder="00" maxLength="2" pattern="\d*"></input> Speaking Time
            </p>
}

function MotionDiv(props) {

    function getMotion() {
        switch (props.motion.type) {
            case Motions.Extend: 
                return <ExtendDiv />
            case Motions.Voting: 
                return <VotingDiv />
            case Motions.Unmod: 
                return <UnmodDiv />
            case Motions.Mod: 
                return <ModDiv />
            default:
                return <div></div>
        }
    }

    function statusClass() {
        if (props.motion.status === Vote.Passed) {
            return "card green";
        } else if (props.motion.status === Vote.Failed) {
            return "card pink";
        } else {
            return "card";
        }
    }

    return  <div className={statusClass()}>
                <h3>{props.motion.type}</h3>
                {getMotion()}
                <VoteDiv index={props.index} type={"motion"}/>
            </div>
}

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
                <VoteDiv index={props.index} type={"directive"}/>
            </div>
}
export {MotionDiv, DirectiveDiv};