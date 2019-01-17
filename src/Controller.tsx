import * as React from "react";
import { FeatureCollection } from "geojson";
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from "react-router-dom";

import SearchURLHandler from "./SearchURLHandler";
import MiniMap from "./MinimalMap";
import * as GeoHelper from "./GeoHelper";

export const NEW_FC: FeatureCollection = {
  type: "FeatureCollection",
  features: []
};

export interface IAppProps extends RouteComponentProps {}

export interface IAppState {
  geojson: FeatureCollection;
}

class Controller extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      geojson: NEW_FC
    };
  }

  public render() {
    // const geojson: FeatureCollection = {
    //   type: "FeatureCollection",
    //   features: [
    //     {
    //       type: "Feature",
    //       properties: {},
    //       geometry: {
    //         type: "Point",
    //         coordinates: [-73.99956058150504, 40.729652585995886]
    //       }
    //     }
    //   ]
    // };
    const { geojson } = this.state;

    const bbox = GeoHelper.bboxFromGeoJson(geojson);
    const newViewstate =
      geojson.features.length === 0
        ? GeoHelper.INITIAL_VIEWSTATE
        : {
            ...GeoHelper.INITIAL_VIEWSTATE,
            ...GeoHelper.bbox2Viewport(bbox)
          };
    return (
      <div>
        {geojson.features.length > 0 && (
          <MiniMap geojson={geojson} viewstate={newViewstate} />
        )}
        <Switch>
          <Route
            render={props => (
              <SearchURLHandler {...props} onData={this.onData} />
            )}
          />
        </Switch>
      </div>
    );
  }

  onData = (fc: FeatureCollection) => this.setState({ geojson: fc });
}

export default withRouter(Controller);
