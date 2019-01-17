import bbox from "@turf/bbox";
import { FeatureCollection, Feature } from "geojson";
import { LatLng, Bbox0 } from "./types/CustomMapTypes";
import * as ViewportUtils from "viewport-mercator-project";

const uuidv1 = require("uuid/v1");

export const DEFAULT_LATLNG: LatLng = {
  latitude: 37.7577,
  longitude: -122.4376
};

export const NEW_FC = (): FeatureCollection => ({
  type: "FeatureCollection",
  features: []
});

export const INITIAL_VIEWSTATE = {
  altitude: 0,
  width: window.innerWidth,
  height: window.innerHeight,
  zoom: 14,
  pitch: 40,
  ...DEFAULT_LATLNG
};

export const bboxFromGeoJson = (geojson: FeatureCollection): Bbox0 => {
  if (geojson.features.length === 0)
    return [
      -122.517910874663,
      37.6044780500533,
      -122.354995082683,
      37.8324430069081
    ];
  if (
    geojson.features.length === 1 &&
    geojson.features[0].geometry.type === "Point"
  ) {
    const f0: Feature = geojson.features[0];
    if (f0.bbox) {
      // use bbox if it exists
      const _b = f0.bbox;
      return [_b[0], _b[1], _b[2], _b[3]];
    }
    //turn a single point into a buffered box
    const point = geojson.features[0].geometry.coordinates;
    return [
      point[0] - 0.005,
      point[1] - 0.005,
      point[0] + 0.005,
      point[1] + 0.005
    ];
  }

  const _bbox = bbox(geojson);
  return [_bbox[0], _bbox[1], _bbox[2], _bbox[3]];
};

export const bbox2Viewport = (bbox: Bbox0) => {
  console.log("bbox ", bbox);
  const width = window.innerWidth;
  const height = window.innerHeight;
  return ViewportUtils.fitBounds({
    width: width,
    height: height,
    bounds: [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
    padding: 100
  });
};
