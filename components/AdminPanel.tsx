
import React, { useState } from 'react';
import { AppState, Anime, Season, Episode, Category, AnimeFormat } from '../types';
import { ICONS, THEME_COLOR } from '../constants';

interface AdminPanelProps {
  state: AppState;
  onAddAnime: (a: Anime) => void;
  onEditAnime: (a: Anime) => void;
  onDeleteAnime: (id: string) => void;
  onAddSeason: (s: Season) => void;
  onEditSeason: (s: Season) => void;
  onDeleteSeason: (id: string) => void;
  onAddEpisode: (e: Episode) => void;
  onEditEpisode: (e: Episode) => void;
  onDeleteEpisode: (id: string) => void;
  onToggleSlider: (animeId: string) => void;
  onUpdateSocial: (links: { facebook: string; telegram: string }) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const { state, onAddAnime, onEditAnime, onDeleteAnime, onAddSeason, onEditSeason, onDeleteSeason, onAddEpisode, onEditEpisode, onDeleteEpisode, onToggleSlider, onUpdateSocial } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'anime' | 'season' | 'episode' | 'list' | 'settings'>('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedAnime, setExpandedAnime] = useState<string | null>(null);

  const [animeForm, setAnimeForm] = useState<Partial<Anime>>({ format: 'TV' });
  const [seasonForm, setSeasonForm] = useState<Partial<Season>>({});
  const [episodeForm, setEpisodeForm] = useState<any>({ links: {} });
  const [socialForm, setSocialForm] = useState(state.socialLinks);
  const [editId, setEditId] = useState<string | null>(null);

  const searchAniList = async () => {
    if (!searchQuery) return;
    setLoading(true);
    const query = `
      query ($search: String) {
        Page(perPage: 6) {
          media(search: $search, type: ANIME) {
            id
            title { english romaji }
            description
            coverImage { large extraLarge }
            bannerImage
            genres
            status
            averageScore
            duration
            format
            studios(isMain: true) { nodes { name } }
            startDate { year month day }
          }
        }
      }
    `;
    try {
      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { search: searchQuery } })
      });
      const data = await res.json();
      setResults(data.data.Page.media);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const selectAniList = (item: any) => {
    let format: AnimeFormat = 'TV';
    if (item.format === 'MOVIE') format = 'Movie';
    else if (item.format === 'ONA') format = 'ONA';
    else if (item.format === 'OVA') format = 'OVA';
    else if (item.format === 'SPECIAL') format = 'Special';

    setAnimeForm({
      title: item.title.english || item.title.romaji,
      jpTitle: item.title.romaji,
      synopsis: item.description?.replace(/<[^>]*>?/gm, '') || '',
      poster: item.coverImage.extraLarge || item.coverImage.large,
      cover: item.bannerImage || item.coverImage.extraLarge,
      genres: item.genres,
      status: item.status,
      aired: item.startDate.year ? `${item.startDate.year}-${item.startDate.month}-${item.startDate.day}` : 'Unknown',
      premiered: item.startDate.year?.toString() || 'Unknown',
      duration: `${item.duration}m`,
      studios: item.studios.nodes[0]?.name || 'Unknown',
      malScore: (item.averageScore / 10).toFixed(1),
      category: 'Trending',
      format: format
    });
    setResults([]);
    setSearchQuery('');
  };

  const resetForms = () => {
    setAnimeForm({ format: 'TV' });
    setSeasonForm({});
    setEpisodeForm({ links: {} });
    setEditId(null);
    setView('menu');
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex flex-col items-end gap-3">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all rotate-45"
          style={{ backgroundColor: THEME_COLOR }}
        >
          <div className="-rotate-45 text-black">
            {isOpen ? <ICONS.X className="w-8 h-8" /> : <ICONS.Plus className="w-8 h-8" />}
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[200] bg-[#050505]/98 backdrop-blur-3xl p-4 md:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto py-8 md:py-12">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl md:text-5xl font-luxury font-black uppercase italic tracking-tighter">HEXA <span style={{ color: THEME_COLOR }}>DASHBOARD</span></h2>
              <button onClick={() => { setIsOpen(false); resetForms(); }} className="p-4 bg-zinc-900 rounded-2xl text-zinc-600 hover:text-white transition-all">
                <ICONS.X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            {view === 'menu' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button onClick={() => setView('anime')} className="p-8 bg-zinc-900/40 rounded-[2rem] border border-white/5 hover:border-[#ffde95]/40 transition-all text-left group">
                  <div className="w-12 h-12 bg-[#ffde95]/10 text-[#ffde95] rounded-xl flex items-center justify-center mb-6"><ICONS.Plus className="w-8 h-8" /></div>
                  <h3 className="text-2xl font-black mb-2 uppercase">Series</h3>
                  <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-widest">Add via AniList</p>
                </button>
                <button onClick={() => setView('list')} className="p-8 bg-zinc-900/40 rounded-[2rem] border border-white/5 hover:border-[#ffde95]/40 transition-all text-left group">
                  <div className="w-12 h-12 bg-[#ffde95]/10 text-[#ffde95] rounded-xl flex items-center justify-center mb-6"><ICONS.Edit className="w-8 h-8" /></div>
                  <h3 className="text-2xl font-black mb-2 uppercase">Content</h3>
                  <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-widest">Library & EPS</p>
                </button>
                <button onClick={() => setView('settings')} className="p-8 bg-zinc-900/40 rounded-[2rem] border border-white/5 hover:border-[#ffde95]/40 transition-all text-left group">
                  <div className="w-12 h-12 bg-[#ffde95]/10 text-[#ffde95] rounded-xl flex items-center justify-center mb-6"><ICONS.Search className="w-8 h-8" /></div>
                  <h3 className="text-2xl font-black mb-2 uppercase">Globals</h3>
                  <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-widest">Social Links</p>
                </button>
              </div>
            )}

            {view === 'settings' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 ml-2">Facebook</label>
                    <input value={socialForm.facebook} onChange={e => setSocialForm({...socialForm, facebook: e.target.value})} className="w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-600 mb-4 ml-2">Telegram</label>
                    <input value={socialForm.telegram} onChange={e => setSocialForm({...socialForm, telegram: e.target.value})} className="w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl font-bold" />
                  </div>
                </div>
                <button onClick={() => { onUpdateSocial(socialForm); setView('menu'); }} className="w-full py-5 rounded-2xl font-black uppercase text-black" style={{ backgroundColor: THEME_COLOR }}>Save Changes</button>
              </div>
            )}

            {view === 'episode' && (
              <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select className="bg-zinc-950 border border-white/10 p-5 rounded-xl font-black uppercase" value={episodeForm.animeId} onChange={e => setEpisodeForm({...episodeForm, animeId: e.target.value, seasonId: ''})}>
                    <option value="">Select Anime</option>
                    {state.animes.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                  </select>
                  <select className="bg-zinc-950 border border-white/10 p-5 rounded-xl font-black uppercase" value={episodeForm.seasonId} onChange={e => setEpisodeForm({...episodeForm, seasonId: e.target.value})}>
                    <option value="">Select Season</option>
                    {state.seasons.filter(s => s.animeId === episodeForm.animeId).map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <input type="number" placeholder="EP Number" value={episodeForm.episodeNumber || ''} className="bg-zinc-950 border border-white/10 p-5 rounded-xl font-black text-2xl" onChange={e => setEpisodeForm({...episodeForm, episodeNumber: parseInt(e.target.value)})} />
                  <div className="flex items-center gap-4 bg-zinc-950 border border-white/10 p-5 rounded-xl">
                    <input type="checkbox" checked={episodeForm.isFiller || false} onChange={e => setEpisodeForm({...episodeForm, isFiller: e.target.checked})} className="w-6 h-6 rounded" style={{ accentColor: THEME_COLOR }} id="filler-check" />
                    <label htmlFor="filler-check" className="font-black text-[10px] uppercase text-zinc-500">Filler?</label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-zinc-600 mb-2 ml-1">Megaplay Stream ID (Used for Sub & Eng)</label>
                    <input placeholder="e.g. 10789" value={episodeForm.megaplayId || ''} className="w-full bg-zinc-950 border border-white/5 p-5 rounded-xl font-bold" onChange={e => setEpisodeForm({...episodeForm, megaplayId: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-zinc-600 mb-2 ml-1">Multi / Hindi / Other Link (Full URL)</label>
                    <input placeholder="Full https:// link..." value={episodeForm.multi || ''} className="w-full bg-zinc-950 border border-white/5 p-5 rounded-xl font-medium" onChange={e => setEpisodeForm({...episodeForm, multi: e.target.value})} />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const epData = {
                      ...episodeForm,
                      id: editId || Date.now().toString(),
                      title: "",
                      links: { megaplayId: episodeForm.megaplayId, multi: episodeForm.multi }
                    };
                    if (editId) onEditEpisode(epData);
                    else onAddEpisode(epData);
                    resetForms();
                  }} 
                  className="w-full py-6 rounded-xl font-black uppercase text-black" 
                  style={{ backgroundColor: THEME_COLOR }}
                >
                  Publish Episode
                </button>
              </div>
            )}

            {view === 'list' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                {state.animes.map(anime => (
                  <div key={anime.id} className="bg-zinc-900/20 rounded-[2rem] border border-white/5 overflow-hidden shadow-xl">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between bg-zinc-950/40 gap-6">
                      <div className="flex items-center gap-6">
                        <img src={anime.poster} className="w-16 h-24 object-cover rounded-xl shadow-xl" />
                        <div>
                          <h4 className="font-luxury font-black text-xl md:text-2xl uppercase italic leading-none">{anime.title}</h4>
                          <div className="flex gap-3 mt-3">
                            <span className="text-[8px] font-black px-2 py-0.5 rounded border border-white/10" style={{ color: THEME_COLOR }}>{anime.format}</span>
                            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">{anime.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        <button onClick={() => { setEditId(anime.id); setAnimeForm(anime); setView('anime'); }} className="p-4 bg-blue-600/80 rounded-xl hover:scale-110 transition-transform"><ICONS.Edit className="w-5 h-5 text-white" /></button>
                        <button onClick={() => onDeleteAnime(anime.id)} className="p-4 bg-rose-600/80 rounded-xl hover:scale-110 transition-transform"><ICONS.Trash className="w-5 h-5 text-white" /></button>
                        <button onClick={() => setExpandedAnime(expandedAnime === anime.id ? null : anime.id)} className="px-5 py-2 bg-zinc-900 border border-white/5 rounded-xl font-black text-[9px] uppercase tracking-widest" style={{ color: expandedAnime === anime.id ? THEME_COLOR : undefined }}>{expandedAnime === anime.id ? 'Hide Library' : 'Edit Library'}</button>
                      </div>
                    </div>
                    
                    {expandedAnime === anime.id && (
                      <div className="p-6 md:p-10 space-y-12 bg-black/30 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
                        {state.seasons.filter(s => s.animeId === anime.id).map(s => (
                          <div key={s.id} className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                              <h5 className="font-luxury font-black uppercase tracking-widest text-base italic" style={{ color: THEME_COLOR }}>{s.title}</h5>
                              <div className="flex gap-6">
                                <button onClick={() => { setEditId(s.id); setSeasonForm(s); setView('season'); }} className="text-[9px] font-black text-blue-500 uppercase hover:brightness-125 transition-all">Edit</button>
                                <button onClick={() => onDeleteSeason(s.id)} className="text-[9px] font-black text-rose-500 uppercase hover:brightness-125 transition-all">Delete</button>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-10 gap-3">
                              {state.episodes.filter(e => e.seasonId === s.id).sort((a,b) => a.episodeNumber - b.episodeNumber).map(ep => (
                                <div key={ep.id} className="group relative bg-zinc-950 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-[#ffde95]/40 transition-all">
                                  <span className="font-black text-xl">{ep.episodeNumber}</span>
                                  <div className="flex gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditId(ep.id); setEpisodeForm({...ep, ...ep.links}); setView('episode'); }} className="text-blue-500 hover:scale-125 transition-transform"><ICONS.Edit className="w-4 h-4" /></button>
                                    <button onClick={() => onDeleteEpisode(ep.id)} className="text-rose-500 hover:scale-125 transition-transform"><ICONS.Trash className="w-4 h-4" /></button>
                                  </div>
                                </div>
                              ))}
                              <button 
                                onClick={() => { setView('episode'); setEpisodeForm({animeId: anime.id, seasonId: s.id}); }}
                                className="bg-zinc-900/40 border border-dashed border-white/10 rounded-xl flex items-center justify-center p-6 hover:bg-white/5 group"
                              >
                                <ICONS.Plus className="w-8 h-8 text-zinc-700 group-hover:scale-110 group-hover:text-white transition-all" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => { setView('season'); setSeasonForm({animeId: anime.id}); }}
                          className="w-full py-6 bg-zinc-950 border border-dashed border-white/10 rounded-2xl font-black uppercase text-zinc-700 hover:text-white transition-all text-[10px] tracking-[0.3em]"
                        >
                          + New Season
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
