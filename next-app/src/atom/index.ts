import { atom } from "jotai";
import { LocationType, SearchType, StoreType } from "@/interface";

const DEFAULT_LAT = "37.497625203";
const DEFAULT_LNG = "127.03088379";
const DEFAULT_ZOOM = 3;

export const mapAtom = atom<any>(null);

export const currentStoreAtom = atom<StoreType | null>(null);

export const locationAtom = atom<LocationType>({
  lat: DEFAULT_LAT,
  lng: DEFAULT_LNG,
  zoom: DEFAULT_ZOOM,
});

export const searchAtom = atom<SearchType | null>(null);