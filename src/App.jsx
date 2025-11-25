import React, { useState, useRef } from 'react';
import { Music, ChevronRight, ChevronLeft, Search, List, Clock, Filter, Info } from 'lucide-react';
import GenreCard from './components/GenreCard';
import { musicData } from './data/musicData';

const App = () => {
    const [selectedYear, setSelectedYear] = useState(1960);
    const [viewMode, setViewMode] = useState('timeline');
    const [searchTerm, setSearchTerm] = useState('');
    const scrollRef = useRef(null);

    const years = Object.keys(musicData).map(Number).sort((a, b) => a - b);

    const allGenresList = Object.values(musicData)
        .flat()
        .sort((a, b) => a.genre.localeCompare(b.genre));

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

    const filteredGenres = allGenresList.filter(item =>
        item.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-neutral-200 font-sans selection:bg-purple-500 selection:text-white pb-12">
            <header className="bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg shadow-purple-500/20">
                            <Music className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-500 cursor-pointer" onClick={() => setViewMode('timeline')}>
                            音樂時光機
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
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
                                    <span className="hidden md:inline group-hover:text-white">百科列表</span>
                                </>
                            ) : (
                                <>
                                    <Clock size={18} className="group-hover:text-purple-400 transition-colors" />
                                    <span className="hidden md:inline group-hover:text-white">返回時間軸</span>
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
                                探索 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{selectedYear}</span> 年
                            </h2>
                            <p className="text-neutral-400 text-lg">
                                那一年，全世界都在聽什麼？
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
                            {musicData[selectedYear].map((item, index) => (
                                <GenreCard key={index} item={item} />
                            ))}
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
                                    placeholder="搜尋流派、關鍵字..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-5 py-3 rounded-full bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pl-12 transition-all shadow-lg"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6 text-neutral-500 text-sm px-2">
                            <span>共找到 {filteredGenres.length} 個類別</span>
                            <div className="flex items-center gap-2">
                                <Filter size={14} />
                                <span>排序：A-Z</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredGenres.length > 0 ? (
                                filteredGenres.map((item, index) => (
                                    <GenreCard key={index} item={item} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-neutral-500">
                                    <p className="text-xl">找不到相關結果</p>
                                    <button onClick={() => setSearchTerm('')} className="mt-4 text-purple-400 hover:text-purple-300">
                                        清除搜尋
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
                            ? "點擊藝人可前往 Google 搜尋。點擊卡片右上角的圖示可查看衍生類別，點擊類別亦可進行搜尋。"
                            : "此為音樂百科視圖，匯總了所有時間軸上的音樂流派資料。"}
                        本資料庫包含主流與非主流（如爵士、地下音樂）類別。
                    </p>
                </div>
            </main>

            <footer className="text-center py-8 text-neutral-500 text-sm font-medium tracking-wider opacity-60 hover:opacity-100 transition-opacity">
                CREATED BY VIBE QUIRK LABS
            </footer>
        </div>
    );
};

export default App;
