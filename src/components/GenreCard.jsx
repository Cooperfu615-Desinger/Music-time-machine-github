import React, { useState, useEffect } from 'react';
import { Play, Pause, Users, Search, GitBranch, X } from 'lucide-react';

const getArtistImage = (artistName) => {
    const encodedName = encodeURIComponent(artistName);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128&bold=true`;
};

const getGoogleSearchUrl = (query, type = "artist") => {
    const suffix = type === "genre" ? " music genre" : " music artist";
    return `https://www.google.com/search?q=${encodeURIComponent(query + suffix)}`;
};

const GenreCard = ({ item }) => {
    const [showSubGenres, setShowSubGenres] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioAvailable, setIsAudioAvailable] = useState(false);

    // 計算音樂檔案路徑
    const getMusicUrl = () => {
        if (item.musicFile) {
            return `${import.meta.env.BASE_URL}music/${item.musicFile}`;
        }

        // 1. 提取英文 (Extract)
        const match = item.genre.match(/\(([^)]+)\)/);
        let englishName = match ? match[1] : item.genre;

        // 2. 格式化 (Format)
        const filename = englishName
            .toLowerCase()
            .replace(/&/g, 'n') // R&B -> rnb (User example: rnb_hip_hop_soul)
            .replace(/[/\-_ ]+/g, '_') // Replace / - _ space with single underscore
            .replace(/[^a-z0-9_]/g, '') // Remove non-alphanumeric except underscore
            .replace(/^_+|_+$/g, '') // Trim underscores
            + '.mp3';

        return `${import.meta.env.BASE_URL}music/${filename}`;
    };

    const audioUrl = getMusicUrl();

    // 檢查音訊檔案是否存在
    useEffect(() => {
        const checkAudioAvailability = async () => {
            try {
                const response = await fetch(audioUrl, { method: 'HEAD' });
                if (response.ok) {
                    setIsAudioAvailable(true);
                } else {
                    setIsAudioAvailable(false);
                }
            } catch (error) {
                console.error(`Error checking audio file: ${audioUrl}`, error);
                setIsAudioAvailable(false);
            }
        };

        checkAudioAvailability();
    }, [audioUrl]);

    // 監聽全域停止事件
    useEffect(() => {
        const handleStopAll = () => {
            setIsPlaying(false);
        };

        window.addEventListener('music-stop-all', handleStopAll);

        return () => {
            window.removeEventListener('music-stop-all', handleStopAll);
        };
    }, []);

    const togglePlay = (e) => {
        e.stopPropagation();

        if (!isAudioAvailable) return;

        if (isPlaying) {
            // 暫停目前播放
            if (window.currentAudio) {
                window.currentAudio.pause();
            }
            setIsPlaying(false);
        } else {
            // 步驟 A: 停止舊的
            if (window.currentAudio) {
                window.currentAudio.pause();
            }

            // 步驟 B: 廣播停止所有卡片
            window.dispatchEvent(new CustomEvent('music-stop-all'));

            // 步驟 C: 播放新的
            const audio = new Audio(audioUrl);
            window.currentAudio = audio;

            audio.onended = () => {
                setIsPlaying(false);
                window.currentAudio = null;
            };

            audio.onerror = () => {
                console.error(`Playback error for ${audioUrl}`);
                setIsPlaying(false);
                window.currentAudio = null;
            };

            audio.play().catch(error => {
                console.error("Playback failed:", error);
                setIsPlaying(false);
                window.currentAudio = null;
            });

            // 必須在廣播之後設定自己的狀態，否則會被廣播關掉
            setIsPlaying(true);
        }
    };

    return (
        <div
            className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 group flex flex-col relative h-full"
        >
            <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={isAudioAvailable ? togglePlay : undefined}
                            disabled={!isAudioAvailable}
                            className={`p-2 rounded-lg transition-colors duration-300 shrink-0 ${isAudioAvailable
                                ? "bg-neutral-800/50 text-purple-400 group-hover:text-white group-hover:bg-purple-500 cursor-pointer"
                                : "bg-slate-700 text-neutral-500 opacity-50 cursor-not-allowed"
                                }`}
                            title={!isAudioAvailable ? "暫無音樂" : isPlaying ? "暫停" : "播放"}
                        >
                            {isPlaying ? (
                                <Pause size={20} fill="currentColor" />
                            ) : (
                                <Play size={20} fill="currentColor" />
                            )}
                        </button>
                        <h3 className="text-xl font-bold text-white leading-tight">
                            {item.genre}
                        </h3>
                    </div>
                </div>

                <div className="relative flex-1">
                    <div className={`transition-opacity duration-300 ${showSubGenres ? 'opacity-10 invisible' : 'opacity-100 visible'}`}>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            {item.desc}
                        </p>

                        <div className="mt-auto">
                            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                <Users size={14} />
                                <span>代表藝人</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {item.artists.map((artist, idx) => (
                                    <a
                                        key={idx}
                                        href={getGoogleSearchUrl(artist, "artist")}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5 hover:bg-neutral-800 hover:border-purple-400/50 transition-all duration-200 group/artist cursor-pointer"
                                        title={`在 Google 搜尋 ${artist}`}
                                    >
                                        <img
                                            src={getArtistImage(artist)}
                                            alt={artist}
                                            className="w-8 h-8 rounded-full object-cover border border-neutral-700 group-hover/artist:border-purple-400 transition-colors shrink-0"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist)}&background=334155&color=94a3b8`;
                                            }}
                                        />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-xs md:text-sm text-neutral-300 group-hover/artist:text-white font-medium truncate">
                                                {artist}
                                            </span>
                                            <span className="text-[10px] text-neutral-500 flex items-center gap-1 opacity-0 group-hover/artist:opacity-100 transition-opacity">
                                                <Search size={8} /> Google
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div
                        className={`absolute inset-0 bg-neutral-900/95 backdrop-blur-sm rounded-xl flex flex-col justify-center items-center p-4 text-center transition-all duration-300 transform ${showSubGenres ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 -z-10'}`}
                    >
                        <h4 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                            <GitBranch size={20} />
                            衍生類別
                        </h4>
                        <div className="flex flex-wrap justify-center gap-2">
                            {item.subGenres && item.subGenres.map((sub, idx) => (
                                <a
                                    key={idx}
                                    href={getGoogleSearchUrl(sub, "genre")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-purple-500/20 text-purple-200 rounded-full text-sm border border-purple-500/30 hover:bg-purple-500 hover:text-white hover:border-purple-400 transition-all cursor-pointer flex items-center gap-1 group/chip"
                                    title={`在 Google 搜尋 ${sub}`}
                                >
                                    {sub}
                                    <Search size={10} className="opacity-0 group-hover/chip:opacity-100 transition-opacity" />
                                </a>
                            ))}
                            {!item.subGenres && <span className="text-neutral-500 text-sm">無資料</span>}
                        </div>
                        <button
                            onClick={() => setShowSubGenres(false)}
                            className="mt-6 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {!showSubGenres && item.subGenres && (
                    <button
                        onClick={() => setShowSubGenres(true)}
                        className="absolute top-6 right-6 p-2 text-neutral-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-full transition-all"
                        title="查看衍生類別"
                    >
                        <GitBranch size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default GenreCard;
