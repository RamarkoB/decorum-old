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
      return <div className="card delegate absent" onClick={updateAttendence}><p>{props.name}</p></div>
    } else {
      return <div className="card delegate" onClick={updateAttendence}><p>{props.name}</p></div>
    }
}

function MotionDiv() {
    return <div className="card motion"><p>{props.motion}</p></div>
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
                    <div className={props.spoken == "yes"? "card speaker spoken" : "card speaker"}>
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

    return [<div className="side col-8 scroll">{delegates}</div>, 
            <div className="side col-4">
                <p>There are {numPresent} Delegates</p>
                <p>A Simple Majority requires {Math.round(numPresent * 1/2)} Delegates</p>
                <p>A 2/3 Majority requires {Math.round(numPresent * 2/3)} Delegates</p>
            </div>]
}

function UnmodPage() {
    return <TimerDiv />
}

function ModPage() {
    const speakers = state.getSpeakers().map((speaker, index) =>
        <SpeakerDiv spoken={speaker.hasSpoken() ? "yes" : "no"} name={state.getSpeaker(index)} index={index} key={index}/>
    );

    return [<div id="speakersList" className="side col-4 scroll">
                {speakers}
            </div>,
            <div id="modMain" className="side col-8">
                <TimerDiv />
            </div>]
}

function DirectivesPage() {
    return [<div id="directivesList" className="side col-4 scroll"></div>,
            <div id="directivesList" className="side col-8"></div>];
}

function MotionsPage() {
    const motions = state.getSpeakers().map((speaker, index) =>
        <SpeakerDiv spoken={speaker.hasSpoken() ? "yes" : "no"} name={state.getSpeaker(index)} index={index} key={index}/>
    );

    return [<div id="motionsList" className="side col-4 scroll"></div>,
            <div id="motionsMain" className="side col-8"></div>]
}


//Main Components
function App(){
    switch (state.page) {
        case Page.delegates:
            return <DelegatePage />
        case Page.unmod:
            return <UnmodPage />
        case Page.mod:
            return <ModPage />
        case Page.directives:
            return <DirectivesPage />
        case Page.motions:
            return <MotionsPage />
    }
}

function Footer() {
    function parse(){
        switch (state.page) {
            case Page.delegates:
                return "Delegates"
            case Page.unmod:
                return "Unmoderated Caucus"
            case Page.mod:
                return "Moderated Caucus"
            case Page.directives:
                return "Directives"
            case Page.motions:
                return "Motions"
        }
    }
    
    const motionsDropdown = state.getOtherPages()
        .map(page =>  <a className="dropdown-item text-center text-uppercase" onClick={() => state.toPage(page)} key={page}>{page}</a>)

    return  <div id="footerDiv" className="dropdown">
                <a href="#" data-bs-toggle="dropdown"><h1 className="header-txt fw-bold text-uppercase">{parse()}</h1></a>
                <div className="dropdown-menu">
                    {motionsDropdown}
                </div>
            </div>
}