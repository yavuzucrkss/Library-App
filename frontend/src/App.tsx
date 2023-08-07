import React from 'react';
import './App.css';
import { Navbar } from './layouts/Navbar&Footer/Navbar';
import { Footer } from './layouts/Navbar&Footer/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { SearchBookPage } from './layouts/SearchBookPage/SearchBookPage';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';


const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {
  const navigate = useNavigate();

  const customAuthHandler = () => {
    navigate('/login');
  };

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
        <Navbar />
        <div className='flex-grow-1'>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/search" element={<SearchBookPage />} />
            <Route path='/checkout/:bookId' element={<BookCheckoutPage />} />
            <Route path='/login' element={<LoginWidget config={oktaConfig} />} />
            <Route path='/login/callback' Component={LoginCallback} />
          </Routes>
        </div>
        <Footer />
      </Security>
    </div >
  );
};








