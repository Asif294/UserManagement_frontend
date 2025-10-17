import React from 'react';
import Navber from '../navber';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <Navber></Navber>
            <Outlet></Outlet>
        </div>
    );
};

export default Layout;