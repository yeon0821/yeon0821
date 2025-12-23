"use client";

import Loading from "@/components/Loading";
import StoreList from "@/components/StoreList";
import { LikeApiResponse, LikeInterface } from "@/interface";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";

function LikesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";

  const {
    data: likes,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [`likes-${page}`],
    queryFn: async () => {
      const { data } = await axios(`/api/likes?limit=10&page=${page}`);
      return data as LikeApiResponse;
    },
  });

  if (isError) {
    return (
      <div className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">
        다시 시도해주세요
      </div>
    );
  }

  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      <h3 className="text-lg font-semibold">찜한 맛집</h3>
      <div className="mt-1 text-gray-500 text-sm">찜한 가게 리스트입니다.</div>
      <ul role="list" className="divide-y divide-gray-100 mt-10">
        {isLoading ? (
          <Loading />
        ) : likes?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <p className="text-lg font-medium">찜한 가게가 없습니다</p>
            <p className="text-sm mt-1">마음에 드는 맛집을 찜해보세요!</p>
            <button
              onClick={() => router.push("/stores")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-red-600 transition"
            >
              맛집 둘러보기
            </button>
          </div>
        ) : (
          likes?.data.map((like: LikeInterface, index) => (
            <StoreList i={index} store={like.store} key={index} />
          ))
        )}
      </ul>
      <Pagination
        total={likes?.totalPage}
        page={page}
        pathname="/users/likes"
      />
    </div>
  );
}

export default function LikesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LikesContent />
    </Suspense>
  );
}
