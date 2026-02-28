import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
    children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);

    useEffect(() => {
        if (displayLocation.pathname !== location.pathname) {
            setDisplayLocation(location);
        }
    }, [location, displayLocation.pathname]);

    // Each page already has animate-enter classes, so we just provide
    // a simple wrapper. The key forces React to treat each route as new
    return (
        <div
            key={displayLocation.pathname}
            className="page-content"
            style={{
                width: '100%',
                minHeight: '100%',
            }}
        >
            {children}
        </div>
    );
};

export default PageTransition;
