
import { useState, useEffect, useRef, useCallback } from 'react';

// Global audio state to ensure only one plays at a time
let currentAudio = null;

export const useMusicPlayer = (audioUrl) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const isPlayingRef = useRef(isPlaying);

    // Keep ref in sync with state to avoid stale closure in event listeners
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // Initialize/Update Audio Object
    useEffect(() => {
        if (audioUrl) {
            // Cleanup previous if exists in this ref scope (though usually ref persists)
            if (audioRef.current) {
                audioRef.current.pause();
                if (currentAudio === audioRef.current) {
                    currentAudio = null;
                }
            }

            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            // Event Listeners
            const handleEnded = () => {
                setIsPlaying(false);
                if (currentAudio === audio) currentAudio = null;
            };
            const handleError = (e) => {
                console.error("Audio load/play error:", e);

                // Provide user-friendly feedback for different error types
                if (e.type === 'error' && audio.error) {
                    const errorCode = audio.error.code;
                    if (errorCode === 4) {
                        console.warn(`⚠️ Audio file not found (404): ${audioUrl}`);
                        // Dispatch custom event for UI notification
                        window.dispatchEvent(new CustomEvent('audio-load-failed', {
                            detail: { url: audioUrl, message: 'Audio file not found' }
                        }));
                    } else {
                        console.error(`❌ Audio error code ${errorCode}:`, audio.error.message);
                    }
                }

                setIsPlaying(false);
                if (currentAudio === audio) currentAudio = null;
            };

            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('error', handleError);

            return () => {
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('error', handleError);
                // On unmount/change:
                // We typically stop the music if the component is unmounted or url changes
                audio.pause();
                if (currentAudio === audio) {
                    currentAudio = null;
                }
            };
        } else {
            audioRef.current = null;
        }
    }, [audioUrl]);

    // Global Stop Listener: Update UI if some other player started
    useEffect(() => {
        const onGlobalStop = (e) => {
            // If another player started, stop this one
            if (audioRef.current && currentAudio !== audioRef.current) {
                // Always pause and update state, regardless of current paused state
                // (audio may already be paused by the new player's play() function)
                audioRef.current.pause();
                setIsPlaying(false);
            }
        };

        window.addEventListener('music-stop-all', onGlobalStop);
        return () => window.removeEventListener('music-stop-all', onGlobalStop);
    }, []); // No dependencies - we use refs and currentAudio global

    const play = useCallback(() => {
        if (!audioRef.current) return;

        // 1. Stop global current audio if it's not us
        if (currentAudio && currentAudio !== audioRef.current) {
            currentAudio.pause();
            currentAudio = null; // Clear BEFORE dispatching event
            // Notify others - they will now see currentAudio !== their audioRef
            window.dispatchEvent(new CustomEvent('music-stop-all'));
        }

        // 2. Play us with comprehensive error handling
        audioRef.current.play()
            .then(() => {
                currentAudio = audioRef.current;
                setIsPlaying(true);
            })
            .catch(e => {
                console.error("Play failed:", e);
                setIsPlaying(false); // CRITICAL: Reset UI state on error

                // Distinguish error types for better debugging and user feedback
                if (e.name === 'NotAllowedError') {
                    console.warn('⚠️ Autoplay blocked - user interaction required');
                } else if (e.name === 'NotSupportedError') {
                    console.error('❌ Audio format not supported');
                    window.dispatchEvent(new CustomEvent('audio-play-failed', {
                        detail: { url: audioRef.current?.src, message: 'Audio format not supported' }
                    }));
                } else {
                    console.error('❌ Unknown playback error:', e.message);
                }
            });

    }, []);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        if (currentAudio === audioRef.current) {
            currentAudio = null;
        }
        setIsPlaying(false);
    }, []);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (currentAudio === audioRef.current) {
            currentAudio = null;
        }
        setIsPlaying(false);
    }, []);

    const toggle = useCallback((e) => {
        if (e) e.stopPropagation();
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    return { isPlaying, toggle, stop };
};
