"use client";

import Map from "@/components/Map";
import Markers from "@/components/Markers";
import { StoreType } from "@/interface";
import StoreBox from "@/components/StoreBox";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CurrentLocationButton from "@/components/CurrentLocationButton";

export default function HomePage() {
  const fetchStore = async () => {
    const { data } = await axios("/api/stores");
    return data as StoreType[];
  };

  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: fetchStore,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Map />
      <Markers stores={stores || []} />
      <StoreBox />
      <CurrentLocationButton />
    </>
  );
}
