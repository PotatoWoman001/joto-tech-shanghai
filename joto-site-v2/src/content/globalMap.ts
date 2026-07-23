export interface GlobalMapMarker {
  artworkOffsetX: number;
  cities: readonly string[];
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  region: string;
}

export interface ProjectedPoint {
  x: number;
  y: number;
}

const ART_MAP_EQUATOR_Y = 55;
const ART_MAP_LATITUDE_SCALE = 0.45;

export function projectCoordinates(latitude: number, longitude: number): ProjectedPoint {
  return {
    x: ((longitude + 180) / 360) * 100,
    // The supplied artwork includes extra polar breathing room, so its latitude
    // grid does not fill the image from +90° to -90°. These two anchors keep
    // real city coordinates aligned with the coastlines in this specific asset.
    y: Math.min(100, Math.max(0, ART_MAP_EQUATOR_Y - latitude * ART_MAP_LATITUDE_SCALE)),
  };
}

export function projectMarkerCoordinates(marker: GlobalMapMarker): ProjectedPoint {
  const point = projectCoordinates(marker.latitude, marker.longitude);

  return {
    // Small horizontal corrections compensate for coastline distortion in the
    // supplied artistic map while preserving the real longitude as the anchor.
    x: point.x + marker.artworkOffsetX,
    y: point.y,
  };
}

export const globalMapMarkers: readonly GlobalMapMarker[] = [
  {
    artworkOffsetX: -0.3,
    id: "beijing",
    region: "China",
    label: "Beijing",
    cities: ["Beijing"],
    latitude: 39.907,
    longitude: 116.397,
  },
  {
    artworkOffsetX: -0.9,
    id: "yangtze-river-delta",
    region: "China",
    label: "Yangtze River Delta",
    cities: ["Shanghai", "Suzhou"],
    latitude: 31.263,
    longitude: 121.027,
  },
  {
    artworkOffsetX: -0.2,
    id: "greater-bay-area",
    region: "China",
    label: "Greater Bay Area",
    cities: ["Shenzhen", "Hong Kong"],
    latitude: 22.412,
    longitude: 114.121,
  },
  {
    artworkOffsetX: -2.8,
    id: "tokyo",
    region: "Japan",
    label: "Tokyo",
    cities: ["Tokyo"],
    latitude: 35.69,
    longitude: 139.692,
  },
  {
    artworkOffsetX: -1.4,
    id: "bangkok",
    region: "Thailand",
    label: "Bangkok",
    cities: ["Bangkok"],
    latitude: 13.754,
    longitude: 100.501,
  },
  {
    artworkOffsetX: -1.6,
    id: "singapore",
    region: "Singapore",
    label: "Singapore",
    cities: ["Singapore"],
    latitude: 1.29,
    longitude: 103.85,
  },
  {
    artworkOffsetX: -2.8,
    id: "cupertino",
    region: "United States",
    label: "Cupertino",
    cities: ["Cupertino"],
    latitude: 37.323,
    longitude: -122.032,
  },
  {
    artworkOffsetX: -1,
    id: "sheridan",
    region: "United States",
    label: "Sheridan, Wyoming",
    cities: ["Sheridan"],
    latitude: 44.797,
    longitude: -106.956,
  },
  {
    artworkOffsetX: -3.8,
    id: "london",
    region: "United Kingdom",
    label: "London",
    cities: ["London"],
    latitude: 51.509,
    longitude: -0.126,
  },
];

export const globalMapHubId = "yangtze-river-delta";
