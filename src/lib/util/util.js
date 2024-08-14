// lib/util/locationUtils.js

export const getUserLocation = (onSuccess, onError) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onSuccess({ latitude, longitude });
        },
        (error) => {
          if (onError) {
            onError(error);
          } else {
            console.error('Error getting user location:', error);
          }
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  