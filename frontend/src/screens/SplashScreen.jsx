
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/welcome');
        }, 2000); // 2 seconds splash screen

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-blue-500 text-white">
            <h1 className="text-4xl font-bold">Campus Suggestion Box</h1>
        </div>
    );
};

export default SplashScreen;
