
import React from 'react';
import { AppState } from '../types';
import HeroSlider from '../components/HeroSlider';
import AnimeSection from '../components/AnimeSection';

interface HomeProps {
  state: AppState;
  searchQuery: string;
  onAnimeClick: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ state, searchQuery, onAnimeClick, onToggleFavorite }) => {
  const filteredAnimes = searchQuery 
    ? state.animes.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.jpTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    : state.animes;

  const continueWatchingAnimes = Object.keys(state.continueWatching)
    .map(id => state.animes.find(a => a.id === id))
    .filter((a): a is any => !!a);

  return (
    <div>
      {!searchQuery && (
        <HeroSlider 
          slides={state.sliders} 
          animes={state.animes} 
          onWatchNow={onAnimeClick} 
        />
      )}

      <div className={`${!searchQuery ? '-mt-12' : 'mt-8'} relative z-10`}>
        {searchQuery && (
          <div className="px-6 mb-12">
            <h2 className="text-3xl font-black mb-8">Search Results for "{searchQuery}"</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredAnimes.map(anime => (
                <div key={anime.id} className="group cursor-pointer" onClick={() => onAnimeClick(anime.id)}>
                   <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 border border-white/5 transition-transform group-hover:scale-105">
                      <img src={anime.poster} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 rounded text-[10px] font-bold">
                        {anime.malScore}
                      </div>
                   </div>
                   <h3 className="font-bold text-sm line-clamp-1 group-hover:text-rose-500">{anime.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searchQuery && (
          <>
            {continueWatchingAnimes.length > 0 && (
              <AnimeSection 
                title="Continue Watching" 
                animes={continueWatchingAnimes} 
                episodes={state.episodes}
                onAnimeClick={onAnimeClick} 
                favorites={state.favorites}
                onToggleFavorite={onToggleFavorite}
              />
            )}

            <AnimeSection 
              title="Trending Now" 
              animes={state.animes.filter(a => a.category === 'Trending')} 
              episodes={state.episodes}
              onAnimeClick={onAnimeClick} 
              favorites={state.favorites}
              onToggleFavorite={onToggleFavorite}
            />

            <AnimeSection 
              title="Ongoing Series" 
              animes={state.animes.filter(a => a.category === 'Ongoing')} 
              episodes={state.episodes}
              onAnimeClick={onAnimeClick} 
              favorites={state.favorites}
              onToggleFavorite={onToggleFavorite}
            />

            <AnimeSection 
              title="Fresh Drops" 
              animes={state.animes.filter(a => a.category === 'Fresh Drop')} 
              episodes={state.episodes}
              onAnimeClick={onAnimeClick} 
              favorites={state.favorites}
              onToggleFavorite={onToggleFavorite}
            />

            <AnimeSection 
              title="Movies" 
              animes={state.animes.filter(a => a.category === 'Movies')} 
              episodes={state.episodes}
              onAnimeClick={onAnimeClick} 
              favorites={state.favorites}
              onToggleFavorite={onToggleFavorite}
            />

            <AnimeSection 
              title="Completed Series" 
              animes={state.animes.filter(a => a.category === 'Completed')} 
              episodes={state.episodes}
              onAnimeClick={onAnimeClick} 
              favorites={state.favorites}
              onToggleFavorite={onToggleFavorite}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
