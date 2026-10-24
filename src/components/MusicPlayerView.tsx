import React from 'react';
import { AudioSystemState, MusicTrack } from '../types';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Headphones,
  Radio,
  Smartphone,
  Repeat,
  Shuffle,
  Music2,
  Sliders
} from 'lucide-react';
import { formatSeconds } from '../utils/telemetry';

interface MusicPlayerViewProps {
  audioState: AudioSystemState;
  playlist: MusicTrack[];
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSelectTrack: (track: MusicTrack) => void;
  onChangeVolume: (vol: number) => void;
  onToggleMute: () => void;
  onSetOutputDevice: (device: AudioSystemState['outputDevice']) => void;
  onSeek: (seconds: number) => void;
  compact?: boolean;
}

export const MusicPlayerView: React.FC<MusicPlayerViewProps> = ({
  audioState,
  playlist,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSelectTrack,
  onChangeVolume,
  onToggleMute,
  onSetOutputDevice,
  onSeek,
  compact = false
}) => {
  const { currentTrack, isPlaying, currentTimeSeconds, volumePercent, isMuted, outputDevice, intercomModel } = audioState;
  const progressRatio = currentTrack.durationSeconds > 0 ? (currentTimeSeconds / currentTrack.durationSeconds) * 100 : 0;

  return (
    <div className={`w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between shadow-xl ${compact ? 'py-3' : 'p-5'}`}>
      {/* Top Bar: Audio Output Routing Indicator */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Music2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Now Playing on KOVE 800X GT
          </span>
        </div>

        {/* Output Selector Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSetOutputDevice('helmet_intercom')}
            title="Route audio to Helmet Intercom"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              outputDevice === 'helmet_intercom'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Helmet Intercom</span>
            <span className="sm:hidden">Helmet</span>
          </button>

          <button
            onClick={() => onSetOutputDevice('kove_speakers')}
            title="Route to Motorcycle Fairing Audio"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              outputDevice === 'kove_speakers'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">KOVE Speakers</span>
            <span className="sm:hidden">Bike</span>
          </button>

          <button
            onClick={() => onSetOutputDevice('phone_speaker')}
            title="Route to Samsung S23 Speaker"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              outputDevice === 'phone_speaker'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Galaxy S23</span>
            <span className="sm:hidden">Phone</span>
          </button>
        </div>
      </div>

      {/* Main Track Info & Artwork */}
      <div className={`flex items-center gap-4 py-4 ${compact ? 'py-2' : ''}`}>
        {/* Album Artwork with vinyl spin badge */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700/80 shadow-2xl shrink-0">
          <img
            src={currentTrack.albumArtUrl}
            alt={currentTrack.album}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100 opacity-80'}`}
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end justify-center pb-1">
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 bg-emerald-400 animate-pulse h-2 rounded-full" />
                <span className="w-1 bg-emerald-400 animate-pulse h-3 rounded-full delay-75" />
                <span className="w-1 bg-emerald-400 animate-pulse h-1.5 rounded-full delay-150" />
              </div>
            </div>
          )}
        </div>

        {/* Track Title, Artist, Helmet Route Info */}
        <div className="flex-1 min-w-0">
          <div className="text-lg sm:text-xl font-extrabold text-white truncate tracking-tight">
            {currentTrack.title}
          </div>
          <div className="text-sm font-semibold text-emerald-400 truncate">
            {currentTrack.artist}
          </div>
          <div className="text-xs text-slate-400 truncate mt-0.5">
            {currentTrack.album}
          </div>

          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              A2DP HD 48kHz
            </span>
            <span>·</span>
            <span className="text-cyan-400 font-medium truncate">
              {outputDevice === 'helmet_intercom' ? intercomModel : 'External Speaker'}
            </span>
          </div>
        </div>
      </div>

      {/* Scrubber Progress Bar */}
      <div className="w-full space-y-1.5 py-1">
        <div
          className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newRatio = clickX / rect.width;
            onSeek(newRatio * currentTrack.durationSeconds);
          }}
        >
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all"
            style={{ width: `${progressRatio}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>{formatSeconds(currentTimeSeconds)}</span>
          <span>-{formatSeconds(Math.max(0, currentTrack.durationSeconds - currentTimeSeconds))}</span>
        </div>
      </div>

      {/* Large Motorcycle Glove-Friendly Playback Controls */}
      <div className="flex items-center justify-between gap-3 pt-3">
        {/* Highway Wind Boost Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onChangeVolume(volumePercent >= 100 ? 75 : 100)}
            title="Highway Wind Audio Boost (100%)"
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              volumePercent >= 100
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            WIND BOOST
          </button>
        </div>

        {/* Central Transport Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onPrevTrack}
            aria-label="Previous Track"
            className="w-14 h-14 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-200 rounded-2xl flex items-center justify-center shadow-lg transition-all"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 active:scale-95 text-slate-950 font-black rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-all"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-slate-950" /> : <Play className="w-7 h-7 fill-slate-950 ml-0.5" />}
          </button>

          <button
            onClick={onNextTrack}
            aria-label="Next Track"
            className="w-14 h-14 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-200 rounded-2xl flex items-center justify-center shadow-lg transition-all"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="w-11 h-11 bg-slate-800/80 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-300 rounded-xl flex items-center justify-center transition-all"
          >
            {isMuted || volumePercent === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volumePercent}
            onChange={(e) => onChangeVolume(Number(e.target.value))}
            aria-label="Volume slider"
            className="w-20 sm:w-24 accent-emerald-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Glove Quick Playlist Strip */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Touring Playlist
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {playlist.map((track) => {
            const isCurrent = track.id === currentTrack.id;
            return (
              <button
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                  <img src={track.albumArtUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{track.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{track.artist}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
