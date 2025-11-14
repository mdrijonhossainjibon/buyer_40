import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { unstableSetRender } from 'antd-mobile';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';
import AdsLoader from 'components/AdsLoader';
import { Toaster } from 'react-hot-toast';
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
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        },
        loading: {
          iconTheme: {
            primary: '#8B5CF6',
            secondary: '#fff',
          },
        },
      }}
    />
  </Provider>
);
