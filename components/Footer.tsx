
import React from 'react';
import { ICONS, THEME_COLOR } from '../constants';

interface FooterProps {
  socialLinks: {
    facebook: string;
    telegram: string;
  };
}

const Footer: React.FC<FooterProps> = ({ socialLinks }) => {
  return (
    <footer className="bg-black border-t border-white/5 py-24 px-8">
      <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
        <div className="text-left">
          <div className="text-5xl font-black tracking-tighter uppercase mb-6" style={{ color: THEME_COLOR }}>
            HEXA<span className="text-white">ANIME</span>
          </div>
          <p className="text-zinc-600 text-sm max-w-sm font-bold uppercase tracking-widest leading-loose opacity-60">
            Obsidian Series Luxury Streaming. 
            Designed for the elite viewer.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-10">
          <h4 className="text-zinc-800 font-black uppercase tracking-[0.6em] text-[10px] ml-1">Connect with Hexa</h4>
          <div className="flex gap-6">
            <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-[1.5rem] bg-zinc-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl group border border-white/5">
              <ICONS.Facebook className="w-7 h-7 text-zinc-600 group-hover:text-white transition-colors" />
            </a>
            <a href={socialLinks.telegram} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-[1.5rem] bg-zinc-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl group border border-white/5">
              <ICONS.Telegram className="w-7 h-7 text-zinc-600 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-32 pt-12 border-t border-white/5 text-center">
        <p className="text-zinc-800 text-[9px] font-black uppercase tracking-[0.8em] mb-6">&copy; {new Date().getFullYear()} HEXAANIME OBSIDIAN CORE</p>
        <p className="text-zinc-900 text-[7px] font-black max-w-3xl mx-auto leading-[2.5] uppercase tracking-[0.1em] opacity-40">
          HEXAANIME DOES NOT STORE ANY FILES ON ITS SERVER. ALL CONTENTS ARE PROVIDED BY NON-AFFILIATED THIRD PARTIES. 
          DEVELOPED FOR LUXURY VIEWING EXPERIENCES.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
