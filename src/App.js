import state from "./state/state"
import { Page } from "./state/structs"
import { DelegatePage, UnmodPage, SpeakersPage, DirectivesPage, MotionsPage } from "./components/components"
import "bootstrap-icons/font/bootstrap-icons.css";


//Main Components
function App(){
  switch (state.page) {
      case Page.delegates: return <DelegatePage />
      case Page.unmod: return <UnmodPage />
      case Page.speakers: return <SpeakersPage />
      case Page.directives: return <DirectivesPage />
      case Page.motions: return <MotionsPage />

      // no default
  }
}

function Footer() {
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
      .map(page =>  <a className="dropdown-item text-center text-uppercase" onClick={() => state.toPage(page)} key={page}>{page}</a>)

  return  <div id="footerDiv" className="dropdown">
              <a data-bs-toggle="dropdown">
                <h1 className="header-txt fw-bold text-uppercase">
                    {parse()}
                    <i class="bi bi-chevron-up"></i>
                </h1>
            </a>
              <div className="dropdown-menu">
                  {motionsDropdown}
              </div>
          </div>
}

export {App, Footer};