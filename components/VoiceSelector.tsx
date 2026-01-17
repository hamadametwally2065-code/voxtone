
import React from 'react';
import { Voice } from '../types';
import { VOICES } from '../constants';

interface VoiceSelectorProps {
  selectedVoice: Voice;
  onSelect: (voice: Voice) => void;
  lang?: 'ar' | 'en';
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onSelect, lang = 'ar' }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {VOICES.map((voice) => (
        <button
          key={voice.id}
          onClick={() => onSelect(voice)}
          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left flex flex-col gap-1 ${
            selectedVoice.id === voice.id
              ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Fix: Accessing language-specific name property based on lang prop */}
            <span className="font-bold text-lg text-white">{lang === 'ar' ? voice.nameAr : voice.nameEn}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${voice.gender === 'male' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'}`}>
              {voice.gender.toUpperCase()}
            </span>
          </div>
          {/* Fix: Accessing language-specific description property based on lang prop */}
          <p className="text-sm text-gray-400">{lang === 'ar' ? voice.descriptionAr : voice.descriptionEn}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {voice.traits.map(trait => (
              <span key={trait} className="text-[10px] bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded">
                {trait}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
};
