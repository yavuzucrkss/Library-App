import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';


const stripePromise = loadStripe('pk_test_51NeFFJLEOVdwwxkWm7Repbv9SlVQJEuT3FkIRfwNWO7XdjhIoY8TdY0TOPPb10ZtmCv7EVLWS45xVgZghcv64Z4s00MugWC5xa')

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </BrowserRouter>
);

