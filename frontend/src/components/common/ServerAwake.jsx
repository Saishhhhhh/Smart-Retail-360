import React, { useState, useEffect } from 'react';
import { Loader, Server, Coffee, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const ServerAwake = ({ children }) => {
    const [isAwake, setIsAwake] = useState(false);
    const [checkCount, setCheckCount] = useState(0);
    const [error, setError] = useState(false);

    useEffect(() => {
        checkServerStatus();
    }, []);

    const checkServerStatus = async () => {
        try {
            // Try to hit the root endpoint or a lightweight health check
            const response = await fetch(`${API_BASE_URL}/`);
            if (response.ok) {
                setIsAwake(true);
            } else {
                // If 503 or other error, retry
                scheduleRetry();
            }
        } catch (err) {
            // Network error (server likely down/sleeping)
            scheduleRetry();
        }
    };

    const scheduleRetry = () => {
        // Retry every 3 seconds
        if (checkCount < 40) { // Stop after ~2 minutes
            setTimeout(() => {
                setCheckCount(prev => prev + 1);
                checkServerStatus();
            }, 3000);
        } else {
            setError(true);
        }
    };

    if (isAwake) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4 text-white">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl text-center">

                {!error ? (
                    <>
                        <div className="relative mb-6 mx-auto w-20 h-20">
                            <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-purple-500 to-pink-600 rounded-full shadow-lg">
                                <Server size={32} className="text-white animate-pulse" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Waking up the AI Brain...</h2>

                        <p className="text-purple-200 mb-6 text-sm leading-relaxed">
                            We are using a <span className="font-semibold text-white">free instance on Render</span>.
                            The server sleeps when inactive to save resources.
                        </p>

                        <div className="bg-black/30 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3 text-left mb-2">
                                <Loader size={18} className="animate-spin text-purple-400" />
                                <span className="text-sm font-medium">Starting FastAPI Backend...</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(checkCount * 2.5, 95)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 text-center">
                                Estimated wait: ~{Math.max(50 - (checkCount * 3), 0)} seconds left
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs text-purple-300 bg-purple-500/10 py-2 rounded-full">
                            <Coffee size={14} />
                            <span>Grab a quick coffee while it warms up! ☕</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-6 mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Server Connection Failed</h2>
                        <p className="text-gray-300 mb-6 text-sm">
                            We couldn't connect to the backend after several attempts. Please check if the deployment is active.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                        >
                            Retry Connection
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ServerAwake;
