let socket = io();
let el;
let state;

const app = ReactDOM.createRoot(document.getElementById('root')); 
const footer = ReactDOM.createRoot(document.getElementById('footer')); 

function tick(){
  app.render(<App />)
  footer.render(<Footer />);
}

setInterval(tick, 100);