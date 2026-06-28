import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'dummy_maps_key',
  version: 'weekly',
  libraries: ['places', 'geometry', 'marker']
});

export const initGoogleMaps = async () => {
  try {
    const google = await loader.load();
    return google;
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    throw error;
  }
};

export default loader;
