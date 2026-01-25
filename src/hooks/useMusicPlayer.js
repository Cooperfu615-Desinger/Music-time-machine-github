
import { useState, useEffect, useRef, useCallback } from 'react';

// Global audio state to ensure only one plays at a time
let currentAudio = null;

export const useMusicPlayer = (audioUrl) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
    }, []);

    const play = useCallback(() => {
        if (!audioUrl) return;

        // Stop global current if exists
        if (currentAudio && currentAudio !== audioRef.current) {
            // We can dispatch event or access directly if we had global store.
            // Dispatching event is safer for decoupled components.
            window.dispatchEvent(new CustomEvent('music-stop-all'));
        }

        if (!audioRef.current) {
            audioRef.current = new Audio(audioUrl);
            audioRef.current.onended = () => {
                setIsPlaying(false);
                currentAudio = null;
            };
            audioRef.current.onerror = () => {
                console.error(`Playback error for ${audioUrl}`);
                setIsPlaying(false);
                currentAudio = null;
            };
        }

        audioRef.current.play().catch(e => {
            console.error("Playback failed:", e);
            setIsPlaying(false);
        });

        currentAudio = audioRef.current;
        setIsPlaying(true);
    }, [audioUrl]);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
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

    // Cleanup and listen for stop-all
    useEffect(() => {
        const handleStopAll = () => {
            // If WE are the current player, we don't stop ourselves unless logic demands (e.g. starting another)
            // But here 'music-stop-all' means "Everyone else stop".
            // Wait, usually stop-all is called BEFORE starting new one.
            // If we are NOT the one being started, we should stop.
            // Simplified: If global event fires, and we are playing, we pause.

            // Actually, let's keep it simple: simpler logic in hook.
            if (audioRef.current && audioRef.current !== currentAudio) {
                // This means we are NOT the global current audio, so we should be stopped.
                setIsPlaying(false);
                // Audio pause is handled by whoever started new one or global reset?
                // No, if we are just a component, we need to update our state.
            }
        };

        // This is a bit tricky with just local state and global variable.
        // Let's stick to the trusted event pattern from Phase 1 but encapsulated.
        const onStopEvent = () => {
            // If we are playing, check if we are still the intended global audio?
            // Or just stop everything.
            // If I triggered the stop, I set isPlaying=true immediately after.
            // So this event is for "Others".

            // If audioRef.current is NOT the global currentAudio, we pause.
            if (audioRef.current && currentAudio !== audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        };

        window.addEventListener('music-stop-all', onStopEvent);
        return () => {
            window.removeEventListener('music-stop-all', onStopEvent);
            // On unmount, if we are playing, should we stop?
            // Often yes for a card component.
            if (audioRef.current && isPlaying) {
                audioRef.current.pause();
                if (currentAudio === audioRef.current) {
                    currentAudio = null;
                }
            }
        };
    }, [isPlaying]);

    return { isPlaying, toggle, stop };
};
