import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const withAutoLogout = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();
        const [hasLoggedOut, setHasLoggedOut] = useState(false);
        const logoutTime = 60000; //300000 / 60000
        const warningTime = logoutTime / 2; 

        const logout = useCallback(() => {
            if (!hasLoggedOut) {
                setHasLoggedOut(true);
                window.alert('Due to inactivity and security reasons, your account has been logged out.');
                navigate('/'); 
            }
        }, [hasLoggedOut, navigate]);

        const showWarning = useCallback(() => {
            if (!hasLoggedOut) {
                const continueSession = window.confirm('Your session will expire soon due to inactivity. Do you want to stay logged in?');
                if (continueSession) {
                    resetTimer();
                } else {
                    logout();
                }
            }
        }, [hasLoggedOut, logout]);

        const resetTimer = useCallback(() => {
            if (hasLoggedOut) return; 

            clearTimeout(window.logoutTimer);
            clearTimeout(window.warningTimer);

            window.warningTimer = setTimeout(showWarning, warningTime); 
            window.logoutTimer = setTimeout(logout, logoutTime); 
        }, [showWarning, logout, warningTime, logoutTime, hasLoggedOut]);

        useEffect(() => {
            window.addEventListener('mousemove', resetTimer);
            window.addEventListener('keypress', resetTimer);
            resetTimer(); 

            return () => {
                clearTimeout(window.logoutTimer);
                clearTimeout(window.warningTimer);
                window.removeEventListener('mousemove', resetTimer);
                window.removeEventListener('keypress', resetTimer);
            };
        }, [resetTimer]);

        return <WrappedComponent {...props} />;
    };
};

export default withAutoLogout;
