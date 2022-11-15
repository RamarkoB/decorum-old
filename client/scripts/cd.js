let socket = io();
let el;
let state;

// const root = ReactDOM.createRoot(document.getElementById('root')); 
const rollCall = ReactDOM.createRoot(document.getElementById('rollCall')); 
const quorum = ReactDOM.createRoot(document.getElementById('quorum')); 
const motionsList = ReactDOM.createRoot(document.getElementById('motionsList')); 
const speakers = ReactDOM.createRoot(document.getElementById('speakers')); 
const modMain = ReactDOM.createRoot(document.getElementById('modMain')); 
const unmodMain = ReactDOM.createRoot(document.getElementById('unmodMain')); 
const footer = ReactDOM.createRoot(document.getElementById('footer')); 

function tick(){
  const listItems = state.getDelegates().map((del, index) =>
    <DelegateDiv attendence={del.attendence} name={del.name} index={index} key={index}/>
  );

  const motions = Object.values(Motion).map((motion) => {
    <MotionDiv attendence={Attendence.Present} name={motion} />
  })

  // console.log(motions);

  rollCall.render(listItems);
  quorum.render(<QuorumDiv />)
  speakers.render(listItems);
  motionsList.render(motions);
  modMain.render(<TimerDiv section="mod"/>);
  unmodMain.render(<TimerDiv section="unmod"/>);
  footer.render(<Footer page={state.page} />);
    // root.render(<MainDiv page={Page.mod}/>);
}

setInterval(tick, 100);