import state from "./state"
import { Page } from "./structs"
import {DelegatePage, UnmodPage, ModPage, DirectivesPage, MotionsPage} from "./components"


//Main Components
function App(){
  switch (state.page) {
      case Page.delegates: return <DelegatePage />
      case Page.unmod: return <UnmodPage />
      case Page.mod: return <ModPage />
      case Page.directives: return <DirectivesPage />
      case Page.motions: return <MotionsPage />
  }
}

function Footer() {
  function parse(){
      switch (state.page) {
          case Page.delegates: return "Delegates"
          case Page.unmod: return "Unmoderated Caucus"
          case Page.mod: return "Moderated Caucus"
          case Page.directives: return "Directives"
          case Page.motions: return "Motions"
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

export {App, Footer};
