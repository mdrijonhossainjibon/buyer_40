import { CountdownTimer } from "components/CountdownTimer";
import LoadingOverlay from "components/LoadingOverlay";
import { RootState } from "modules";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from 'components/Header'
import HomePage from "page/home";
import WithdrawHistoryPopup from "page/WithdrawHistory";
 

const App: React.FC = () => {
  const dispatch = useDispatch();
  const ui = useSelector((state: RootState) => state.ui)

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <LoadingOverlay>
          <div id="app" className={`max-w-[500px] mx-auto transition-opacity duration-300 bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl min-h-screen'}`}>
            <Header />
            <main id="main-content" className="px-4 pt-4 pb-20 bg-gray-50 dark:bg-gray-900">
               <WithdrawHistoryPopup />
              <HomePage />
            </main>
          </div>
        </LoadingOverlay>
      </div>
    </>
  )
};

export default App;

