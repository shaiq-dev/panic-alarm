"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { FaLocationDot } from "react-icons/fa6";
import Map, { Marker, NavigationControl } from "react-map-gl";

export const Location = () => {
  const [lat, lng] = [12.972442, 77.580643];
  return (
    <section className="flex flex-col py-10">
      <h3 className="heading">Location</h3>
      <span className="text-sm text-dimmed max-w-[400px]">
        Realtime location of the watch. Accurate upto 10 meters.
        <br />
        <a
          className="link font-normal"
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}`}
        >
          Get Directions
        </a>
      </span>
      <div className="mt-4 h-96">
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          initialViewState={{
            latitude: 12.972442,
            longitude: 77.580643,
            zoom: 15,
          }}
          maxZoom={18}
          minZoom={5}
          reuseMaps
        >
          <NavigationControl position="bottom-right" />
          <Marker latitude={12.972442} longitude={77.580643} anchor="bottom">
            <FaLocationDot size={32} color="var(--color-red)" />
            <div className="marker-pulse" />
          </Marker>
        </Map>
      </div>
    </section>
  );
};
