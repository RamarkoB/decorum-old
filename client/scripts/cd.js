let socket = io();
let el;
let state;

// const root = ReactDOM.createRoot(document.getElementById('root')); 
const delegatesList = ReactDOM.createRoot(document.getElementById('delegatesList')); 
const quorum = ReactDOM.createRoot(document.getElementById('quorum')); 
const motionsList = ReactDOM.createRoot(document.getElementById('motionsList')); 
const speakersList = ReactDOM.createRoot(document.getElementById('speakersList')); 
const modMain = ReactDOM.createRoot(document.getElementById('modMain')); 
const unmodMain = ReactDOM.createRoot(document.getElementById('unmodMain')); 
const footer = ReactDOM.createRoot(document.getElementById('footer')); 

function tick(){
  //delegates tab
  const delegates = state.getDelegates().map((del, index) =>
    <DelegateDiv attendence={del.attendence} name={del.name} index={index} key={index}/>
  );
  delegatesList.render(delegates);
  quorum.render(<QuorumDiv />)

  const speakers = state.getSpeakers().map((speaker, index) =>
    <SpeakerDiv spoken={speaker.hasSpoken() ? "yes" : "no"} name={state.getSpeaker(index)} index={index} key={index}/>
  );
  speakersList.render(speakers);
  modMain.render(<TimerDiv section="mod"/>);

  //unmod tab
  unmodMain.render(<TimerDiv section="unmod"/>);

  //footer
  footer.render(<FooterDiv page={state.page}/>);
    // root.render(<MainDiv page={Page.mod}/>);
}

setInterval(tick, 100);