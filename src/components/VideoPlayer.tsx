import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, 
  Maximize, Minimize, Youtube, CheckCircle, Bookmark, Settings
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

const getYouTubeEmbedUrl = (url?: string): string | null => {
  if (!url) return null;
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&enablejsapi=1` : null;
};

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

  const youtubeEmbed = getYouTubeEmbedUrl(youtubeUrl || (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? videoUrl : undefined));
  const [useYouTubeMode, setUseYouTubeMode] = useState<boolean>(Boolean(youtubeEmbed));
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (youtubeEmbed) {
      setUseYouTubeMode(true);
    }
  }, [youtubeEmbed]);

  // Sync seek requests from parent (e.g. clicking a note)
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
    setDuration(videoRef.current.duration || 732);
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
      triggerToast('¡Clase completada! Progreso actualizado con éxito');
    }
    onToggleComplete();
  };

  const handleSaveClick = () => {
    onSaveProgress();
    triggerToast('Avance guardado automáticamente en el servidor');
  };

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const openYouTube = () => {
    window.open(youtubeUrl || 'https://youtube.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-500/90 text-slate-950 font-medium px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-lg animate-fade-in border border-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Video Frame */}
      <div 
        ref={containerRef}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-2xl border border-slate-800/80 group"
      >
        {useYouTubeMode && youtubeEmbed ? (
          <iframe
            src={youtubeEmbed}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={togglePlay}
              className="w-full h-full object-contain cursor-pointer"
              playsInline
            />

            {/* Ambient Big Play Overlay if paused */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-opacity"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/30 transform transition hover:scale-110">
                  <Play className="w-9 h-9 fill-current ml-1" />
                </div>
              </div>
            )}
          </>
        )}

        {/* Top Video Header: Watermark & YouTube Switcher */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-white">Sertecep Amazónico</span>
          </div>

          {youtubeEmbed && (
            <button
              onClick={() => setUseYouTubeMode(!useYouTubeMode)}
              className="pointer-events-auto px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700 hover:text-white flex items-center gap-1.5 shadow"
            >
              <Youtube className="w-3.5 h-3.5 text-red-400" />
              <span>{useYouTubeMode ? 'Ver en HTML5' : 'Ver en YouTube'}</span>
            </button>
          )}
        </div>

        {/* Bottom Control Overlay */}
        <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress Slider */}
          <div className="flex items-center gap-3 mb-2 group/slider">
            <span className="text-xs font-mono text-emerald-400 select-none tabular-nums">
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
            <span className="text-xs font-mono text-slate-400 select-none tabular-nums">
              {formatTime(duration)}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                className="w-9 h-9 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => skipSeconds(-10)}
                title="Retroceder 10s"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => skipSeconds(10)}
                title="Adelantar 10s"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
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
      </div>

      {/* Control Banner matching screenshot: Abrir en YouTube & Acciones */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Visualización flexible:</span>
            <span className="hidden sm:inline ml-1">Puedes ver la lección en el aula o abrirla en reproductor externo.</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {youtubeUrl && (
            <button
              onClick={openYouTube}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600/90 hover:bg-red-500 rounded-lg transition-colors shadow-sm"
            >
              <Youtube className="w-3.5 h-3.5" />
              Abrir en YouTube
            </button>
          )}

          <button
            onClick={handleSaveClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700/60 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
            Guardar avance
          </button>

          <button
            onClick={handleCompleteClick}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isCompleted 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {isCompleted ? 'Completada ✓' : 'Marcar completada'}
          </button>
        </div>
      </div>
    </div>
  );
};
