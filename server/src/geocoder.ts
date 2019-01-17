import axio from "axios";

const TOKEN = process.env.MAPBOX_TOKEN;

if (!TOKEN) {
  console.log("Missing MAPBOX_KEY env");
  process.exit(1);
}

async function find(query: string) {
  const safeQuery = encodeURI(query);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${safeQuery}.json?access_token=${TOKEN}&limit=1`;
  const response = await axio.get(url);
  return response.data;
}

export default find;
