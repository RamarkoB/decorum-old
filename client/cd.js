let socket = io();
let el;


let delegates = [];
let speakersList = [];
socket.on("delegateInit", (dels) => {
  delegates = dels.map((del) => new Delegate(del.name));
});

socket.on("")
socket.on("delegateUpdate", (dels) => {
  delegates = dels.map((del) => new Delegate(del.name, del.attendence));
  speakersList = new SpeakersList(delegates.map((del) => new Speaker(del)));
});


const root = ReactDOM.createRoot(document.getElementById('sidebar')); 

function SpeakerDiv(props) {
  function speak(){
    speakersList.list[props.index].speak();
  }

  if (props.spoken){
    return <div className="card speaker spoken" onClick={speak}><p>{props.name}</p></div>
  } else {
    return <div className="card speaker" onClick={speak}><p>{props.name}</p></div>
  }
}

function tick(){
  const listItems = speakersList.list.map((del, index) =>
  <SpeakerDiv spoken={del.spoken} name={del.delegate.name} index={index} key={index}/>
  );
  root.render(listItems);
}

setInterval(tick, 100);