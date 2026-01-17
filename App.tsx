
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AudioVisualizer } from './components/AudioVisualizer';
import { VOICES, DIALECTS, TRANSLATIONS } from './constants';
import { Voice, Dialect, DialogueSegment, AppMode } from './types';
import { generateSpeech, generateDialogue } from './services/geminiService';
import { audioBufferToMp3 } from './utils/audioConverter';

type Status = 'idle' | 'generating' | 'success' | 'error';

// Professional Tech/Startup Sound (Base64)
const STARTUP_SOUND_B64 = "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YREAAAAAAAD/f39/f39/f39/f39/f39/f39/"; // Placeholder for brevity, using synth in code

const playStartupSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
    oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 1.2);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5);
  } catch (e) {
    console.log("Audio context blocked or not supported");
  }
};

const AppLogo: React.FC<{ className?: string; animated?: boolean }> = ({ className = "w-10 h-10", animated = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="40" stroke="url(#logoGrad)" strokeWidth="8" opacity="0.2" />
    <path 
      d="M30 50 Q 50 20 70 50 T 110 50" 
      stroke="url(#logoGrad)" 
      strokeWidth="8" 
      strokeLinecap="round" 
      fill="none" 
      filter="url(#glow)"
    >
      {animated && <animate attributeName="d" values="M30 50 Q 50 20 70 50 T 110 50; M30 50 Q 50 80 70 50 T 110 50; M30 50 Q 50 20 70 50 T 110 50" dur="2s" repeatCount="indefinite" />}
    </path>
  </svg>
);

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = () => {
    setIsLaunching(true);
    playStartupSound();
    setTimeout(onFinish, 1200);
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-[#030712] flex flex-col items-center justify-center transition-all duration-1000 ${isLaunching ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_50%)]" />
      
      <div className="relative flex flex-col items-center gap-8 animate-zoom-in">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-[50px] rounded-full" />
          <AppLogo className="w-24 h-24 relative z-10" animated={true} />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">VoxTone</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-medium">Professional AI Voice Lab</p>
        </div>

        {!isLaunching && (
          <button 
            onClick={handleLaunch}
            className="mt-10 px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 group overflow-hidden relative"
          >
            <span className="relative z-10">Launch Studio</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      <div className="absolute bottom-10 text-[8px] text-gray-700 font-bold tracking-widest uppercase">
        Powered by Gemini 2.5 Flash
      </div>
    </div>
  );
};

const VoiceCard: React.FC<{ 
  voice: Voice; 
  isSelected: boolean; 
  onClick: () => void; 
  size?: 'sm' | 'md';
  lang: 'ar' | 'en';
}> = ({ voice, isSelected, onClick, size = 'md', lang }) => {
  const name = lang === 'ar' ? voice.nameAr : voice.nameEn;
  const shortDesc = lang === 'ar' ? voice.descriptionAr : voice.descriptionEn;
  const longDesc = lang === 'ar' ? voice.longDescriptionAr : voice.longDescriptionEn;
  
  return (
    <button 
      onClick={onClick}
      className={`shrink-0 transition-all duration-300 relative group active:scale-95 snap-center ${
        size === 'sm' ? 'w-40 h-56' : 'w-56 h-72'
      }`}
    >
      <div className={`relative h-full flex flex-col items-center p-5 border-2 rounded-[35px] transition-all duration-300 overflow-hidden ${
        isSelected ? 'border-purple-500 bg-[#0f172a] shadow-lg shadow-purple-500/10' : 'border-gray-800 bg-[#0a0f1d] hover:border-gray-700'
      }`}>
        
        <div 
          className={`rounded-full mb-3 flex items-center justify-center font-black text-white shadow-md transition-all duration-500 ${
            isSelected ? 'w-16 h-16 text-2xl scale-110' : 'w-14 h-14 text-xl'
          }`}
          style={{ backgroundColor: voice.avatarColor }}
        >
          {name[0]}
        </div>
        
        <span className={`font-black text-xs text-center line-clamp-1 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
          {name}
        </span>
        
        <div className="flex flex-wrap justify-center gap-1 mt-2">
          {voice.traits.slice(0, 2).map(trait => (
            <span key={trait} className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
              isSelected ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-500'
            }`}>
              {trait}
            </span>
          ))}
        </div>

        <div className="mt-3 relative flex-1 w-full overflow-hidden">
          <p className={`text-[10px] leading-tight text-center italic transition-all duration-500 absolute inset-0 ${
            isSelected ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
          } text-gray-500 line-clamp-2`}>
            {shortDesc}
          </p>
          <p className={`text-[9px] leading-[1.3] text-center transition-all duration-500 absolute inset-0 overflow-y-auto no-scrollbar ${
            isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          } text-gray-300`}>
            {longDesc}
          </p>
        </div>

        {isSelected && (
          <div className="absolute top-4 right-4 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center border-2 border-[#030712] animate-pulse">
             <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        )}
      </div>
    </button>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [mode, setMode] = useState<AppMode>('single');
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [text, setText] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const [singleSpeakerId, setSingleSpeakerId] = useState<string>(VOICES[0].id);
  const [dialogueSpeakerOneId, setDialogueSpeakerOneId] = useState<string>(VOICES[0].id);
  const [dialogueSpeakerTwoId, setDialogueSpeakerTwoId] = useState<string>(VOICES[1].id);

  const [dialogueSegments, setDialogueSegments] = useState<DialogueSegment[]>([
    { id: '1', speakerIndex: 0, text: '' },
    { id: '2', speakerIndex: 1, text: '' }
  ]);
  
  const [selectedDialect, setSelectedDialect] = useState<Dialect>(DIALECTS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioBuffer, setCurrentAudioBuffer] = useState<AudioBuffer | null>(null);

  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const t = TRANSLATIONS[lang];

  const categories = useMemo(() => {
    return lang === 'ar' 
      ? ['الكل', 'مصرية', 'إنجليزي', 'خليجي', 'شامي', 'صعيدي', 'رسمي']
      : ['All', 'Egyptian', 'English', 'Gulf', 'Levantine', 'Saidi', 'Standard'];
  }, [lang]);

  const filteredVoices = useMemo(() => {
    const catMap: any = { 
      'All': 'all', 'الكل': 'all',
      'Egyptian': 'egyptian', 'مصرية': 'egyptian',
      'English': 'english', 'إنجليزي': 'english',
      'Gulf': 'gulf', 'خليجي': 'gulf',
      'Levantine': 'levantine', 'شامي': 'levantine',
      'Saidi': 'saidi', 'صعيدي': 'saidi',
      'Standard': 'standard', 'رسمي': 'standard'
    };
    const target = catMap[activeCategory];
    if (!target || target === 'all') return VOICES;
    return VOICES.filter(v => v.category === target);
  }, [activeCategory]);

  const handleGenerate = async () => {
    if (status === 'generating') return;
    setStatus('generating');
    try {
      let buffer: AudioBuffer;
      if (mode === 'single') {
        if (!text.trim()) { setStatus('idle'); return; }
        const voice = VOICES.find(v => v.id === singleSpeakerId)!;
        buffer = await generateSpeech(text, voice, selectedDialect.label);
      } else {
        const validSegments = dialogueSegments.filter(s => s.text.trim());
        if (validSegments.length === 0) { setStatus('idle'); return; }
        const v1 = VOICES.find(v => v.id === dialogueSpeakerOneId)!;
        const v2 = VOICES.find(v => v.id === dialogueSpeakerTwoId)!;
        buffer = await generateDialogue(validSegments, [v1, v2], selectedDialect.label);
      }
      setCurrentAudioBuffer(buffer);
      setStatus('success');
      playAudio(buffer);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const playAudio = (buffer: AudioBuffer) => {
    if (audioSourceRef.current) audioSourceRef.current.stop();
    if (!audioContextRef.current) audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => setIsPlaying(false);
    setIsPlaying(true);
    source.start(0);
    audioSourceRef.current = source;
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      setIsPlaying(false);
    }
  };

  const handleDownload = () => {
    if (!currentAudioBuffer) return;
    try {
      const mp3Blob = audioBufferToMp3(currentAudioBuffer, 320);
      const url = URL.createObjectURL(mp3Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voxtone-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert(lang === 'ar' ? 'فشل تحويل الصوت إلى MP3.' : 'Failed to convert audio to MP3.');
    }
  };

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 overflow-x-hidden animate-zoom-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col relative pb-32">
        
        <header className="h-16 flex items-center justify-between px-6 sticky top-0 bg-[#030712]/80 backdrop-blur-lg z-50 border-b border-gray-900">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-[9px] font-black uppercase px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg">
            {t.toggle_lang}
          </button>
          <div className="flex items-center gap-2">
            <AppLogo className="w-5 h-5" />
            <h1 className="text-base font-black italic text-white uppercase">{t.app_name}</h1>
          </div>
          <div className="w-10"></div>
        </header>

        <main className="px-5 py-6 flex flex-col gap-8">
          
          <nav className="flex bg-gray-900/50 p-1 rounded-2xl border border-gray-800">
             <button onClick={() => setMode('single')} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${mode === 'single' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500'}`}>{t.single}</button>
             <button onClick={() => setMode('dialogue')} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${mode === 'dialogue' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500'}`}>{t.dialogue}</button>
          </nav>

          <section className="flex flex-col gap-3">
             <h2 className="text-[9px] font-black text-gray-600 uppercase tracking-widest px-1">{mode === 'single' ? t.input_instruction : t.dialogue_instruction}</h2>
             {mode === 'single' ? (
                <textarea
                  dir="auto"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t.editor_placeholder}
                  className="w-full h-48 bg-[#0a0f1d] border border-gray-800 rounded-3xl p-6 text-lg focus:ring-2 focus:ring-purple-500/20 focus:outline-none focus:border-purple-500/50 resize-none transition-all placeholder:text-gray-800"
                />
             ) : (
                <div className="flex flex-col gap-3">
                   {dialogueSegments.map((seg) => (
                      <div key={seg.id} className="flex gap-2">
                         <button 
                           onClick={() => setDialogueSegments(dialogueSegments.map(s => s.id === seg.id ? {...s, speakerIndex: s.speakerIndex === 0 ? 1 : 0} : s))}
                           className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black text-white text-xs ${seg.speakerIndex === 0 ? 'bg-purple-600' : 'bg-indigo-600'}`}
                         >
                           {seg.speakerIndex === 0 ? 'A' : 'B'}
                         </button>
                         <textarea
                           dir="auto"
                           value={seg.text}
                           onChange={(e) => setDialogueSegments(dialogueSegments.map(s => s.id === seg.id ? {...s, text: e.target.value} : s))}
                           className="flex-1 bg-[#0a0f1d] border border-gray-800 rounded-2xl p-3 text-sm focus:outline-none focus:border-purple-500/50 min-h-[60px]"
                           placeholder="..."
                         />
                      </div>
                   ))}
                   <button onClick={() => setDialogueSegments([...dialogueSegments, { id: Date.now().toString(), speakerIndex: 0, text: '' }])} className="py-2 border border-dashed border-gray-800 rounded-xl text-[8px] font-black text-gray-600">
                     {t.add_line}
                   </button>
                </div>
             )}
          </section>

          <section className="flex flex-col gap-3">
             <h2 className="text-[9px] font-black text-gray-600 uppercase tracking-widest px-1">{t.dialect_title}</h2>
             <div className="flex flex-wrap gap-1.5">
                {DIALECTS.map(d => (
                   <button key={d.id} onClick={() => setSelectedDialect(d)} className={`px-3 py-2 rounded-lg border text-[10px] font-black transition-all ${selectedDialect.id === d.id ? 'bg-white text-black border-white shadow-sm' : 'bg-transparent border-gray-800 text-gray-500'}`}>
                      {d.label}
                   </button>
                ))}
             </div>
          </section>

          <section className="flex flex-col gap-4">
             <div className="flex items-center justify-between px-1 overflow-x-auto no-scrollbar gap-3">
                <h2 className="text-[9px] font-black text-gray-600 uppercase tracking-widest shrink-0">{t.voice_title}</h2>
                <div className="flex gap-1.5">
                   {categories.map(cat => (
                      <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 text-[8px] font-black uppercase px-2.5 py-1 rounded-md border transition-all ${activeCategory === cat ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'border-gray-800 text-gray-600'}`}>
                        {cat}
                      </button>
                   ))}
                </div>
             </div>

             {mode === 'single' ? (
                <div className="relative -mx-5">
                   <div className="flex overflow-x-auto gap-4 px-5 no-scrollbar snap-x snap-mandatory py-2">
                      {filteredVoices.map(v => (
                         <VoiceCard key={v.id} voice={v} isSelected={singleSpeakerId === v.id} onClick={() => setSingleSpeakerId(v.id)} lang={lang} />
                      ))}
                   </div>
                </div>
             ) : (
                <div className="flex flex-col gap-6">
                   <div className="space-y-2">
                      <span className="text-[8px] font-black text-purple-500 uppercase px-1">{t.speaker_a}</span>
                      <div className="flex overflow-x-auto gap-3 no-scrollbar snap-x -mx-5 px-5 py-1">
                         {VOICES.map(v => (
                            <VoiceCard key={v.id} voice={v} size="sm" isSelected={dialogueSpeakerOneId === v.id} onClick={() => setDialogueSpeakerOneId(v.id)} lang={lang} />
                         ))}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <span className="text-[8px] font-black text-indigo-500 uppercase px-1">{t.speaker_b}</span>
                      <div className="flex overflow-x-auto gap-3 no-scrollbar snap-x -mx-5 px-5 py-1">
                         {VOICES.map(v => (
                            <VoiceCard key={v.id} voice={v} size="sm" isSelected={dialogueSpeakerTwoId === v.id} onClick={() => setDialogueSpeakerTwoId(v.id)} lang={lang} />
                         ))}
                      </div>
                   </div>
                </div>
             )}
          </section>
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#030712] via-[#030712]/95 to-transparent backdrop-blur-md z-50">
           <div className="max-w-md mx-auto flex items-center gap-3">
              <button 
                onClick={() => isPlaying ? stopAudio() : currentAudioBuffer && playAudio(currentAudioBuffer)}
                disabled={!currentAudioBuffer}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${!currentAudioBuffer ? 'bg-gray-900 text-gray-700' : 'bg-gray-800 text-white shadow-md active:scale-95'}`}
              >
                {isPlaying ? (
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                ) : (
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>

              <button 
                onClick={handleDownload}
                disabled={!currentAudioBuffer}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${!currentAudioBuffer ? 'bg-gray-900 text-gray-700' : 'bg-gray-800 text-white shadow-md active:scale-95'}`}
                title="Download MP3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              <button 
                onClick={handleGenerate}
                disabled={status === 'generating'}
                className="flex-1 h-14 bg-purple-600 text-white font-black text-[11px] uppercase tracking-wider rounded-2xl shadow-lg active:scale-95 disabled:opacity-50 transition-all"
              >
                {status === 'generating' ? (lang === 'ar' ? 'معالجة...' : 'Working...') : t.generate_btn}
              </button>
           </div>
           {isPlaying && (
              <div className="absolute top-[-25px] left-0 right-0 px-10">
                 <AudioVisualizer isPlaying={true} />
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default App;
