import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HeaderComponent from './components/Header/Header';

import isLoggedIn from './libs/AuthCheck';

import ConfirmSignup from './pages/ConfirmSignup/ConfirmSignup';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Home from './pages/Home/Home';
import Briefings from './pages/Briefings/Briefings';
import Attendances from './pages/Attendances/Attendances';
import Attendance from './pages/Attendance/Attendance';
import AttendancePresentation from './pages/AttendancePresentation/AttendancePresentation';
import Register from './pages/Register/Register';
import MyPrints from './pages/MyPrints/MyPrints';
import Orders from './pages/Orders/Orders';

function App() {
  return (
    <>
      <Router>
        {!window.location.pathname.includes('/signup') &&
          !window.location.pathname.includes('/reset_password') &&
          !isLoggedIn() && <Redirect to="/login" />}
        <Switch>
          <Route path="/briefings">
            <HeaderComponent />
            <Briefings />
          </Route>
          <Route path="/attendances/:attendanceId/presentations/:id">
            <HeaderComponent />
            <AttendancePresentation />
          </Route>
          <Route path="/attendances/:id">
            <HeaderComponent />
            <Attendance />
          </Route>
          <Route path="/attendances">
            <HeaderComponent />
            <Attendances />
          </Route>
          <Route path="/orders">
            <HeaderComponent />
            <Orders />
          </Route>
          <Route path="/signup/:token?">
            <ConfirmSignup />
          </Route>
          <Route path="/login/">
            <Login />
          </Route>
          <Route path="/reset_password/:forgotToken?">
            <ForgotPassword />
          </Route>
          <Route path="/register/">
            <HeaderComponent />
            <Register />
          </Route>
          <Route path="/my-prints/">
            <HeaderComponent />
            <MyPrints />
          </Route>
          <Route path="/">
            <HeaderComponent />
            <Home />
          </Route>
        </Switch>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
