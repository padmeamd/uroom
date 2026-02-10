import { useState, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Search, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export interface LocationData {
  lat: number;
  lng: number;
  label: string;
}

interface LocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendLocation: (location: LocationData) => void;
}

const DEFAULT_LAT = 40.7128;
const DEFAULT_LNG = -74.006;

export const LocationPicker = ({ open, onOpenChange, onSendLocation }: LocationPickerProps) => {
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [lng, setLng] = useState(DEFAULT_LNG);
  const [label, setLabel] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLabel('My Location');
        setIsLocating(false);
        toast.success('Location found!');
      },
      () => {
        setIsLocating(false);
        toast.error('Could not get your location');
      },
      { timeout: 10000 }
    );
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    // Simple geocoding simulation with well-known places
    const places: Record<string, { lat: number; lng: number }> = {
      'new york': { lat: 40.7128, lng: -74.006 },
      'london': { lat: 51.5074, lng: -0.1278 },
      'paris': { lat: 48.8566, lng: 2.3522 },
      'tokyo': { lat: 35.6762, lng: 139.6503 },
      'los angeles': { lat: 34.0522, lng: -118.2437 },
      'san francisco': { lat: 37.7749, lng: -122.4194 },
      'berlin': { lat: 52.52, lng: 13.405 },
      'sydney': { lat: -33.8688, lng: 151.2093 },
    };
    
    const key = searchQuery.toLowerCase().trim();
    const found = Object.entries(places).find(([k]) => key.includes(k));
    if (found) {
      setLat(found[1].lat);
      setLng(found[1].lng);
      setLabel(searchQuery.trim());
    } else {
      setLabel(searchQuery.trim());
      toast.info('Using custom label — adjust coordinates manually if needed');
    }
  }, [searchQuery]);

  const handleSend = () => {
    onSendLocation({
      lat,
      lng,
      label: label || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });
    // Reset
    setLabel('');
    setSearchQuery('');
    setLat(DEFAULT_LAT);
    setLng(DEFAULT_LNG);
    onOpenChange(false);
  };

  const mapPreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=600x300&maptype=roadmap&markers=color:green%7C${lat},${lng}&key=`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl border-t border-primary/30 bg-card max-h-[80vh] overflow-y-auto p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Share Location</SheetTitle>
        </SheetHeader>

        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="px-5 pb-2">
          <h2 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            Share Location
          </h2>
        </div>

        {/* Map preview using OpenStreetMap embed */}
        <div className="mx-5 mb-4 rounded-xl overflow-hidden border border-primary/30 relative">
          <iframe
            title="Location preview"
            width="100%"
            height="200"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02},${lat - 0.01},${lng + 0.02},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}
          />
          <div className="absolute bottom-2 right-2">
            <a
              href={osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono bg-background/80 backdrop-blur-sm px-2 py-1 rounded border border-border text-muted-foreground hover:text-primary transition-colors"
            >
              Open in Maps ↗
            </a>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 mb-3">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search a place..."
              className="bg-secondary/50 border-primary/30 focus:border-primary placeholder:text-muted-foreground/50 text-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearch}
              className="text-muted-foreground hover:text-primary shrink-0"
            >
              <Search size={18} />
            </Button>
          </div>
        </div>

        {/* Use my location */}
        <div className="px-5 mb-3">
          <Button
            variant="outline"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="w-full border-accent/30 text-accent hover:bg-accent/10 font-mono text-xs uppercase tracking-wider"
          >
            {isLocating ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Navigation size={16} className="mr-2" />}
            {isLocating ? 'Locating...' : 'Use My Location'}
          </Button>
        </div>

        {/* Coordinates display */}
        <div className="px-5 mb-3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-mono text-muted-foreground mb-1 block">LATITUDE</label>
            <Input
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
              className="bg-secondary/50 border-primary/30 text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-muted-foreground mb-1 block">LONGITUDE</label>
            <Input
              type="number"
              step="0.0001"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
              className="bg-secondary/50 border-primary/30 text-sm font-mono"
            />
          </div>
        </div>

        {/* Label */}
        <div className="px-5 mb-4">
          <label className="text-[10px] font-mono text-muted-foreground mb-1 block">LABEL</label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Meeting Point, Coffee Shop..."
            className="bg-secondary/50 border-primary/30 text-sm placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Send */}
        <div className="px-5 pb-6">
          <Button
            onClick={handleSend}
            className="w-full bg-primary text-primary-foreground font-mono uppercase tracking-wider hover:bg-primary/90"
          >
            <Send size={16} className="mr-2" />
            Drop Location
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
