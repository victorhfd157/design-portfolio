import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import MobileNavbar from './MobileNavbar';
import BackToTop from './BackToTop';
import CustomCursor from './CustomCursor';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const isGameRoute = location.pathname.startsWith('/game/');

    return (
        <div className="bg-brand-dark min-h-screen text-white selection:bg-brand-accent selection:text-white flex flex-col">
            {!isGameRoute && <Navbar />}
            {!isGameRoute && <MobileNavbar />}
            {!isGameRoute && <BackToTop />}

            <main className="flex-grow">
                {children}
            </main>

            {/* Cursor stays even in game, or maybe custom cursor for game? Game has its own cursor logic usually. */}
            {/* The game uses 'cursor-crosshair', so we might want to hide custom cursor there too */}
            {!isGameRoute && <CustomCursor />}
        </div>
    );
};

export default Layout;
