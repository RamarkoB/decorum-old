let socket = io();
let el;
let state;

const speakers = ReactDOM.createRoot(document.getElementById('speakers')); 
const modMain = ReactDOM.createRoot(document.getElementById('modMain')); 
const unmodMain = ReactDOM.createRoot(document.getElementById('unmodMain')); 

function tick(){
  const listItems = state.getDelegates().map((del, index) =>
    <SpeakerDiv attendence={del.attendence} name={del.name} index={index} key={index}/>
  );

  speakers.render(listItems);
  modMain.render(<TimerDiv section="mod"/>);
  unmodMain.render(<TimerDiv section="unmod"/>);
}

setInterval(tick, 100);