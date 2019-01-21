import * as React from "react";
import axios from "axios";
import { RouteComponentProps } from "react-router-dom";
import { Feature, FeatureCollection } from "geojson";

const TOKEN =
  "pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg";

export interface IAppProps extends RouteComponentProps {
  onData: (data: FeatureCollection) => void;
}

export interface IAppState {}

export default class SearchURLHandler extends React.Component<
  IAppProps,
  IAppState
> {
  constructor(props: IAppProps) {
    super(props);
  }

  componentDidMount() {
    const queryParams = new URLSearchParams(this.props.location.search);
    const searchStr = queryParams.get("query");

    if (!searchStr) return;

    this.find(searchStr).then(data => {
      console.log("Geocoder data ", data);
      this.props.onData(data);
    });
  }

  async find(query: string): Promise<FeatureCollection> {
    const safeQuery = encodeURI(query);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${safeQuery}.json?access_token=${TOKEN}&limit=1`;
    const response = await axios.get(url);
    return response.data;
  }

  public render() {
    return null;
  }
}
