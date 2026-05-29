import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const withAutoLogout = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const [hasLoggedOut, setHasLoggedOut] = useState(false);
    const logoutTime = 60000;
    const warningTime = logoutTime / 2;
    const timersRef = useRef({ warningTimer: null, logoutTimer: null });

    const clearTimers = useCallback(() => {
      clearTimeout(timersRef.current.warningTimer);
      clearTimeout(timersRef.current.logoutTimer);
    }, []);

    const logout = useCallback(() => {
      setHasLoggedOut((alreadyLoggedOut) => {
        if (!alreadyLoggedOut) {
          window.alert('Due to inactivity and security reasons, your account has been logged out.');
          navigate('/');
        }

        return true;
      });
    }, [navigate]);

    const resetTimer = useCallback(() => {
      clearTimers();

      if (hasLoggedOut) return;

      timersRef.current.warningTimer = setTimeout(() => {
        const continueSession = window.confirm(
          'Your session will expire soon due to inactivity. Do you want to stay logged in?'
        );

        if (continueSession) {
          resetTimer();
        } else {
          logout();
        }
      }, warningTime);

      timersRef.current.logoutTimer = setTimeout(logout, logoutTime);
    }, [clearTimers, hasLoggedOut, logout, warningTime, logoutTime]);

    useEffect(() => {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);
      resetTimer();

      return () => {
        clearTimers();
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keypress', resetTimer);
      };
    }, [clearTimers, resetTimer]);

    return <WrappedComponent {...props} />;
  };
};

export default withAutoLogout;
