
export type Category = 'Trending' | 'Ongoing' | 'Fresh Drop' | 'Movies' | 'Completed';
export type AnimeFormat = 'TV' | 'Movie' | 'ONA' | 'OVA' | 'Special';

export interface EpisodeLinks {
  megaplayId?: string; // The "10789" ID
  multi?: string;      // Full URL for Hindi/Others
}

export interface Episode {
  id: string;
  seasonId: string;
  animeId: string;
  episodeNumber: number;
  title: string;
  isFiller: boolean;
  links: EpisodeLinks;
}

export interface Season {
  id: string;
  animeId: string;
  seasonNumber: number;
  title: string;
}

export interface Anime {
  id: string;
  title: string;
  jpTitle: string;
  synopsis: string;
  poster: string;
  cover: string;
  genres: string[];
  status: string;
  aired: string;
  premiered: string;
  duration: string;
  studios: string;
  producers: string;
  malScore: string;
  category: Category;
  format: AnimeFormat;
}

export interface SliderItem {
  id: string;
  animeId: string;
  active: boolean;
}

export interface UserProfile {
  username: string;
  profilePic?: string; 
  preferredLang: 'sub' | 'eng' | 'multi';
}

export interface WatchProgress {
  animeId: string;
  seasonId: string;
  episodeId: string;
  language: 'sub' | 'eng' | 'multi';
}

export interface AppState {
  animes: Anime[];
  seasons: Season[];
  episodes: Episode[];
  sliders: SliderItem[];
  profile: UserProfile;
  favorites: string[];
  continueWatching: Record<string, WatchProgress>;
  socialLinks: {
    facebook: string;
    telegram: string;
  };
}
