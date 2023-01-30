import { state, setState } from "./state/state"
import { Page } from "./state/structs"
import { DelegatePage, UnmodPage, SpeakersPage, DirectivesPage, MotionsPage, VotingPage } from "./components/components"
import { Motions } from "./state/motions";
import "bootstrap-icons/font/bootstrap-icons.css";
import committees from "./state/committees";


function CommDiv(props) {
  return  <div className="col-4">
            <div className="card committee" onClick={() => setState(props.comm)}>
              <h3>{props.comm}</h3>
            </div>
          </div>
}


function StatePage() {
  let commNames = Object.keys(committees);
  const comms = [];

  while (commNames.length >= 3) {
    comms.push(commNames.splice(0, 3));
  }

  if (commNames.length > 0) {
    comms.push(commNames);
  }

  const commDivs = comms.map((commRow, index) => {
    switch(commRow.length) {
      case 1: return  <div className="row" key={"row" + index}>
                        <CommDiv comm={commRow[0]} key= {commRow[0]} />
                        <div className="col-8"></div>
                      </div>
      case 2: return  <div className="row" key={"row" + index}>
            <CommDiv comm={commRow[0]} key= {commRow[0]} />
            <CommDiv comm={commRow[1]} key= {commRow[1]} />
          </div>

      default: return  <div className="row" key={"row" + index}>
      <CommDiv comm={commRow[0]} key= {commRow[0]} />
      <CommDiv comm={commRow[1]} key= {commRow[1]} />
      <CommDiv comm={commRow[2]} key= {commRow[2]} />
    </div>
    }
  })


  return  <div className="side">
            {commDivs}
          </div>
}


//Main Components
function App(){
  if (state) {
    switch (state.page) {
      case Page.delegates: return <DelegatePage />
      case Page.unmod: return <UnmodPage />
      case Page.speakers:  switch(state.currentMotion.type) {
        case Motions.Voting: return <VotingPage />
        default: return <SpeakersPage />
      }
      case Page.directives: return <DirectivesPage />
      case Page.motions: return <MotionsPage />

      // no default
    }
  } else {
    return <StatePage />
  }
}

function Footer() {
  if (state) {
    function parse(){
      switch (state.page) {
          case Page.delegates: return "Delegates"
          case Page.unmod: return "Unmoderated Caucus"
          case Page.speakers: return "Speakers"
          case Page.directives: return "Directives"
          case Page.motions: return "Motions"

          // no default
      }
  }
  
  const motionsDropdown = state.getOtherPages()
      .map(page =>  <button className="dropdown-item text-center text-uppercase" onClick={() => state.toPage(page)} key={page}>{page}</button>)

  return  <div id="footerDiv" className="dropdown">
              <button data-bs-toggle="dropdown">
                <h1 className="header-txt fw-bold text-uppercase">
                    {parse()}
                    <i className="bi bi-chevron-up"></i>
                </h1>
            </button>
              <div className="dropdown-menu">
                  {motionsDropdown}
              </div>
          </div>
  } else {
    return  <div id="footerDiv">
              <h1 className="header-txt fw-bold text-uppercase">
                  Committees
              </h1>
            </div>

  }
}

export {App, Footer};