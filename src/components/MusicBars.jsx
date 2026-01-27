import React from 'react';

const MusicBars = ({ isPlaying = false, color = "bg-purple-500" }) => {
    if (!isPlaying) return null;

    return (
        <div className="flex items-end gap-[2px] h-4 w-5">
            <div className={`w-1 rounded-t-sm animate-[music-bar-1_0.8s_ease-in-out_infinite] ${color}`}></div>
            <div className={`w-1 rounded-t-sm animate-[music-bar-2_0.9s_ease-in-out_infinite] ${color}`}></div>
            <div className={`w-1 rounded-t-sm animate-[music-bar-3_0.7s_ease-in-out_infinite] ${color}`}></div>
            <div className={`w-1 rounded-t-sm animate-[music-bar-4_1.0s_ease-in-out_infinite] ${color}`}></div>
        </div>
    );
};

export default MusicBars;
