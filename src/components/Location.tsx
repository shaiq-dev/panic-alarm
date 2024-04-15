"use client";

import Map, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Title, Text, Flex, Stack, Button, Select, Box } from "@mantine/core";
import { FaLocationDot } from "react-icons/fa6";

export const Location = () => {
  const [lat, lng] = [12.972442, 77.580643];
  return (
    <Stack py="var(--default-section-gap)" gap={0}>
      <Title order={3} fw={500}>
        Location
      </Title>
      <Text size="sm" c="dimmed" maw={400}>
        Realtime location of the watch. Accurate upto 10 meters.{" "}
        <a
          className="link bold"
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}`}
        >
          Get Directions
        </a>
      </Text>
      <Box h={380} mt="var(--default-gap)">
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          // style={classes.mapStyle}
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
          </Marker>
        </Map>
      </Box>
    </Stack>
  );
};
