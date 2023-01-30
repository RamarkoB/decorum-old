import React, { useState } from 'react';
import { VoteModule, SpeakerDiv } from "./components"
import { state } from '../state/state';
import { Vote } from "../state/structs"

//Directive Div
function MakeDirectiveDiv() {
    const [name, setName] = useState("");

    function addDirective() {
        state.addDirective(name);
        setName("");
    }

    return  <div className="card mini motion">
                <p className="motion-input">
                    <input id="name-directive" placeholder="New Directive..." value={name} onChange={(e)=>setName(e.target.value)}/>
                </p>
                <button id="add-directive" className="btn" onClick={addDirective}>Add Directive</button>
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

    function updateName(name){
        props.dir.name = name;
    }

    return  <div className={statusClass()}>
                <h3><input placeholder="New Directive..." value={props.dir.name} onChange={(e)=>updateName(e.target.value)}/></h3>
                <VoteModule index={props.index} type={"directive"}/>
            </div>
}

function DirVoteSpeakDiv(props) {
    const speakers = props.dir.getSpeakers().map((speaker, index) => 
        <SpeakerDiv parent={props.dir} spoken={speaker.hasSpoken()} name={props.dir.getSpeaker(index)} index={index} key={index}/>
    );

    return  <div className='card mini'>
                <p>{props.dir.getName()}</p>
                {speakers}
            </div>
}

export { MakeDirectiveDiv, DirectiveDiv, DirVoteSpeakDiv };