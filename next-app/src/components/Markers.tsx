"use client";

import { currentStoreAtom, locationAtom, mapAtom } from "@/atom";
import { StoreType } from "@/interface";
import { useEffect, useCallback } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

interface MarkerProps {
  stores?: StoreType[];
}

export default function Markers({ stores }: MarkerProps) {
  const map = useAtomValue(mapAtom);
  const setCurrentStore = useSetAtom(currentStoreAtom);
  const [location, setLocation] = useAtom(locationAtom);

  const loadKakoMarkers = useCallback(() => {
    if (map) {
      stores?.map((store) => {
        const imageSrc = store?.category
          ? `/images/markers/${store?.category}.png`
          : "/images/markers/default.png",
          imageSize = new window.kakao.maps.Size(40, 40),
          imageOption = { offset: new window.kakao.maps.Point(27, 69) };

        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        const markerPosition = new window.kakao.maps.LatLng(
          store?.lat,
          store?.lng
        );

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });

        marker.setMap(map);

        const content = `<div class="infowindow">${store?.name}</div>`;

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
          xAnchor: 0.6,
          yAnchor: 0.91,
        });

        window.kakao.maps.event.addListener(marker, "mouseover", function () {
          customOverlay.setMap(map);
        });

        window.kakao.maps.event.addListener(marker, "mouseout", function () {
          customOverlay.setMap(null);
        });

        window.kakao.maps.event.addListener(marker, "click", function () {
          setCurrentStore(store);
          setLocation({
            ...location,
            lat: store.lat,
            lng: store.lng,
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, stores]);

  useEffect(() => {
    loadKakoMarkers();
  }, [loadKakoMarkers, map]);

  return <></>;
}
