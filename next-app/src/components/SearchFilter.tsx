"use client";

import { AiOutlineSearch } from "react-icons/ai";
import { DISTRICT_ARR } from "@/data/store";
import { useAtom } from "jotai";
import { searchAtom } from "@/atom";

export default function SearchFilter() {
  const [search, setSearch] = useAtom(searchAtom);

  return (
    <div className="flex flex-col md:flex-row gap-2 my-4">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <AiOutlineSearch className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="search"
          onChange={(e) => setSearch({ ...search, q: e.target.value })}
          placeholder="음식점 검색"
          className="block w-full p-3 pl-10 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 outline-none focus:border-blue-500"
        />
      </div>
      <select
        onChange={(e) => setSearch({ ...search, district: e.target.value })}
        className="bg-gray-50 border border-gray-300 text-gray-800 text-sm md:max-w-[200px] rounded-lg focus:border-blue-500 outline-none block w-full p-3"
      >
        <option value="">지역 선택</option>
        {DISTRICT_ARR.map((data) => (
          <option value={data} key={data}>
            {data}
          </option>
        ))}
      </select>
    </div>
  );
}
