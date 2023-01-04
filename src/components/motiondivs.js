import { Motions, Vote } from "../state/motions"
import state from "./../state/state"

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

    function pass() {
        props.motion.pass();
        console.log(state);
    }

    function fail() {
        props.motion.fail();
        console.log(state);
    }

    function statusClass() {
        if (props.motion.status === Vote.Passed) {
            return "card bigMotion green";
        } else if (props.motion.status === Vote.Failed) {
            return "card bigMotion pink";
        } else {
            return "card bigMotion";
        }
    }

    return  <div className={statusClass()}>
                {[<h3>{props.motion.type}</h3>,
                getMotion(),
                <ul className="list-inline pass-module">
                    <li className="list-inline-item">
                        <button type="button" className="btn btn-demo" onClick={pass}>Pass</button>
                    </li>
                    <li className="list-inline-item">
                        <button type="button" className="btn btn-demo" onClick={fail}>Fail</button>
                    </li>
                    <li className="list-inline-item">
                        <button type="button" className="btn btn-demo">Remove</button>
                    </li>
                </ul>]}
            </div>
}


export default MotionDiv;