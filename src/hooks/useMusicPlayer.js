
import { useState, useEffect, useRef, useCallback } from 'react';

// Global audio state to ensure only one plays at a time
let currentAudio = null;

export const useMusicPlayer = (audioUrl) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

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
                console.error("Audio error:", e);
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
            // If the event Detail ID is NOT us, or generic stop...
            // Simplest: if we are supposed to be playing, but global currentAudio is NOT us, then we must stop.
            if (audioRef.current && currentAudio !== audioRef.current && isPlaying) {
                setIsPlaying(false);
                // Note: audioRef.current.pause() is typically called by the *starter* of the new track, 
                // or we can ensure it here.
                audioRef.current.pause();
            }
        };

        window.addEventListener('music-stop-all', onGlobalStop);
        return () => window.removeEventListener('music-stop-all', onGlobalStop);
    }, [isPlaying]); // Re-bind if state changes, or ok to bind once? Bind once is fine if we use refs. 
    // Actually safe to remove dep if we check refs.

    const play = useCallback(() => {
        if (!audioRef.current) return;

        // 1. Stop global current audio if it's not us
        if (currentAudio && currentAudio !== audioRef.current) {
            currentAudio.pause();
            // Notify others
            window.dispatchEvent(new CustomEvent('music-stop-all'));
        }

        // 2. Play us
        audioRef.current.play()
            .then(() => {
                currentAudio = audioRef.current;
                setIsPlaying(true);
            })
            .catch(e => console.error("Play failed", e));

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
