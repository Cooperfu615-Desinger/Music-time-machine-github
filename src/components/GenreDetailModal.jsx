
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, ExternalLink, Search, User } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import MusicBars from './MusicBars';
import { Play, Pause } from 'lucide-react';

// Placeholder Component (Duplicated from GenreCard for self-containment, or could be exported)
const GenreImagePlaceholder = ({ name, id, showText = true }) => {
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hues = [
        'from-purple-600 to-blue-600', 'from-pink-600 to-rose-600', 'from-emerald-600 to-teal-600',
        'from-orange-600 to-amber-600', 'from-indigo-600 to-violet-600', 'from-cyan-600 to-blue-600'
    ];
    const gradient = hues[sum % hues.length];
    const initials = name.substring(0, 2).toUpperCase();

    return (
        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            {showText && <span className="text-6xl font-black text-white/20 select-none">{initials}</span>}
        </div>
    );
};

const getArtistImage = (artistName) => {
    const encodedName = encodeURIComponent(artistName);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128&bold=true`;
};

const GenreDetailModal = ({ genre, isOpen, onClose }) => {
    const { t, i18n } = useTranslation();
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });

    // Parallax logic
    const handleMouseMove = (e) => {
        if (!isOpen) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setOffset({ x: x * 20, y: y * 20 }); // Stronger effect for modal
    };

    const handleMouseLeave = () => {
        setOffset({ x: 0, y: 0 });
    };

    // Music Logic
    const getMusicUrl = () => {
        if (genre?.audioPath) {
            return `${import.meta.env.BASE_URL}${genre.audioPath.substring(1)}`;
        }
        return null;
    };
    const { isPlaying, toggle } = useMusicPlayer(getMusicUrl());

    // Prevent scrolling on body when modal is open
    // Prevent scrolling on body when modal is open and stop music on close
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Fix #2: Stop music when modal closes
            stop();
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, stop]);

    if (!isOpen || !genre) return null;

    const name = genre?.name?.[i18n.language] || genre?.name?.['zh-TW'] || "Unknown Genre";
    const desc = genre?.desc?.[i18n.language] || genre?.desc?.['zh-TW'] || "No description available.";

    const getGoogleSearchUrl = (query, type = "artist") => {
        const suffix = type === "genre" ? " music genre" : " music artist";
        return `https://www.google.com/search?q=${encodeURIComponent(query + suffix)}`;
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-in">

                {/* Hero Image */}
                <div
                    className="w-full h-48 sm:h-64 relative bg-neutral-900 flex-shrink-0 overflow-hidden"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >

                    {/* 1. Image / Placeholder Layer (z-0 default) */}
                    {genre?.imagePath ? (
                        <>
                            <img
                                src={`${import.meta.env.BASE_URL}${genre.imagePath.substring(1)}`}
                                alt={name}
                                className="w-full h-full object-cover relative z-0"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div style={{ display: 'none' }} className="w-full h-full relative z-0">
                                <GenreImagePlaceholder name={name} id={genre?.id || 'unknown'} showText={false} />
                            </div>
                        </>
                    ) : (
                        <div className="relative w-full h-full z-0">
                            <GenreImagePlaceholder name={name} id={genre?.id || 'unknown'} showText={false} />
                        </div>
                    )}

                    {/* 2. Gradient Overlay (z-0: Background layer to dim image) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-black/30 z-0"></div>

                    {/* 3. Watermark Typography (z-5: On top of overlay, Middle layer) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-[5] overflow-hidden">
                        <span
                            className="text-[120px] sm:text-[150px] font-black text-white opacity-[0.08] leading-none whitespace-nowrap uppercase tracking-tighter inline-block transition-transform duration-100 ease-out"
                            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
                        >
                            {name}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10 backdrop-blur-sm"
                    >
                        <X size={24} />
                    </button>

                    <div className="absolute bottom-4 left-6 z-10 flex items-center gap-4">
                        <h2 className="text-3xl sm:text-4xl font-black text-white leading-none shadow-black drop-shadow-lg">{name}</h2>
                        {genre?.audioPath && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggle}
                                    className="p-2 rounded-full bg-white/10 hover:bg-purple-500 text-white backdrop-blur-md transition-all border border-white/20"
                                >
                                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                </button>
                                {isPlaying && <MusicBars isPlaying={true} color="bg-purple-400" />}
                            </div>
                        )}
                    </div>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar relative z-10">

                    {/* Description */}
                    <div className="prose prose-invert max-w-none mb-8">
                        <p className="text-neutral-300 text-lg leading-relaxed whitespace-pre-wrap">
                            {desc}
                        </p>
                    </div>

                    {/* Artists */}
                    {genre?.artists && genre.artists.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User size={16} />
                                {t('card.representative_artists')}
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {genre.artists.map((artist, idx) => (
                                    <a
                                        key={idx}
                                        href={getGoogleSearchUrl(artist, "artist")}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-2 rounded-lg bg-neutral-800 border border-white/5 hover:bg-neutral-700 hover:border-purple-500/50 transition-all duration-200 group"
                                    >
                                        <img
                                            src={getArtistImage(artist)}
                                            alt={artist}
                                            className="w-8 h-8 rounded-full object-cover border border-neutral-600 group-hover:border-purple-400 transition-colors shrink-0"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist)}&background=334155&color=94a3b8`;
                                            }}
                                        />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm text-neutral-300 group-hover:text-white font-medium truncate">{artist}</span>
                                        </div>
                                        <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-purple-400 shrink-0" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - External Links (Data Driven in future, currently static/google fallback) */}
                <div className="p-6 border-t border-white/5 bg-neutral-900/50 flex justify-between items-center relative z-10">
                    <span className="text-sm text-neutral-500">{t('footer_text')}</span>
                    <a
                        href={getGoogleSearchUrl(name, "genre")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                    >
                        {t('google_search')} <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default GenreDetailModal;
