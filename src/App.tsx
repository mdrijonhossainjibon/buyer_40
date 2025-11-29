import { CountdownTimer } from "components/CountdownTimer";
import LoadingOverlay from "components/LoadingOverlay";
import { RootState } from "modules";
import React, { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from 'components/Header'
import HomePage from "page/home";
import WithdrawHistoryPopup from "page/WithdrawHistory";
import { toggleConverterPopup, togglePurchaseTicketsPopup, toggleReferralPopup, toggleSpinPopup, toggleTasksPopup, toggleWalletPopup, toggleWatchAdsPopup } from "modules/ui";
import FullScreenPopup from "components/common/FullScreenPopup";
import ReferralPage from "page/Referral";
import WatchAdsPage from "page/ads";
import WalletPage from "page/Wallet";
import SpinWheelPage from "page/SpinWheel";
import TasksPage from "page/Tasks";
import CoinConverterPage from "page/sawp";
import PurchaseTicketsPage from "page/PurchaseTickets";
import Navigation from "components/Navigation";
 
 

const App: React.FC = () => {
  const dispatch = useDispatch();
  const ui = useSelector((state: RootState) => state.ui);

   useLayoutEffect(() => {
    // Check if document element has dark class and sync with state
    const hasDarkClass = document.documentElement.classList.contains('dark')

    if (hasDarkClass) {
      document.documentElement.setAttribute('data-prefers-color-scheme', 'dark')
    }
    else {
      document.documentElement.setAttribute('data-prefers-color-scheme', 'light')
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <LoadingOverlay>
          <div id="app" className={`max-w-[500px] mx-auto transition-opacity duration-300 bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl min-h-screen'}`}>
            <Header />
            <main id="main-content" className="px-4 pt-4 pb-20 bg-gray-50 dark:bg-gray-900">
              <FullScreenPopup visible={ui.showReferralPopup} title='Referral Program' onClose={() => dispatch(toggleReferralPopup(false))} children={<ReferralPage />} />
              <FullScreenPopup visible={ui.showSpinPopup} title='Spin Wheel' onClose={() => dispatch(toggleSpinPopup(false))} children={<SpinWheelPage />} />
              <FullScreenPopup visible={ui.showTasksPopup} title='Tasks' onClose={() => dispatch(toggleTasksPopup(false))} children={<TasksPage />} />
              <FullScreenPopup visible={ui.showPurchaseTicketsPopup} title='Purchase Spin Tickets' onClose={() => dispatch(togglePurchaseTicketsPopup(false))} children={<PurchaseTicketsPage />} />
              <FullScreenPopup visible={ui.showWatchAdsPopup} title='Watch Ads' onClose={() => dispatch(toggleWatchAdsPopup(false))} children={<WatchAdsPage />} />
              <FullScreenPopup visible={ui.showConverterPopup} title='Converter Popup' onClose={() => dispatch(toggleConverterPopup(false))} children={<CoinConverterPage />} />
              <FullScreenPopup visible={ui.showWalletPopup} title='Wallet' onClose={() => dispatch(toggleWalletPopup(false))} children={<WalletPage />} />
              <WithdrawHistoryPopup />
               <WithdrawHistoryPopup />
              <HomePage />
            </main>
             <Navigation />
          </div>
        </LoadingOverlay>
      </div>
    </>
  )
};

export default App;

