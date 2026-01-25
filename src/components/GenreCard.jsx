import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Users, Search, GitBranch, X, BookOpen } from 'lucide-react';
import { NavigationContext } from '../App';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

const getArtistImage = (artistName) => {
    const encodedName = encodeURIComponent(artistName);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128&bold=true`;
};

const getGoogleSearchUrl = (query, type = "artist") => {
    const suffix = type === "genre" ? " music genre" : " music artist";
    return `https://www.google.com/search?q=${encodeURIComponent(query + suffix)}`;
};

const GenreImagePlaceholder = ({ name, id }) => {
    // Generate a deterministic gradient based on ID char sum
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hues = [
        'from-purple-600 to-blue-600',
        'from-pink-600 to-rose-600',
        'from-emerald-600 to-teal-600',
        'from-orange-600 to-amber-600',
        'from-indigo-600 to-violet-600',
        'from-cyan-600 to-blue-600'
    ];
    const gradient = hues[sum % hues.length];

    // Get initials (up to 2 chars)
    const initials = name.substring(0, 2).toUpperCase();

    return (
        <div className={`w-full h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-4xl font-black text-white/20 select-none">
                {initials}
            </span>
        </div>
    );
};

const GenreCard = ({ item, isAudioAvailable = false, isHighlighted = false }) => {
    const { t, i18n } = useTranslation();
    const { jumpToGenre, openModal } = useContext(NavigationContext);
    const [showSubGenres, setShowSubGenres] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Music Logic
    const getMusicUrl = () => {
        if (item.audioPath) {
            return `${import.meta.env.BASE_URL}${item.audioPath.substring(1)}`;
        }
        return null;
    };
    const { isPlaying, toggle } = useMusicPlayer(getMusicUrl());


    // Get localized contents
    const name = item.name[i18n.language] || item.name['zh-TW'];
    const desc = item.desc[i18n.language] || item.desc['zh-TW'];

    // Handlers
    const handleSubGenreClick = (e, sub) => {
        e.preventDefault();
        jumpToGenre(sub.trim());
    };

    return (
        <div
            id={`genre-card-${item.id}`}
            className={`
                bg-neutral-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 
                hover:border-purple-500/50 transition-all duration-300 
                hover:shadow-2xl hover:shadow-purple-500/10 group flex flex-col relative h-full
                ${isHighlighted ? 'animate-highlight' : ''}
            `}
        >
            <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 absolute top-0 left-0 right-0 z-10"></div>

            {/* Image Section */}
            <div className="w-full h-40 overflow-hidden relative bg-neutral-900">
                {item.imagePath && !imageError ? (
                    <img
                        src={`${import.meta.env.BASE_URL}${item.imagePath.substring(1)}`}
                        alt={name}
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={() => setImageError(true)}
                    />
                ) : null}

                {/* Fallback Placeholder if image missing or error */}
                {(!item.imagePath || imageError) && (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <GenreImagePlaceholder name={name} id={item.id} />
                    </div>
                )}

                {/* Overlay Text Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent"></div>
            </div>

            <div className="p-6 flex-1 flex flex-col -mt-10 relative z-0">
                <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={isAudioAvailable ? toggle : undefined}
                            disabled={!isAudioAvailable}
                            className={`p-2 rounded-lg transition-colors duration-300 shrink-0 ${isAudioAvailable
                                ? "bg-neutral-800/50 text-purple-400 group-hover:text-white group-hover:bg-purple-500 cursor-pointer"
                                : "bg-slate-700 text-neutral-500 opacity-50 cursor-not-allowed"
                                }`}
                            title={!isAudioAvailable ? t('card.no_audio') : isPlaying ? t('card.pause') : t('card.play')}
                        >
                            {isPlaying ? (
                                <Pause size={20} fill="currentColor" />
                            ) : (
                                <Play size={20} fill="currentColor" />
                            )}
                        </button>
                        <h3 className="text-xl font-bold text-white leading-tight">
                            {name}
                        </h3>
                    </div>
                </div>

                <div className="relative flex-1">
                    <div className={`transition-opacity duration-300 ${showSubGenres ? 'opacity-10 invisible' : 'opacity-100 visible'}`}>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6 line-clamp-2">
                            {desc}
                        </p>
                        <button
                            onClick={() => openModal(item)}
                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mb-4 -mt-2 group/read"
                        >
                            <BookOpen size={12} />
                            {t('read_more') || "Read More..."}  {/* Fallback if key missing */}
                        </button>

                        <div className="mt-auto">
                            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                <Users size={14} />
                                <span>{t('card.representative_artists')}</span>
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
                            {t('card.sub_genres')}
                        </h4>
                        <div className="flex flex-wrap justify-center gap-2">
                            {item.subGenreIds && item.subGenreIds.map((sub, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    onClick={(e) => handleSubGenreClick(e, sub)}
                                    className="px-3 py-1.5 bg-purple-500/20 text-purple-200 rounded-full text-sm border border-purple-500/30 hover:bg-purple-500 hover:text-white hover:border-purple-400 transition-all cursor-pointer flex items-center gap-1 group/chip"
                                    title={`跳轉至 ${sub}`}
                                >
                                    {sub}
                                    {/* <Search size={10} className="opacity-0 group-hover/chip:opacity-100 transition-opacity" /> */}
                                </a>
                            ))}
                            {!item.subGenreIds && <span className="text-neutral-500 text-sm">{t('card.no_data')}</span>}
                        </div>
                        <button
                            onClick={() => setShowSubGenres(false)}
                            className="mt-6 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {!showSubGenres && item.subGenreIds && (
                    <button
                        onClick={() => setShowSubGenres(true)}
                        className="absolute top-6 right-6 p-2 text-neutral-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-full transition-all"
                        title={t('card.sub_genres')}
                    >
                        <GitBranch size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default GenreCard;
