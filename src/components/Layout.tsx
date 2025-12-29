import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
    const location = useLocation();
    // Hide bottom nav on login/register/onboarding pages
    const hideNav = ['/', '/login', '/register', '/onboarding'].includes(location.pathname);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden'
        }}>
            <main style={{
                flex: 1,
                overflowY: 'auto',
                paddingBottom: hideNav ? '0' : '70px',
                backgroundColor: 'var(--bg-color)'
            }}>
                <Outlet />
            </main>

            {!hideNav && <BottomNav />}
        </div>
    );
};

export default Layout;
