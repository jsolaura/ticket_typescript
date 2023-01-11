import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from "react-redux";
import store from "reducers/store";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router } from "react-router-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
const persistor = persistStore(store);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <CookiesProvider>
                <Router>
                    <App />
                </Router>
            </CookiesProvider>
        </PersistGate>
    </Provider>
);