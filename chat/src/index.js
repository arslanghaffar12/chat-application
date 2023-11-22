import React from 'react';
import ReactDOM from 'react-dom'; // Corrected import
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import 'bootstrap/dist/css/bootstrap.css';

console.log("store===",store)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
      <App />
  </Provider>
);

reportWebVitals();
