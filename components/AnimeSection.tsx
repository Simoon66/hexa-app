
import React from 'react';
import { Anime, Episode } from '../types';
import { ICONS, THEME_COLOR } from '../constants';

interface AnimeSectionProps {
  title: string;
  animes: Anime[];
  episodes: Episode[];
  onAnimeClick: (id: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const AnimeSection: React.FC<AnimeSectionProps> = ({ title, animes, episodes, onAnimeClick, favorites, onToggleFavorite }) => {
  if (animes.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8 px-8">
        <h2 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter italic">
          <span className="w-2 h-8 rounded-full shadow-[0_0_15px_#ffde95]" style={{ backgroundColor: THEME_COLOR }} />
          {title}
        </h2>
      </div>

      <div className="flex gap-6 px-8 overflow-x-auto pb-10 snap-x no-scrollbar">
        {animes.map(anime => {
          const animeEps = episodes.filter(e => e.animeId === anime.id);
          /* Updated counts to use existing properties in EpisodeLinks */
          const subCount = animeEps.filter(e => e.links.megaplayId).length;
          const engCount = subCount; // Since both sub and eng are derived from megaplayId in this app
          const multiCount = animeEps.filter(e => e.links.multi).length;

          return (
            <div 
              key={anime.id} 
              className="flex-none w-[170px] md:w-[230px] group cursor-pointer snap-start"
            >
              <div 
                className="relative aspect-[2/3] rounded-[1.8rem] overflow-hidden mb-4 border border-white/5 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                onClick={() => onAnimeClick(anime.id)}
              >
                <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                
                {/* Format Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 shadow-lg text-white">
                    {anime.format || 'TV'}
                  </span>
                </div>

                {/* Star Rating with shadow */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 shadow-2xl">
                  <ICONS.Star className="w-3.5 h-3.5 drop-shadow-[0_0_5px_rgba(0,0,0,1)]" style={{ color: THEME_COLOR }} />
                  <span className="text-[10px] font-black text-white drop-shadow-md">{anime.malScore}</span>
                </div>

                {/* Language/Server Indicators */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/40 to-transparent flex gap-1.5 items-center">
                   {subCount > 0 && (
                     <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black border border-white/10 text-white">
                       <ICONS.Sub className="w-3 h-3" /> {subCount}
                     </div>
                   )}
                   {engCount > 0 && (
                     <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black border border-white/10 text-white">
                       <ICONS.Mic className="w-3 h-3" /> {engCount}
                     </div>
                   )}
                   {multiCount > 0 && (
                     <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black border border-white/10 text-white">
                       <ICONS.Translate className="w-3 h-3" /> {multiCount}
                     </div>
                   )}
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-[#ffde95]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 bg-[#ffde95] text-black rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 shadow-[0_0_30px_#ffde95]">
                    <ICONS.Play className="w-7 h-7 ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-black text-sm md:text-base line-clamp-1 group-hover:text-[#ffde95] transition-colors uppercase tracking-tight">
                {anime.title}
              </h3>
              <div className="text-[10px] text-zinc-500 mt-1 uppercase font-black tracking-widest flex items-center gap-2">
                {anime.genres[0]} <span className="w-1 h-1 rounded-full bg-zinc-700" /> {anime.duration}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AnimeSection;
