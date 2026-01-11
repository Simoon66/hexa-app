
import React, { useState, useEffect } from 'react';
import { Anime, SliderItem } from '../types';
import { ICONS, THEME_COLOR } from '../constants';

interface HeroSliderProps {
  slides: SliderItem[];
  animes: Anime[];
  onWatchNow: (animeId: string) => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides, animes, onWatchNow }) => {
  const [current, setCurrent] = useState(0);

  const activeSlides = slides
    .map(s => animes.find(a => a.id === s.animeId))
    .filter((a): a is Anime => !!a);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % activeSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const currentAnime = activeSlides[current];

  return (
    <div className="relative px-6 py-8">
      <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5">
        <div 
          key={currentAnime.id}
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
        >
          <img 
            src={currentAnime.cover} 
            alt={currentAnime.title} 
            className="w-full h-full object-cover scale-105 animate-[kenburns_30s_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-5xl">
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10 shadow-lg" style={{ color: THEME_COLOR }}>{currentAnime.format}</span>
              <div className="flex items-center gap-1.5 text-zinc-200 text-sm font-black drop-shadow-xl">
                <ICONS.Star className="w-4 h-4" style={{ color: THEME_COLOR }} /> {currentAnime.malScore}
              </div>
            </div>
            <h1 className="text-4xl md:text-8xl font-black mb-4 drop-shadow-2xl tracking-tighter uppercase animate-in fade-in slide-in-from-left duration-700 leading-[0.9] text-white">
              {currentAnime.title}
            </h1>
            <p className="text-zinc-300 text-sm md:text-xl max-w-2xl line-clamp-3 md:line-clamp-4 animate-in fade-in slide-in-from-left duration-1000 delay-100 drop-shadow-xl leading-relaxed font-medium">
              {currentAnime.synopsis}
            </p>
            <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in slide-in-from-left duration-1000 delay-200">
              <button 
                onClick={() => onWatchNow(currentAnime.id)}
                className="hover:scale-105 active:scale-95 transition-all px-10 py-5 rounded-2xl font-black flex items-center gap-4 shadow-2xl"
                style={{ backgroundColor: THEME_COLOR, color: '#000' }}
              >
                <ICONS.Play className="w-6 h-6" />
                <span className="uppercase tracking-[0.1em]">Watch Now</span>
              </button>
              <div className="hidden md:flex gap-2">
                {currentAnime.genres.slice(0, 3).map(g => (
                  <span key={g} className="bg-black/40 backdrop-blur-xl px-5 py-5 rounded-2xl text-[10px] font-black border border-white/5 uppercase tracking-[0.2em] text-zinc-300">{g}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 flex gap-3">
          {activeSlides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-700 ${idx === current ? 'w-16 shadow-[0_0_20px_#ffde95]' : 'w-6 bg-white/20 hover:bg-white/40'}`}
              style={{ backgroundColor: idx === current ? THEME_COLOR : undefined }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
