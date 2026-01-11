
import React, { useState } from 'react';
import { UserProfile, Anime } from '../types';
import { ICONS, ADMIN_USERNAME, THEME_COLOR } from '../constants';

interface HeaderProps {
  profile: UserProfile;
  animes: Anime[];
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateHome: () => void;
  onAnimeSelect: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const Header: React.FC<HeaderProps> = ({ profile, animes, onUpdateProfile, onNavigateHome, onAnimeSelect, searchQuery, setSearchQuery }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempUsername, setTempUsername] = useState(profile.username);

  const filteredSearch = searchQuery.length > 1 
    ? animes.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.jpTitle.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ ...profile, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-2xl px-6 py-5 flex items-center justify-between border-b border-white/5 shadow-2xl">
      <div 
        className="text-2xl font-black cursor-pointer tracking-tighter uppercase group flex items-center transition-all"
        onClick={onNavigateHome}
        style={{ color: THEME_COLOR }}
      >
        HEXA<span className="text-white group-hover:tracking-widest transition-all">ANIME</span>
      </div>

      <div className={`flex-1 max-w-xl mx-8 relative hidden md:block ${searchQuery ? 'search-active' : ''}`}>
        <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 z-10" />
        {/* Removed invalid focusRingColor property from style below */}
        <input 
          type="text" 
          placeholder="Quick search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 transition-all z-10"
        />
        
        {/* Floating Search Results */}
        {filteredSearch.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2">
            {filteredSearch.map(anime => (
              <div 
                key={anime.id} 
                onClick={() => onAnimeSelect(anime.id)}
                className="flex items-center gap-4 p-3 hover:bg-zinc-800 cursor-pointer transition-colors border-b border-white/5 last:border-0"
              >
                <img src={anime.poster} className="w-10 h-14 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm line-clamp-1">{anime.title}</h4>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{anime.format} • ★ {anime.malScore}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setShowProfileModal(true)}
          className="group relative flex items-center gap-3 bg-zinc-900/80 hover:bg-zinc-800 p-1 rounded-full border border-white/10 transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center relative border border-white/5" style={{ borderColor: THEME_COLOR }}>
            {profile.profilePic ? (
              <img src={profile.profilePic} alt="Pfp" className="w-full h-full object-cover" />
            ) : (
              <ICONS.User className="w-6 h-6 text-zinc-400" />
            )}
          </div>
          <div className="text-[10px] font-black hidden sm:block pr-4 uppercase tracking-[0.2em] text-zinc-300">
            {profile.username || "Profile"}
          </div>
        </button>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full relative shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-transform active:scale-75">
              <ICONS.X className="w-8 h-8" />
            </button>
            <h2 className="text-3xl font-luxury font-black mb-8 italic uppercase tracking-tighter">User <span style={{ color: THEME_COLOR }}>Profile</span></h2>
            
            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-4 mb-4 overflow-hidden relative group shadow-2xl" style={{ borderColor: THEME_COLOR }}>
                  {profile.profilePic ? (
                    <img src={profile.profilePic} alt="Pfp" className="w-full h-full object-cover" />
                  ) : (
                    <ICONS.User className="w-16 h-16 text-white m-auto" />
                  )}
                  <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-sm">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    <ICONS.Plus className="w-8 h-8" style={{ color: THEME_COLOR }} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 ml-1">Username</label>
                {/* Removed invalid focusRingColor property from style below */}
                <input 
                  type="text" 
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none transition-all font-bold"
                />
              </div>

              <button 
                onClick={() => {
                  onUpdateProfile({ ...profile, username: tempUsername });
                  setShowProfileModal(false);
                }}
                className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] transition-all shadow-xl hover:brightness-110 active:scale-95"
                style={{ backgroundColor: THEME_COLOR, color: '#000' }}
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
