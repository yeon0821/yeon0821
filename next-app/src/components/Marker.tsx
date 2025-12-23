"use client";

import { mapAtom } from "@/atom";
import { StoreType } from "@/interface";
import { useEffect, useCallback } from "react";
import { useAtomValue } from "jotai";

interface MarkerProps {
  store: StoreType;
}

export default function Marker({ store }: MarkerProps) {
  const map = useAtomValue(mapAtom);

  const loadKakoMarker = useCallback(() => {
    if (map && store) {
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

      const markerPosition = new window.kakao.maps.LatLng(store?.lat, store?.lng);

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
    }
  }, [map, store]);

  useEffect(() => {
    loadKakoMarker();
  }, [loadKakoMarker, map]);

  return <></>;
}
