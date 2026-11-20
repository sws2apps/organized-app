export type MapPosition = { latitude: number; longitude: number };
type Locator = () => Promise<MapPosition>;
let nativeLocator: Locator | undefined;
export const registerMapLocator = (locator: Locator) => {
  nativeLocator = locator;
};
export const locateMap: Locator = () => {
  if (nativeLocator) return nativeLocator();
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location unavailable'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve(coords),
      reject,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  });
};
