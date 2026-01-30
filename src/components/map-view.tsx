'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarWash } from '@/lib/types';
import L from 'leaflet';
import { useTheme } from 'next-themes';
import Link from 'next/link';

// Fix for default icon issue with webpack
const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export function MapView({
  carWashes,
  userLocation,
}: {
  carWashes: CarWash[];
  userLocation: { latitude: number; longitude: number } | null;
}) {
  const { theme } = useTheme();
  const mapCenter: L.LatLngExpression = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [-23.55052, -46.633308]; // Default to São Paulo

  const tileLayerUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileLayerAttribution = theme === 'dark'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa dos Lava-rápidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full overflow-hidden rounded-lg">
          <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution={tileLayerAttribution}
              url={tileLayerUrl}
              key={theme} // Re-render tile layer on theme change
            />
            {userLocation && (
              <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
                <Popup>Você está aqui.</Popup>
              </Marker>
            )}
            {carWashes.map(wash => (
              <Marker key={wash.id} position={[wash.coordinates.lat, wash.coordinates.lng]} icon={icon}>
                <Popup>
                  <div className="font-bold">{wash.name}</div>
                  <div>{wash.address}</div>
                  <Link href={`/carwash/${wash.id}`} className="text-primary hover:underline">
                    Ver detalhes
                  </Link>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
