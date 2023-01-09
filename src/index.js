import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Buffer } from 'buffer';
import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
const THEME = createTheme({
  typography: {
    fontFamily: "Spartan",
    fontSize: '16px',
  },
  status: {
    danger: 'red',
    success: 'green',
    warning: 'orange'
  },
  pallete: {
    darkBox: '#3a3d4d',
    lightBox: '#434658',
    lightBorder: '#606370',
    lightBlue: '#04a5c3',
    darkText: '#b3bfc9'
  }
});

global.Buffer = Buffer;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <ThemeProvider theme={THEME}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
