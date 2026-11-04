import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, 
  Maximize, Minimize, CheckCircle, Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VideoPlayerProps {
  title: string;
  videoUrl: string;
  youtubeUrl?: string;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onSeek: (time: number) => void;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onSaveProgress: () => void;
}

export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'html5' | 'embed';
  src: string;
  originalUrl: string;
}

/**
 * Extracts a valid YouTube 11-character video ID from any URL format
 */
export function extractYouTubeId(rawUrl?: string): string | null {
  if (!rawUrl) return null;
  const str = rawUrl.trim();
  if (!str) return null;

  // youtu.be/<id>
  const shortMatch = str.match(/(?:youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  // youtube.com/watch?v=<id>
  const watchMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // youtube.com/embed/<id>
  const embedMatch = str.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // general regex
  const genMatch = str.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (genMatch && genMatch[1]) return genMatch[1];

  return null;
}

/**
 * Robust parser for YouTube, Vimeo, Google Drive and direct MP4/WebM videos
 * Always ensures the player embeds and runs natively inside the platform!
 */
export function parseVideoSource(rawUrl?: string, secondaryUrl?: string): ParsedVideo {
  const cleanUrl = (u?: string) => {
    if (!u) return '';
    const trimmed = u.trim();
    if (trimmed === 'https://youtube.com' || trimmed === 'https://www.youtube.com' || trimmed === 'http://youtube.com') {
      return '';
    }
    return trimmed;
  };

  const primary = cleanUrl(secondaryUrl);
  const secondary = cleanUrl(rawUrl);
  const candidates = [primary, secondary].filter(Boolean);

  for (const url of candidates) {
    // 1. YouTube check: ID extraction
    const ytId = extractYouTubeId(url);
    if (ytId) {
      return {
        type: 'youtube',
        src: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`,
        originalUrl: url
      };
    }

    // 2. Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/i);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        type: 'vimeo',
        src: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`,
        originalUrl: url
      };
    }

    // 3. Google Drive preview
    if (url.includes('drive.google.com')) {
      const embedDrive = url.replace(/\/view(\?.*)?$/, '/preview');
      return {
        type: 'embed',
        src: embedDrive,
        originalUrl: url
      };
    }

    // 4. Direct video files or cloud storage URLs (.mp4, .webm, googleapis, etc.)
    if (url.match(/\.(mp4|webm|ogg|m4v)(\?.*)?$/i) || url.includes('commondatastorage.googleapis.com')) {
      return {
        type: 'html5',
        src: url,
        originalUrl: url
      };
    }
  }

  // Fallback to the first available URL or default sample video
  const fallback = candidates[0] || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const ytFallbackId = extractYouTubeId(fallback);
  if (ytFallbackId) {
    return {
      type: 'youtube',
      src: `https://www.youtube-nocookie.com/embed/${ytFallbackId}?autoplay=0&rel=0&modestbranding=1&playsinline=1`,
      originalUrl: fallback
    };
  }

  return {
    type: 'html5',
    src: fallback,
    originalUrl: fallback
  };
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  videoUrl,
  youtubeUrl,
  currentTime,
  onTimeUpdate,
  onSeek,
  isCompleted,
  onToggleComplete,
  onSaveProgress
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = parseVideoSource(videoUrl, youtubeUrl);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync seek requests from parent (e.g. clicking a note timestamp)
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 1.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    onTimeUpdate(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 720);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
    onSeek(targetTime);
  };

  const skipSeconds = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration || 1000);
    videoRef.current.currentTime = newTime;
    onSeek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
    }
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCompleteClick = () => {
    if (!isCompleted) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
      triggerToast('¡Clase completada! Progreso registrado en tu historial');
    }
    onToggleComplete();
  };

  const handleSaveClick = () => {
    onSaveProgress();
    triggerToast('Avance de lección guardado con éxito');
  };

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const isIframeMode = parsed.type === 'youtube' || parsed.type === 'vimeo' || parsed.type === 'embed';

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-2xl animate-fade-in border border-emerald-400">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Video Frame */}
      <div 
        ref={containerRef}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative aspect-video w-full rounded-2xl sm:rounded-3xl bg-black overflow-hidden shadow-2xl border border-slate-800/80 group"
      >
        {isIframeMode ? (
          /* Embedded Player (YouTube / Vimeo / Drive) playing natively inside the classroom */
          <iframe
            key={parsed.src}
            src={parsed.src}
            title={title}
            className="w-full h-full border-0 rounded-2xl sm:rounded-3xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          /* HTML5 Native Video Player */
          <>
            <video
              ref={videoRef}
              src={parsed.src}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={togglePlay}
              className="w-full h-full object-contain cursor-pointer"
              playsInline
            />

            {/* Ambient Play Overlay if paused */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-opacity"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/95 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/30 transform transition hover:scale-110 active:scale-95">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                </div>
              </div>
            )}

            {/* HTML5 Bottom Control Overlay */}
            <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
              {/* Progress Slider */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-mono text-emerald-400 select-none tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeekChange}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:h-2 transition-all"
                />
                <span className="text-[11px] font-mono text-slate-400 select-none tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Action Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-transform active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => skipSeconds(-10)}
                    title="Retroceder 10s"
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <button
                    onClick={() => skipSeconds(10)}
                    title="Adelantar 10s"
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition"
                  >
                    <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={toggleMute}
                      className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-12 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-2 relative">
                  {/* Speed Selector */}
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-2 py-1 text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md border border-slate-700/60"
                  >
                    {playbackSpeed}x
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-10 right-10 bg-slate-900 border border-slate-700 rounded-lg p-1 shadow-xl flex flex-col gap-1 z-20">
                      {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedSelect(speed)}
                          className={`px-3 py-1 text-xs rounded font-mono text-left transition ${
                            playbackSpeed === speed ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={toggleFullscreen}
                    aria-label="Pantalla completa"
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Top Watermark Badge: confirms it runs inside Sertecep virtual classroom */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/90 shadow-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wide text-white">Aula Virtual Sertecep</span>
            <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
              EN LÍNEA
            </span>
          </div>
        </div>
      </div>

      {/* Control Banner under video: Native completion & save actions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">
            Reproduciendo dentro del Aula Virtual
          </span>
          <span className="text-slate-500 hidden md:inline">· Progreso automático en tu cuenta</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleSaveClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl border border-slate-700/60 transition active:scale-98"
          >
            <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guardar avance</span>
          </button>

          <button
            onClick={handleCompleteClick}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all active:scale-98 ${
              isCompleted 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Completada ✓' : 'Marcar completada'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
