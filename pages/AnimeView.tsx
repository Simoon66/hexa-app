
import React, { useState, useEffect } from 'react';
import { Anime, Season, Episode, WatchProgress } from '../types';
import { ICONS, THEME_COLOR } from '../constants';

interface AnimeViewProps {
  anime: Anime;
  seasons: Season[];
  episodes: Episode[];
  progress: WatchProgress | null;
  preferredLang: string;
  onUpdateProgress: (progress: WatchProgress) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  isAdmin: boolean;
}

const AnimeView: React.FC<AnimeViewProps> = ({ 
  anime, seasons, episodes, progress, preferredLang, onUpdateProgress, onToggleFavorite, isFavorite, isAdmin 
}) => {
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [activeLang, setActiveLang] = useState<'sub' | 'eng' | 'multi'>('sub');
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);

  useEffect(() => {
    const defaultLang = (progress?.language || preferredLang || 'sub') as 'sub' | 'eng' | 'multi';
    setActiveLang(defaultLang);

    if (progress) {
      const s = seasons.find(s => s.id === progress.seasonId);
      const e = episodes.find(e => e.id === progress.episodeId);
      if (s) setActiveSeason(s);
      if (e) setActiveEpisode(e);
    } else if (seasons.length > 0) {
      const sortedSeasons = [...seasons].sort((a,b) => a.seasonNumber - b.seasonNumber);
      const firstSeason = sortedSeasons[0];
      setActiveSeason(firstSeason);
      const firstEp = episodes
        .filter(e => e.seasonId === firstSeason.id)
        .sort((a,b) => a.episodeNumber - b.episodeNumber)[0];
      if (firstEp) setActiveEpisode(firstEp);
    }
  }, [anime.id]);

  const handleEpisodeSelect = (episode: Episode) => {
    setActiveEpisode(episode);
    onUpdateProgress({
      animeId: anime.id,
      seasonId: episode.seasonId,
      episodeId: episode.id,
      language: activeLang
    });
  };

  const handleLangChange = (lang: 'sub' | 'eng' | 'multi') => {
    setActiveLang(lang);
    if (activeEpisode) {
      onUpdateProgress({
        animeId: anime.id,
        seasonId: activeEpisode.seasonId,
        episodeId: activeEpisode.id,
        language: lang
      });
    }
  };

  const currentSeasonEpisodes = activeSeason 
    ? episodes.filter(e => e.seasonId === activeSeason.id).sort((a, b) => a.episodeNumber - b.episodeNumber)
    : [];

  const renderPlayer = () => {
    if (!activeEpisode) return null;
    
    let videoUrl = "";
    const megaplayId = activeEpisode.links.megaplayId;
    
    if (activeLang === 'sub' && megaplayId) {
      videoUrl = `https://megaplay.buzz/stream/s-2/${megaplayId}/sub`;
    } else if (activeLang === 'eng' && megaplayId) {
      videoUrl = `https://megaplay.buzz/stream/s-2/${megaplayId}/dub`;
    } else if (activeLang === 'multi') {
      videoUrl = activeEpisode.links.multi || "";
    }

    if (!videoUrl) return (
      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-950/80">
        <ICONS.X className="w-16 h-16 mb-6 opacity-20" />
        <p className="font-black uppercase tracking-[0.3em] text-[10px]">Server Not Available</p>
      </div>
    );

    return (
      <div className="w-full h-full bg-black relative">
        <iframe 
          src={videoUrl} 
          width="100%" 
          height="100%" 
          frameborder="0" 
          scrolling="no" 
          allowfullscreen 
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 h-[800px] overflow-hidden">
        <img src={anime.cover} className="w-full h-full object-cover opacity-10 blur-3xl scale-150" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/90 to-[#050505]" />
      </div>

      <div className="relative px-4 md:px-12 lg:px-20 pt-8 max-w-[1700px] mx-auto space-y-12 pb-24">
        {/* PLAYER SECTION */}
        <div className="bg-black aspect-video rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,1)] border border-white/5">
          {renderPlayer()}
        </div>

        {/* CONTROLS & SEASONS */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6 w-full md:w-auto">
              {/* Premium Season Selector */}
              <div className="relative">
                <select 
                  className="w-full sm:w-auto bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4 font-luxury font-bold focus:outline-none appearance-none pr-12 text-lg gold-glow transition-all hover:border-[#ffde95]/40"
                  value={activeSeason?.id}
                  onChange={(e) => setActiveSeason(seasons.find(s => s.id === e.target.value) || null)}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffde95' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                >
                  {seasons.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              {/* Server Switchers */}
              <div className="flex bg-zinc-950/80 rounded-2xl p-1.5 border border-white/5 shadow-2xl backdrop-blur-3xl">
                {['sub', 'eng', 'multi'].map(lang => {
                  const available = lang === 'multi' ? !!activeEpisode?.links.multi : !!activeEpisode?.links.megaplayId;
                  return (
                    <button 
                      key={lang}
                      onClick={() => handleLangChange(lang as any)}
                      disabled={!available}
                      className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeLang === lang ? 'text-black shadow-xl gold-glow' : available ? 'text-zinc-600 hover:text-white' : 'text-zinc-900 cursor-not-allowed opacity-20'}`}
                      style={{ backgroundColor: activeLang === lang ? THEME_COLOR : undefined }}
                    >
                      {lang === 'sub' && <ICONS.Sub className="w-4 h-4" />}
                      {lang === 'eng' && <ICONS.Mic className="w-4 h-4" />}
                      {lang === 'multi' && <ICONS.Translate className="w-4 h-4" />}
                      {lang === 'multi' ? 'Multi' : lang}
                    </button>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={() => onToggleFavorite(anime.id)}
              className={`flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 rounded-2xl border font-black transition-all active:scale-95 text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] ${isFavorite ? 'gold-glow' : 'border-white/5 text-zinc-500 hover:bg-white/5'}`}
              style={{ backgroundColor: isFavorite ? THEME_COLOR : 'transparent', color: isFavorite ? '#000' : undefined, borderColor: isFavorite ? THEME_COLOR : undefined }}
            >
              <ICONS.Heart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
              {isFavorite ? 'Saved' : 'Watchlist'}
            </button>
          </div>

          {/* Episode Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-14 gap-3">
            {currentSeasonEpisodes.map(ep => (
              <button 
                key={ep.id}
                onClick={() => handleEpisodeSelect(ep)}
                className={`relative aspect-square rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl border transition-all duration-300 ${activeEpisode?.id === ep.id ? 'text-black scale-105 shadow-xl z-10' : 'bg-zinc-950/40 border-white/5 text-zinc-700 hover:border-[#ffde95]/40 hover:text-white hover:bg-zinc-900'}`}
                style={{ backgroundColor: activeEpisode?.id === ep.id ? THEME_COLOR : undefined, borderColor: activeEpisode?.id === ep.id ? THEME_COLOR : undefined }}
              >
                {ep.episodeNumber}
                {ep.isFiller && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-zinc-900 text-[6px] px-2 py-0.5 rounded-sm font-black text-orange-500 border border-white/5 uppercase tracking-tighter whitespace-nowrap z-20">Filler</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* INFO CARD - TABLET OPTIMIZED */}
        <div className="bg-zinc-950/40 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[4rem] border border-white/5 p-8 md:p-12 lg:p-20 flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24 shadow-2xl">
          <div className="w-full md:w-[280px] lg:w-[400px] flex-none">
            <img src={anime.poster} className="w-full rounded-[2rem] lg:rounded-[3.5rem] shadow-2xl border border-white/5" />
          </div>
          <div className="flex-1 space-y-8 lg:space-y-12">
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-luxury font-black mb-4 leading-tight tracking-tighter uppercase italic">{anime.title}</h1>
              <p className="text-zinc-600 text-sm md:text-lg font-black uppercase tracking-[0.3em] opacity-40">{anime.jpTitle}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-4">
              {anime.genres.map(g => (
                <span key={g} className="bg-zinc-900/90 text-zinc-400 border border-white/5 px-4 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">{g}</span>
              ))}
            </div>

            <div className="relative">
              <p className={`text-zinc-500 leading-relaxed text-sm md:text-lg lg:text-2xl font-medium ${!isSynopsisExpanded ? 'line-clamp-3 md:line-clamp-4' : ''}`}>
                {anime.synopsis}
              </p>
              <button 
                onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                className="mt-4 md:mt-8 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 transition-all"
                style={{ color: THEME_COLOR }}
              >
                {isSynopsisExpanded ? 'Close' : 'Read Story'}
                <span className={`text-xl transition-transform ${isSynopsisExpanded ? 'rotate-180' : ''}`}>↓</span>
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 pt-10 border-t border-white/5 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black">
              <div><p className="text-zinc-700 mb-2">Released</p><p className="text-white text-sm md:text-base italic">{anime.aired}</p></div>
              <div><p className="text-zinc-700 mb-2">Length</p><p className="text-white text-sm md:text-base italic">{anime.duration}</p></div>
              <div><p className="text-zinc-700 mb-2">Score</p><p className="text-xl md:text-2xl gold-text-glow" style={{ color: THEME_COLOR }}>★ {anime.malScore}</p></div>
              <div><p className="text-zinc-700 mb-2">Format</p><p className="text-white text-sm md:text-base italic">{anime.format}</p></div>
              <div><p className="text-zinc-700 mb-2">Studio</p><p className="text-white text-sm md:text-base italic">{anime.studios}</p></div>
              <div><p className="text-zinc-700 mb-2">Status</p><p className="text-white text-sm md:text-base italic">{anime.status}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeView;
