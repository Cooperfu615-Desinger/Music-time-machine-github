import React, { useState, useRef } from 'react';
import { Music, ChevronRight, ChevronLeft, Search, List, Clock, Filter, Info } from 'lucide-react';
import GenreCard from './components/GenreCard';
import timelineData from './data/timeline.json';
import genresData from './data/genres.json';
import GenreDetailModal from './components/GenreDetailModal';
import './core/i18n';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

// Create Context for navigation
export const NavigationContext = React.createContext({
    jumpToGenre: () => { }
});


const App = () => {
    const { t, i18n } = useTranslation();
    const [selectedYear, setSelectedYear] = useState(1960);
    const [viewMode, setViewMode] = useState('timeline');
    const [searchTerm, setSearchTerm] = useState('');
    const [audioAvailability, setAudioAvailability] = useState({});

    // Modal State
    const [selectedGenreForModal, setSelectedGenreForModal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Animation State
    const [highlightedId, setHighlightedId] = useState(null);

    const scrollRef = useRef(null);

    // Dynamic SEO
    React.useEffect(() => {
        const titles = {
            'zh-TW': '音樂時光機 | 探索流行音樂的演變',
            'zh-CN': '音乐时光机 | 探索流行音乐的演变',
            'en': 'Music Time Machine | Explore the Evolution of Pop Music',
            'ja': '音楽タイムマシン | ポップミュージックの進化を探る'
        };
        document.title = titles[i18n.language] || titles['en'];
    }, [i18n.language]);

    // Handle highlighted animation timeout
    React.useEffect(() => {
        if (highlightedId) {
            const timer = setTimeout(() => {
                setHighlightedId(null);
            }, 2000); // 2 seconds highlight
            return () => clearTimeout(timer);
        }
    }, [highlightedId]);

    // Global audio availability check
    React.useEffect(() => {
        const checkAllAudio = async () => {
            const availability = {};
            // We check only genres that have an audioPath defined
            const checks = Object.values(genresData).map(async (genre) => {
                if (genre.audioPath) {
                    try {
                        const url = `${import.meta.env.BASE_URL}${genre.audioPath.substring(1)}`; // remove leading slash
                        const response = await fetch(url, { method: 'HEAD' });
                        if (response.ok) {
                            availability[genre.id] = true;
                        }
                    } catch (e) {
                        // ignore error
                    }
                }
            });
            await Promise.all(checks);
            setAudioAvailability(availability);
        };
        checkAllAudio();
    }, []);

    const years = Object.keys(timelineData).map(Number).sort((a, b) => a - b);

    // Navigation Logic
    const jumpToGenre = (genreId) => {
        const cleanInput = genreId ? genreId.trim() : "";
        if (!cleanInput) return;

        // Normalize to strictly match ID format (lowercase, spaces to dashes, remove specials)
        // e.g. "Post-Disco / Dance-Pop" -> "post-disco-dance-pop"
        const id = cleanInput.toLowerCase().replace(/ \/ /g, '-').replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

        let foundYear = null;
        for (const year of years) {
            if (timelineData[year].includes(id)) {
                foundYear = year;
                break;
            }
        }

        if (foundYear) {
            // Case A: Main Genre on Timeline
            setViewMode('timeline');
            setSelectedYear(foundYear);

            // Wait for render then scroll and highlight
            setTimeout(() => {
                const element = document.getElementById(`genre-card-${id}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    setHighlightedId(id);
                }
            }, 100);

        } else {
            // Case B/C: Sub Genre / Hidden
            const genre = genresData[id];
            if (genre) {
                setSelectedGenreForModal(genre);
                setIsModalOpen(true);
            } else {
                console.warn(`Genre not found: ${id} (Original: ${cleanInput}) - Fallback to Search`);
                // STRICT FALLBACK: Do NOT open modal, just search
                window.open(`https://www.google.com/search?q=${encodeURIComponent(cleanInput + " music genre")}`, '_blank');
            }
        }
    };

    const allGenresList = Object.values(genresData)
        .sort((a, b) => {
            const nameA = a.name[i18n.language] || a.name['zh-TW'];
            const nameB = b.name[i18n.language] || b.name['zh-TW'];
            return nameA.localeCompare(nameB);
        });

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 200;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const filteredGenres = allGenresList.filter(item => {
        const name = item.name[i18n.language] || item.name['zh-TW'];
        const desc = item.desc[i18n.language] || item.desc['zh-TW'];
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            desc.toLowerCase().includes(searchTerm.toLowerCase());
    });


    const navigationContextValue = React.useMemo(() => ({
        jumpToGenre,
        openModal: (genre) => { setSelectedGenreForModal(genre); setIsModalOpen(true); }
    }), [jumpToGenre]);

    return (
        <NavigationContext.Provider value={navigationContextValue}>
            <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-neutral-200 font-sans selection:bg-purple-500 selection:text-white pb-12">
                <header className="bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg shadow-purple-500/20">
                                <Music className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-500 cursor-pointer" onClick={() => setViewMode('timeline')}>
                                {t('app_title')}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Language Switcher */}
                            <div className="relative group/lang">
                                <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                                    <Globe size={20} />
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-32 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-xl opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-300 z-50">
                                    <button onClick={() => i18n.changeLanguage('zh-TW')} className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:bg-white/10 hover:text-white transition-colors">繁體中文</button>
                                    <button onClick={() => i18n.changeLanguage('zh-CN')} className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:bg-white/10 hover:text-white transition-colors">简体中文</button>
                                    <button onClick={() => i18n.changeLanguage('en')} className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:bg-white/10 hover:text-white transition-colors">English</button>
                                    <button onClick={() => i18n.changeLanguage('ja')} className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:bg-white/10 hover:text-white transition-colors">日本語</button>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setViewMode(viewMode === 'timeline' ? 'list' : 'timeline');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-neutral-800/50 hover:bg-neutral-800 border border-white/10 rounded-full text-sm font-medium transition-all duration-300 hover:border-purple-500 group"
                            >
                                {viewMode === 'timeline' ? (
                                    <>
                                        <List size={18} className="group-hover:text-purple-400 transition-colors" />
                                        <span className="hidden md:inline group-hover:text-white">{t('view_list')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Clock size={18} className="group-hover:text-purple-400 transition-colors" />
                                        <span className="hidden md:inline group-hover:text-white">{t('view_timeline')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 mt-8">
                    {viewMode === 'timeline' ? (
                        <>
                            <div className="text-center mb-10 animate-fade-in">
                                <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">
                                    {t('explore_year')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{selectedYear}</span>
                                </h2>
                                <p className="text-neutral-400 text-lg">
                                    {t('explore_desc')}
                                </p>
                            </div>

                            <div className="relative mb-12 group animate-fade-in-up">
                                <button
                                    onClick={() => scroll('left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-neutral-800 rounded-full shadow-lg border border-white/10 text-white hover:bg-neutral-700 transition-colors hidden md:block opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronLeft size={24} />
                                </button>

                                <div
                                    ref={scrollRef}
                                    className="flex overflow-x-auto gap-3 py-4 px-2 scrollbar-hide snap-x"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {years.map((year) => (
                                        <button
                                            key={year}
                                            onClick={() => handleYearChange(year)}
                                            className={`
                        snap-center flex-shrink-0 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform
                        ${selectedYear === year
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-110 shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/50'
                                                    : 'bg-neutral-900 text-neutral-500 hover:bg-neutral-800 hover:text-white'}
                        `}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => scroll('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-neutral-800 rounded-full shadow-lg border border-white/10 text-white hover:bg-neutral-700 transition-colors hidden md:block opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-fade-in-up delay-100">
                                {timelineData[selectedYear].map((genreId, index) => {
                                    const item = genresData[genreId];
                                    return item ? <GenreCard key={index} item={item} isAudioAvailable={audioAvailability[genreId]} isHighlighted={highlightedId === genreId} /> : null;
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                                    音樂流派百科
                                </h2>
                                <div className="max-w-xl mx-auto relative">
                                    <input
                                        type="text"
                                        placeholder={t('search_placeholder')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-5 py-3 rounded-full bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pl-12 transition-all shadow-lg"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6 text-neutral-500 text-sm px-2">
                                <span>{t('found_results', { count: filteredGenres.length })}</span>
                                <div className="flex items-center gap-2">
                                    <Filter size={14} />
                                    <span>{t('sort_az')}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredGenres.length > 0 ? (
                                    filteredGenres.map((item, index) => (
                                        <GenreCard key={index} item={item} isAudioAvailable={audioAvailability[item.id]} isHighlighted={highlightedId === item.id} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20 text-neutral-500">
                                        <p className="text-xl">{t('no_results')}</p>
                                        <button onClick={() => setSearchTerm('')} className="mt-4 text-purple-400 hover:text-purple-300">
                                            {t('clear_search')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-12 p-4 rounded-xl bg-neutral-900/30 border border-white/5 flex gap-3 items-start text-sm text-neutral-500">
                        <Info size={18} className="mt-0.5 flex-shrink-0 text-purple-400" />
                        <p>
                            {viewMode === 'timeline'
                                ? t('info_timeline')
                                : t('info_list')}
                            {t('info_suffix')}
                        </p>
                    </div>
                </main>

                <footer className="text-center py-8 text-neutral-500 text-sm font-medium tracking-wider opacity-60 hover:opacity-100 transition-opacity">
                    {t('footer_text')}
                </footer>

                <GenreDetailModal
                    genre={selectedGenreForModal}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </NavigationContext.Provider>
    );
};

export default App;
