import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose }) => {
    return (
        <div className="fixed top-20 right-4 z-[200] animate-slide-in-right">
            <div className={`
                flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border
                ${type === 'error'
                    ? 'bg-red-900/90 border-red-500/50 text-red-100'
                    : 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100'}
                backdrop-blur-md min-w-[300px] max-w-md
            `}>
                <AlertCircle size={20} className="flex-shrink-0" />
                <p className="text-sm font-medium flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export const AudioErrorToast = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleAudioLoadFailed = (e) => {
            const { message } = e.detail;
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type: 'error' }]);

            // Auto dismiss after 5 seconds
            setTimeout(() => {
                setToasts(prev => prev.filter(toast => toast.id !== id));
            }, 5000);
        };

        const handleAudioPlayFailed = (e) => {
            const { message } = e.detail;
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type: 'error' }]);

            setTimeout(() => {
                setToasts(prev => prev.filter(toast => toast.id !== id));
            }, 5000);
        };

        window.addEventListener('audio-load-failed', handleAudioLoadFailed);
        window.addEventListener('audio-play-failed', handleAudioPlayFailed);

        return () => {
            window.removeEventListener('audio-load-failed', handleAudioLoadFailed);
            window.removeEventListener('audio-play-failed', handleAudioPlayFailed);
        };
    }, []);

    return (
        <div className="fixed top-0 right-0 z-[200] pointer-events-none">
            <div className="flex flex-col gap-2 p-4 pointer-events-auto">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    />
                ))}
            </div>
        </div>
    );
};

export default AudioErrorToast;
