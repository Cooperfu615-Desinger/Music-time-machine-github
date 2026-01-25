
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, ExternalLink, Search, User } from 'lucide-react';
import { createPortal } from 'react-dom';

// Placeholder Component (Duplicated from GenreCard for self-containment, or could be exported)
const GenreImagePlaceholder = ({ name, id }) => {
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hues = [
        'from-purple-600 to-blue-600', 'from-pink-600 to-rose-600', 'from-emerald-600 to-teal-600',
        'from-orange-600 to-amber-600', 'from-indigo-600 to-violet-600', 'from-cyan-600 to-blue-600'
    ];
    const gradient = hues[sum % hues.length];
    const initials = name.substring(0, 2).toUpperCase();

    return (
        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-6xl font-black text-white/20 select-none">{initials}</span>
        </div>
    );
};

const GenreDetailModal = ({ genre, isOpen, onClose }) => {
    const { t, i18n } = useTranslation();

    if (!isOpen || !genre) return null;

    const name = genre?.name?.[i18n.language] || genre?.name?.['zh-TW'] || "Unknown Genre";
    const desc = genre?.desc?.[i18n.language] || genre?.desc?.['zh-TW'] || "No description available.";

    // Prevent scrolling on body when modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

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
                <div className="w-full h-48 sm:h-64 relative bg-neutral-900 flex-shrink-0">
                    {genre?.imagePath ? (
                        <>
                            <img
                                src={`${import.meta.env.BASE_URL}${genre.imagePath.substring(1)}`}
                                alt={name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div style={{ display: 'none' }} className="w-full h-full">
                                <GenreImagePlaceholder name={name} id={genre?.id || 'unknown'} />
                            </div>
                        </>
                    ) : (
                        <GenreImagePlaceholder name={name} id={genre?.id || 'unknown'} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-black/30"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-20 backdrop-blur-sm"
                    >
                        <X size={24} />
                    </button>

                    <div className="absolute bottom-4 left-6 z-10">
                        <span className="text-xs font-mono text-purple-300 bg-purple-500/20 px-2 py-1 rounded backdrop-blur-sm border border-purple-500/20 mb-2 inline-block">
                            ID: {genre?.id || "N/A"}
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white leading-none shadow-black drop-shadow-lg">{name}</h2>
                    </div>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar">

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
                            <div className="flex flex-wrap gap-3">
                                {genre.artists.map((artist, idx) => (
                                    <a
                                        key={idx}
                                        href={getGoogleSearchUrl(artist, "artist")}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 border border-white/5 hover:bg-neutral-700 hover:border-purple-500/50 transition-all duration-200 group"
                                    >
                                        <span className="text-neutral-300 group-hover:text-white">{artist}</span>
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - External Links (Data Driven in future, currently static/google fallback) */}
                <div className="p-6 border-t border-white/5 bg-neutral-900/50 flex justify-between items-center">
                    <span className="text-sm text-neutral-500">{t('footer_text')}</span>
                    <a
                        href={getGoogleSearchUrl(name, "genre")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                    >
                        Google Search <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default GenreDetailModal;
