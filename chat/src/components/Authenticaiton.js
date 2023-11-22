import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { useSelector } from 'react-redux';

const Authenticate = (props) => {
    // const user = { login: false };
    const user = useSelector(state => state.auth.user);
    console.log('user===',user);
    const location = useLocation()
    if (!user.login) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return props.children;
}

export default Authenticate;