'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { allContent } from '@/lib/data';
import type { Content } from '@/types';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, ThumbsDown, Zap, Volume2, VolumeX, Maximize, Pause, Play } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export default function WatchPage() {
  const params = useParams<{ type: string; slug: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Content | null>(null);
  const [recommendedContent, setRecommendedContent] = useState<Content[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const previousVolumeRef = useRef(1);

  useEffect(() => {
    const { type, slug } = params;
    const foundItem = allContent.find(
      (c) => c.type.toLowerCase() === type && c.slug === slug
    );
    if (foundItem) {
      setItem(foundItem);
      const recommended = allContent
        .filter((content) => content.type === foundItem.type && content.id !== foundItem.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
      setRecommendedContent(recommended);
    } else {
      router.push('/not-found');
    }
  }, [params, router]);

  // Video player setup and progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !item) return;

    // Load last position
    const savedTime = localStorage.getItem(`video-progress-${item.slug}`);
    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    }
    
    // Set initial volume
    video.volume = volume;

    // Save progress
    const handleTimeUpdate = () => {
      if (video.duration) {
        localStorage.setItem(`video-progress-${item.slug}`, video.currentTime.toString());
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    // Auto-pause on tab switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      }
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    video.onplay = () => setIsPlaying(true);
    video.onpause = () => setIsPlaying(false);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [item]);
  
  // Sync volume state with video element
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        video.volume = volume;
    }
  }, [volume])


  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
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
    if (newVolume > 0) {
        previousVolumeRef.current = newVolume;
    }
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
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * video.duration;
      
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => router.back()} className="hover:bg-white/10 text-white/80 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to details
          </Button>
        </div>

        <div className="relative aspect-video w-full max-w-5xl mx-auto bg-slate-900 rounded-lg overflow-hidden group shadow-2xl shadow-primary/20">
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            poster={item.imageUrl}
            controls={false}
            onClick={togglePlayPause}
            onDoubleClick={toggleFullscreen}
            preload="metadata"
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
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary shadow opacity-0 group-hover/progress:opacity-100 transition-opacity" 
                        style={{ left: `${progress}%` }}>
                      </div>
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
                            <Slider
                                value={[volume]}
                                max={1}
                                step={0.05}
                                onValueChange={handleVolumeChange}
                                className="w-0 group-hover/volume:w-24 transition-[width] duration-300 ease-in-out"
                            />
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

        <div className="max-w-5xl mx-auto mt-6 md:mt-8">
            <h1 className="text-2xl md:text-4xl font-bold font-headline">{item.title}</h1>
            <p className="mt-2 md:mt-4 text-base md:text-lg text-white/70">{item.description}</p>

            <div className="mt-6 md:mt-8 flex items-center gap-6 border-y border-white/10 py-6">
                <span className="font-semibold text-white/90">Did you like this {item.type}?</span>
                <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10 text-white/70 hover:text-white rounded-full">
                        <ThumbsUp />
                    </Button>
                     <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10 text-white/70 hover:text-white rounded-full">
                        <ThumbsDown />
                    </Button>
                </div>
            </div>

            <div className="mt-6 md:mt-8">
                <h3 className="flex items-center gap-3 text-xl font-bold font-headline">
                    <Zap className="text-primary"/>
                    Trivia
                </h3>
                <p className="mt-2 text-white/60">
                    Inception's famous spinning top scene left audiences debating its meaning for years. Director Christopher Nolan has said the most important part of the scene is that Cobb doesn't wait to see if it falls.
                </p>
            </div>
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
