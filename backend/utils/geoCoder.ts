import NodeGeocoder from 'node-geocoder';
import fetchAdapter from './fetchAdapter';

const options = {
  provider: "mapquest",
  apiKey: "Jdnj4kw1lGrcWwiGLDo107C7COulGPb2", // for Mapquest, OpenCage, APlace, Google Premier
  formatter: null,
  fetch: fetchAdapter.fetch
};

const geoCoder = NodeGeocoder(options)

export default geoCoder