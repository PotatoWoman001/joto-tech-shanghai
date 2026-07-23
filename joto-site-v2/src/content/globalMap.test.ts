import { describe, expect, it } from "vitest";
import {
  globalMapMarkers,
  projectCoordinates,
  projectMarkerCoordinates,
} from "./globalMap";

describe("global map data", () => {
  it("projects real coordinates onto the calibrated artwork", () => {
    expect(projectCoordinates(0, 0)).toEqual({ x: 50, y: 55 });
    expect(projectCoordinates(90, -180)).toEqual({ x: 0, y: 14.5 });
    expect(projectCoordinates(-90, 180)).toEqual({ x: 100, y: 95.5 });

    const london = globalMapMarkers.find((marker) => marker.id === "london")!;
    const point = projectMarkerCoordinates(london);
    expect(point.x).toBeCloseTo(46.165, 2);
    expect(point.y).toBeCloseTo(31.821, 2);
  });

  it("uses honest clusters for cities that overlap at global scale", () => {
    const yangtze = globalMapMarkers.find((marker) => marker.id === "yangtze-river-delta")!;
    const bayArea = globalMapMarkers.find((marker) => marker.id === "greater-bay-area")!;

    expect(yangtze.cities).toEqual(["Shanghai", "Suzhou"]);
    expect(bayArea.cities).toEqual(["Shenzhen", "Hong Kong"]);
    expect(globalMapMarkers.filter((marker) => marker.region === "China")).toHaveLength(3);
    expect(globalMapMarkers).toHaveLength(9);
  });
});
