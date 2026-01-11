
import React, { useState, useEffect } from 'react';
import { AppState, Anime, Season, Episode, UserProfile, Category } from './types';
import { INITIAL_STATE, ADMIN_USERNAME } from './constants';
import Header from './components/Header';
import Home from './pages/Home';
import AnimeView from './pages/AnimeView';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('hexa_anime_data');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [activeAnimeId, setActiveAnimeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = state.profile.username === ADMIN_USERNAME;

  useEffect(() => {
    localStorage.setItem('hexa_anime_data', JSON.stringify(state));
  }, [state]);

  const navigateTo = (route: string, animeId?: string) => {
    window.scrollTo(0, 0);
    setSearchQuery('');
    setCurrentRoute(route);
    if (animeId) setActiveAnimeId(animeId);
  };

  const handleHomeReset = () => {
    setSearchQuery('');
    setCurrentRoute('home');
    setActiveAnimeId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, ...profile } }));
  };

  const toggleFavorite = (animeId: string) => {
    setState(prev => {
      const isFav = prev.favorites.includes(animeId);
      return {
        ...prev,
        favorites: isFav 
          ? prev.favorites.filter(id => id !== animeId) 
          : [...prev.favorites, animeId]
      };
    });
  };

  const updateWatchProgress = (animeId: string, progress: any) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, preferredLang: progress.language },
      continueWatching: {
        ...prev.continueWatching,
        [animeId]: progress
      }
    }));
  };

  const updateSocialLinks = (links: { facebook: string; telegram: string }) => {
    setState(prev => ({ ...prev, socialLinks: links }));
  };

  // Admin Actions
  const addAnime = (anime: Anime) => setState(prev => ({ ...prev, animes: [...prev.animes, anime] }));
  const editAnime = (anime: Anime) => setState(prev => ({
    ...prev,
    animes: prev.animes.map(a => a.id === anime.id ? anime : a)
  }));
  const deleteAnime = (id: string) => setState(prev => ({
    ...prev,
    animes: prev.animes.filter(a => a.id !== id),
    seasons: prev.seasons.filter(s => s.animeId !== id),
    episodes: prev.episodes.filter(e => e.animeId !== id),
    sliders: prev.sliders.filter(s => s.animeId !== id)
  }));

  const addSeason = (season: Season) => setState(prev => ({ ...prev, seasons: [...prev.seasons, season] }));
  const editSeason = (season: Season) => setState(prev => ({
    ...prev,
    seasons: prev.seasons.map(s => s.id === season.id ? season : s)
  }));
  const deleteSeason = (id: string) => setState(prev => ({
    ...prev,
    seasons: prev.seasons.filter(s => s.id !== id),
    episodes: prev.episodes.filter(e => e.seasonId !== id)
  }));

  const addEpisode = (episode: Episode) => setState(prev => ({ ...prev, episodes: [...prev.episodes, episode] }));
  const editEpisode = (episode: Episode) => setState(prev => ({
    ...prev,
    episodes: prev.episodes.map(e => e.id === episode.id ? episode : e)
  }));
  const deleteEpisode = (id: string) => setState(prev => ({ ...prev, episodes: prev.episodes.filter(e => e.id !== id) }));

  const toggleSlider = (animeId: string) => {
    setState(prev => {
      const exists = prev.sliders.find(s => s.animeId === animeId);
      if (exists) {
        return { ...prev, sliders: prev.sliders.filter(s => s.animeId !== animeId) };
      }
      return { ...prev, sliders: [...prev.sliders, { id: Date.now().toString(), animeId, active: true }] };
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header 
        profile={state.profile} 
        animes={state.animes}
        onUpdateProfile={updateProfile} 
        onNavigateHome={handleHomeReset}
        onAnimeSelect={(id) => navigateTo('anime', id)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <main className="flex-grow pb-20">
        {currentRoute === 'home' ? (
          <Home 
            state={state} 
            onAnimeClick={(id) => navigateTo('anime', id)} 
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <AnimeView 
            anime={state.animes.find(a => a.id === activeAnimeId)!}
            seasons={state.seasons.filter(s => s.animeId === activeAnimeId)}
            episodes={state.episodes.filter(e => e.animeId === activeAnimeId)}
            progress={state.continueWatching[activeAnimeId!] || null}
            preferredLang={state.profile.preferredLang}
            onUpdateProgress={(p) => updateWatchProgress(activeAnimeId!, p)}
            onToggleFavorite={toggleFavorite}
            isFavorite={state.favorites.includes(activeAnimeId!)}
            isAdmin={isAdmin}
          />
        )}
      </main>

      <Footer socialLinks={state.socialLinks} />

      {isAdmin && (
        <AdminPanel 
          state={state}
          onAddAnime={addAnime}
          onEditAnime={editAnime}
          onDeleteAnime={deleteAnime}
          onAddSeason={addSeason}
          onEditSeason={editSeason}
          onDeleteSeason={deleteSeason}
          onAddEpisode={addEpisode}
          onEditEpisode={editEpisode}
          onDeleteEpisode={deleteEpisode}
          onToggleSlider={toggleSlider}
          onUpdateSocial={updateSocialLinks}
        />
      )}
    </div>
  );
};

export default App;
