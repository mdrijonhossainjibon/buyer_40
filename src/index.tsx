import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { unstableSetRender } from 'antd-mobile';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';
import AdsLoader from 'components/AdsLoader';

// Patch antd-mobile to work with React 18
unstableSetRender(
  (node: React.ReactNode, container: Element | DocumentFragment) => {
    // Attach a React root to the container if it doesn't exist yet
    if (!(container as any)._reactRoot) {
      (container as any)._reactRoot = createRoot(container as HTMLElement);
    }

    const root: Root = (container as any)._reactRoot;
    root.render(node);

    // Return cleanup function
    return async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      root.unmount();
    };
  }
);

// Get root container
const container = document.getElementById('root')!;
const root = createRoot(container);

// Render the app
root.render(
  <Provider store={store}>
     
    <AdsLoader>
      <App />
    </AdsLoader>
  </Provider>
);
