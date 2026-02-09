
import React, { useState, useMemo } from 'react';
import { INITIAL_PLAYLISTS, EDUCATIONAL_MODULES } from '../constants';
import { Playlist } from '../types';
import { soundEngine } from '../services/soundService';

interface CCResult {
  id: string;
  type: 'archive' | 'curriculum';
  category: string; 
  title: string;
  subtitle?: string;
  url?: string;
  thumbnail?: string;
  moduleId?: string;
  path?: string;
  tags: string[];
}

interface PlaylistSectionProps {
  onNavigateModule?: (id: string) => void;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({ onNavigateModule }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newTitle) return;

    // Simple YouTube validation
    if (!newUrl.includes('youtube.com') && !newUrl.includes('youtu.be')) {
      alert("Please provide a valid YouTube URL");
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      title: newTitle,
      url: newUrl,
      thumbnail: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800`
    };

    setPlaylists([newPlaylist, ...playlists]);
    setNewUrl('');
    setNewTitle('');
    setShowAddForm(false);
    soundEngine.play('SUCCESS');
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.length > 0 && val.length % 3 === 0) {
      soundEngine.play('DIGITAL_BLIP', 0.2);
    }
  };

  const globalResults = useMemo(() => {
    const results: CCResult[] = [];

    playlists.forEach(p => {
      results.push({
        id: `archive-${p.id}`,
        type: 'archive',
        category: 'Source',
        title: p.title,
        subtitle: 'External Intel Repository',
        url: p.url,
        thumbnail: p.thumbnail,
        tags: ['video', 'playlist', 'archive', ...p.title.toLowerCase().split(' ')]
      });
    });

    EDUCATIONAL_MODULES.forEach(module => {
      module.subSections.forEach(sub => {
        results.push({
          id: `sub-${sub.id}`,
          type: 'curriculum',
          category: module.title,
          title: sub.title,
          subtitle: `${module.title} Module`,
          moduleId: module.id,
          path: `${module.title} > ${sub.title}`,
          tags: ['curriculum', module.title.toLowerCase(), sub.title.toLowerCase()]
        });

        sub.sections.forEach(section => {
          section.chapters.forEach(chapter => {
            results.push({
              id: `chap-${chapter.id}`,
              type: 'curriculum',
              category: module.title,
              title: chapter.title,
              subtitle: 'Chapter Intel Node',
              moduleId: module.id,
              path: `${module.title} > ${sub.title} > ${section.title}`,
              tags: ['chapter', 'lesson', module.title.toLowerCase(), sub.title.toLowerCase(), chapter.title.toLowerCase()]
            });

            chapter.items.forEach(item => {
              if (item.url) {
                results.push({
                  id: `item-${item.id}`,
                  type: 'archive',
                  category: 'Source',
                  title: item.title,
                  subtitle: `Linked from ${chapter.title}`,
                  url: item.url,
                  thumbnail: `https://picsum.photos/seed/${item.id}/800/450`,
                  tags: ['item', 'video', 'link', item.title.toLowerCase()]
                });
              }
            });
          });
        });
      });
    });

    return results;
  }, [playlists]);

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    
    const keywords = q.split(/\s+/).filter(k => k.length > 0);
    
    return globalResults
      .filter(r => {
        return keywords.every(word => 
          r.title.toLowerCase().includes(word) || 
          r.subtitle?.toLowerCase().includes(word) ||
          r.path?.toLowerCase().includes(word) ||
          r.tags.some(t => t.includes(word))
        );
      })
      .sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().startsWith(q);
        const bTitleMatch = b.title.toLowerCase().startsWith(q);
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        return 0;
      });
  }, [globalResults, searchQuery]);

  return (
    <div className="page-transition max-w-7xl mx-auto py-6 md:py-12 px-4 md:px-6 min-h-[85vh] flex flex-col font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col items-center mb-12">
        <div className="text-center mb-8">
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none mb-4 animate-float-fast">
            Media Archive<span className="text-amber-500">.</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-8 bg-amber-500/20"></span>
            <p className="text-slate-500 font-mono text-[8px] md:text-[10px] uppercase tracking-[6px] md:tracking-[12px]">Source Repository & Indexer</p>
            <span className="h-[1px] w-8 bg-amber-500/20"></span>
          </div>
        </div>

        {/* Search Console */}
        <div className="relative w-full max-w-4xl group mb-8">
          <div className={`absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-[45px] blur-xl transition-opacity duration-500 ${searchQuery ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className="relative flex items-center bg-[#0a0f1e]/80 backdrop-blur-3xl border border-white/10 rounded-[35px] md:rounded-[50px] overflow-hidden shadow-2xl">
            <div className="pl-8 text-amber-500/60">
              <svg className={`h-7 w-7 ${searchQuery ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="SEARCH THE VOID: PLAYLISTS, CHAPTERS, INTEL..."
              className="w-full pl-6 pr-8 py-6 md:py-8 bg-transparent text-white text-sm md:text-lg font-mono uppercase tracking-[2px] outline-none placeholder:text-slate-800"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => handleSearchChange('')} className="mr-8 p-3 bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Uplink Trigger */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => { soundEngine.play('TAP'); setShowAddForm(!showAddForm); }}
            className={`px-8 py-3 rounded-full font-mono text-[10px] uppercase tracking-[4px] border transition-all ${showAddForm ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-white/5 text-slate-400 border-white/10 hover:border-amber-500/50'}`}
          >
            {showAddForm ? '[ Terminal Online ]' : '[ Open Contribution Uplink ]'}
          </button>
          
          {showAddForm && (
            <form onSubmit={handleAddPlaylist} className="mt-6 w-full max-w-2xl animate-page-in p-2 bg-white/[0.03] border border-white/10 rounded-[30px] flex flex-col sm:flex-row gap-2 shadow-2xl">
              <input 
                type="text" 
                placeholder="PLAYLIST LABEL"
                className="px-6 py-4 bg-transparent text-white outline-none font-mono text-[11px] flex-1 uppercase tracking-wider"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="YOUTUBE SOURCE URL"
                className="px-6 py-4 bg-transparent text-white outline-none font-mono text-[11px] flex-1 tracking-wider"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
              <button type="submit" className="bg-amber-500 text-slate-950 px-8 py-4 rounded-[25px] font-black text-[11px] uppercase tracking-widest hover:bg-amber-400 transition-all">
                INJECT
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="animate-page-in">
        {searchQuery.trim() === '' ? (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[6px]">Archived Playlists</h3>
              <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {playlists.map((playlist) => (
                <a 
                  key={playlist.id} 
                  href={playlist.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative bg-[#0a0f1e] rounded-[40px] overflow-hidden border border-white/5 hover:border-amber-400/30 transition-all duration-500 flex flex-col shadow-xl hover:shadow-amber-500/10"
                  onClick={() => soundEngine.play('TAP')}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={playlist.thumbnail} alt="" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 text-3xl shadow-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">▶</div>
                    </div>
                    <div className="absolute top-6 left-6 flex gap-2">
                       <div className="bg-amber-500/10 backdrop-blur-xl px-4 py-1.5 rounded-full border border-amber-500/20 text-[8px] font-mono text-amber-500 uppercase tracking-[2px] font-bold">
                         SOURCE_YT
                       </div>
                    </div>
                  </div>
                  <div className="p-10 -mt-6 relative">
                    <h3 className="font-bold text-xl text-white mb-3 group-hover:text-amber-400 transition-colors leading-tight">{playlist.title}</h3>
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-600 uppercase tracking-widest border-t border-white/5 pt-4 mt-2">
                      <span>View Intel Source</span>
                      <span className="text-amber-500/40">----→</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[6px]">Search Results: {filteredResults.length} Found</h3>
              <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>

            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResults.map((result) => (
                  <div key={result.id} className="group relative bg-[#0a0f1e] rounded-[40px] overflow-hidden border border-white/5 hover:border-amber-400/30 transition-all duration-500 flex flex-col shadow-xl">
                    {result.type === 'archive' ? (
                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="block flex-1" onClick={() => soundEngine.play('TAP')}>
                        <div className="relative h-48 overflow-hidden">
                          <img src={result.thumbnail} alt="" className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent"></div>
                          <div className="absolute top-6 left-6 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 text-[8px] font-mono text-amber-500 uppercase tracking-[2px]">DATA_SOURCE</div>
                        </div>
                        <div className="p-10 -mt-8 relative">
                          <h3 className="font-bold text-xl text-white mb-3 group-hover:text-amber-400 transition-colors leading-tight">{result.title}</h3>
                          <p className="text-[8px] font-mono text-slate-600 truncate uppercase bg-white/[0.02] p-2 rounded-lg border border-white/5">{result.url}</p>
                        </div>
                      </a>
                    ) : (
                      <button onClick={() => { soundEngine.play('TAP'); result.moduleId && onNavigateModule?.(result.moduleId); }} className="block text-left flex-1 p-10">
                        <div className="mb-8 flex justify-between items-start">
                           <div className="w-14 h-14 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-2xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 shadow-inner">📚</div>
                           <div className="bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 text-[8px] font-mono text-blue-400 uppercase tracking-[2px]">CURRICULUM</div>
                        </div>
                        <h3 className="font-bold text-2xl text-white mb-6 group-hover:text-amber-400 transition-colors tracking-tight">{result.title}</h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[2px] mb-4 italic">{result.path}</p>
                        <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between text-amber-500/50 font-mono text-[10px] uppercase tracking-[3px] group-hover:text-amber-400 transition-colors">
                           <span>Navigate Node</span>
                           <span className="group-hover:translate-x-2 transition-transform duration-500">----→</span>
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center">
                <span className="text-6xl opacity-10">🔭</span>
                <h3 className="text-white font-black text-2xl mt-8 uppercase tracking-tighter">No Intel Matches</h3>
                <p className="text-slate-600 font-mono text-[10px] uppercase tracking-widest mt-4">Adjust query parameters or verify uplink integrity.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistSection;
