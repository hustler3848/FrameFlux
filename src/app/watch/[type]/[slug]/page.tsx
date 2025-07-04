
'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getContentBySlug, getInitialContent } from '@/lib/actions';
import type { Content, Episode, Season } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, ThumbsDown, Volume2, VolumeX, Maximize, Pause, Play, Clapperboard, Layers } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ContentCard } from '@/components/content-card';


function EpisodePlaylist({ item, currentEpisode }: { item: Content, currentEpisode: Episode | null }) {
    const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        if (item.seasons && item.seasons.length > 0) {
            const seasonOfCurrentEp = item.seasons.find(s => s.episodes.some(e => e.episode_number === currentEpisode?.episode_number && s.season_number === currentEpisode?.season_number));
            setSelectedSeason(seasonOfCurrentEp || item.seasons[0]);
        }
    }, [item.seasons, currentEpisode]);

    const handleSeasonChange = (seasonNumber: string) => {
        const newSeason = item.seasons?.find(s => s.season_number.toString() === seasonNumber);
        if (newSeason) {
            setSelectedSeason(newSeason);
            // Optional: navigate to the first episode of the new season automatically
            const firstEpisode = newSeason.episodes[0];
            if (firstEpisode) {
                 router.push(`/watch/${item.type.toLowerCase()}/${item.slug}?season=${newSeason.season_number}&episode=${firstEpisode.episode_number}`);
            }
        }
    };

    if (!item.seasons || item.seasons.length === 0 || !selectedSeason) {
        return null;
    }

    return (
        <div className="bg-slate-900/50 rounded-lg border border-white/10 h-full flex flex-col">
            <div className='p-4 border-b border-white/10'>
                <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                    <Layers /> Episodes
                </h3>
                {item.seasons.length > 1 && (
                    <Select
                        value={selectedSeason.season_number.toString()}
                        onValueChange={handleSeasonChange}
                    >
                        <SelectTrigger className="mt-4 w-full bg-slate-800 border-slate-700 focus:ring-primary">
                            <SelectValue placeholder="Select a season" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            {item.seasons.map(season => (
                                <SelectItem key={season.season_number} value={season.season_number.toString()} className="focus:bg-primary/20 hover:text-white focus:text-white">
                                    {season.name} ({season.episode_count} Episodes)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
            
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {selectedSeason.episodes.map(episode => (
                        <Link
                            key={episode.episode_number}
                            href={`/watch/${item.type.toLowerCase()}/${item.slug}?season=${selectedSeason.season_number}&episode=${episode.episode_number}`}
                            className={cn(
                                "block p-3 rounded-md hover:bg-white/10",
                                currentEpisode?.episode_number === episode.episode_number && currentEpisode?.season_number === selectedSeason.season_number && "bg-primary/20 hover:bg-primary/30"
                            )}
                        >
                            <p className="font-semibold text-white/90">
                                Episode {episode.episode_number}: {episode.name}
                            </p>
                            <p className="text-sm text-white/60 mt-1 line-clamp-2">
                                {episode.overview}
                            </p>
                             {episode.runtime > 0 && (
                                <p className="text-xs text-white/40 mt-2">{episode.runtime} min</p>
                             )}
                        </Link>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

export default function WatchPage() {
  const params = useParams<{ type: string; slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [item, setItem] = useState<Content | null>(null);
  const [recommendedContent, setRecommendedContent] = useState<Content[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const previousVolumeRef = useRef(1);

  // Fetch content details
  useEffect(() => {
    const fetchItem = async () => {
        const slug = params.slug;
        if (typeof slug !== 'string') return;
        
        const foundItem = await getContentBySlug(slug);

        if (foundItem) {
          setItem(foundItem);
          const recommended = await getInitialContent();
          setRecommendedContent(recommended.filter(rec => rec.id !== foundItem.id && rec.type === foundItem.type).slice(0, 10));
        } else {
          router.push('/not-found');
        }
    };
    if(params.slug) {
        fetchItem();
    }
  }, [params, router]);

  const currentEpisode = useMemo((): (Episode & { season_number: number }) | null => {
    if (!item || item.type === 'Movie') return null;

    const seasonNum = parseInt(searchParams.get('season') || '1', 10);
    const episodeNum = parseInt(searchParams.get('episode') || '1', 10);

    const season = item.seasons?.find(s => s.season_number === seasonNum);
    const episode = season?.episodes.find(e => e.episode_number === episodeNum);
    
    // If specific episode not found, default to S01E01
    if (season && episode) {
        return { ...episode, season_number: season.season_number };
    }

    const firstSeason = item.seasons?.[0];
    const firstEpisode = firstSeason?.episodes?.[0];
    if (firstSeason && firstEpisode) {
        return { ...firstEpisode, season_number: firstSeason.season_number };
    }
    
    return null;

  }, [item, searchParams]);


  // Video player setup and progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !item) return;

    const progressKey = currentEpisode 
        ? `video-progress-${item.slug}-${currentEpisode.season_number}-${currentEpisode.episode_number}`
        : `video-progress-${item.slug}`;

    const savedTime = localStorage.getItem(progressKey);
    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    } else {
      video.currentTime = 0;
    }
    
    video.volume = volume;

    const handleTimeUpdate = () => {
      if (video.duration) {
        localStorage.setItem(progressKey, video.currentTime.toString());
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleVisibilityChange = () => { if (document.hidden) video.pause(); };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    video.onplay = () => setIsPlaying(true);
    video.onpause = () => setIsPlaying(false);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [item, currentEpisode]);
  
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.volume = volume;
  }, [volume])


  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) video.paused ? video.play() : video.pause();
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current?.parentElement;
    if (videoContainer) {
      if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(err => {
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };


  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0) previousVolumeRef.current = newVolume;
  };

  const toggleMute = () => {
    if (volume > 0) {
      previousVolumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(previousVolumeRef.current > 0 ? previousVolumeRef.current : 1);
    }
  };
  
  const handleProgressSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;

      const progressWrapper = e.currentTarget;
      const rect = progressWrapper.getBoundingClientRect();
      const newTime = ((e.clientX - rect.left) / rect.width) * video.duration;
      
      video.currentTime = newTime;
      setProgress((newTime / video.duration) * 100);
  }

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isSeries = item.type !== 'Movie';

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => router.push(`/${item.type.toLowerCase()}/${item.slug}`)} className="hover:bg-white/10 text-white/80 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to details
          </Button>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
            <div className={cn("w-full", isSeries ? "lg:col-span-8 xl:col-span-9" : "lg:col-span-12")}>
                <div className="relative aspect-video w-full bg-slate-900 rounded-lg overflow-hidden group shadow-2xl shadow-primary/20">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain bg-black"
                        poster={item.imageUrl}
                        controls={false}
                        onClick={togglePlayPause}
                        onDoubleClick={toggleFullscreen}
                        preload="metadata"
                        key={currentEpisode ? `${currentEpisode.season_number}-${currentEpisode.episode_number}` : item.id}
                    >
                        <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus-within:opacity-100 data-[playing=false]:opacity-100" data-playing={isPlaying}>
                        <Button variant="ghost" size="icon" className="w-20 h-20 hover:bg-white/10 rounded-full" onClick={togglePlayPause}>
                            {isPlaying ? <Pause className="w-10 h-10"/> : <Play className="w-10 h-10 fill-white"/>}
                        </Button>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                        <div 
                            className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group/progress hover:h-2 transition-all"
                            onClick={handleProgressSeek}
                        >
                            <div className="h-full bg-white/40 rounded-full relative">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
                                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary shadow opacity-0 group-hover/progress:opacity-100 transition-opacity" style={{ left: `${progress}%` }}></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-white/90">
                            <div className="flex items-center gap-2 md:gap-4">
                                <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full" onClick={togglePlayPause}>
                                    {isPlaying ? <Pause className="w-6 h-6"/> : <Play className="w-6 h-6 fill-white"/>}
                                </Button>
                                <div className="flex items-center gap-2 group/volume">
                                    <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full" onClick={toggleMute}>
                                    {volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                    </Button>
                                    <Slider value={[volume]} max={1} step={0.05} onValueChange={handleVolumeChange} className="w-0 group-hover/volume:w-24 transition-[width] duration-300 ease-in-out" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4">
                                <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full" onClick={toggleFullscreen}>
                                    <Maximize className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 md:mt-8">
                    <h1 className="text-2xl md:text-4xl font-bold font-headline">
                      {isSeries && currentEpisode ? `S${currentEpisode.season_number} E${currentEpisode.episode_number}: ${currentEpisode.name}` : item.title}
                    </h1>
                     <p className="mt-2 md:mt-4 text-base md:text-lg text-white/70">
                       {isSeries && currentEpisode ? currentEpisode.overview : item.description}
                     </p>

                    <div className="mt-6 md:mt-8 flex items-center gap-6 border-y border-white/10 py-6">
                        <span className="font-semibold text-white/90">Did you like this {item.type}?</span>
                        <div className="flex gap-4">
                            <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10 text-white/70 hover:text-white rounded-full"><ThumbsUp /></Button>
                            <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10 text-white/70 hover:text-white rounded-full"><ThumbsDown /></Button>
                        </div>
                    </div>
                </div>
            </div>
            
            {isSeries && (
                <div className="lg:col-span-4 xl:col-span-3">
                   {item.seasons && item.seasons.length > 0 ? (
                       <EpisodePlaylist item={item} currentEpisode={currentEpisode} />
                    ) : (
                       <div className="bg-slate-900/50 rounded-lg border border-white/10 h-full flex flex-col items-center justify-center p-8 text-center">
                          <h3 className="text-xl font-bold font-headline">Episode Data Unavailable</h3>
                          <p className="text-white/70 mt-2">
                              Detailed season and episode information could not be loaded. This may require a TMDb API key to be configured in the deployment environment.
                          </p>
                       </div>
                   )}
                </div>
            )}
        </div>
      </main>
      
      <section className="py-12 md:py-16 bg-slate-900/50 border-t border-white/10">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="text-3xl font-headline font-bold mb-8 text-white">
              Related For You
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {recommendedContent.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </div>
      </section>
    </div>
  );
}
