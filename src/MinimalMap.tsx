import * as React from "react";
import DeckGL from "deck.gl";
import { StaticMap } from "react-map-gl";
import { FeatureCollection } from "geojson";

import PandaGL from "./PandaGL";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg";

export interface IAppProps {
  geojson: FeatureCollection;
  mapStyle?: string;
  viewstate: any;
}

export interface IAppState {}

export default class MinimalMap extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { viewstate, geojson, mapStyle } = this.props;
    const _mapStyleStr = mapStyle ? mapStyle : "light-v9";

    const layers = new PandaGL({ id: "panda-1", data: geojson.features });
    return (
      <div className="mapng-container">
        <DeckGL
          initialViewState={viewstate}
          {...this.props.viewstate}
          layers={layers}
          //   controller={{
          //     type: MapController,
          //     dragRotate: false,
          //     doubleClickZoom: false
          //   }}
        >
          <StaticMap
            reuseMaps
            mapStyle={`mapbox://styles/mapbox/${_mapStyleStr}`}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
      </div>
    );
  }
}
