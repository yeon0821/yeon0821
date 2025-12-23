import { NextRequest, NextResponse } from "next/server";
import { StoreApiResponse, StoreType } from "@/interface";
import prisma from "@/db";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "";
  const limit = searchParams.get("limit") || "";
  const q = searchParams.get("q") || "";
  const district = searchParams.get("district") || "";
  const id = searchParams.get("id") || "";

  const session = await getServerSession(authOptions);

  if (page) {
    const count = await prisma.store.count();
    const skipPage = parseInt(page) - 1;
    const stores = await prisma.store.findMany({
      orderBy: { id: "asc" },
      where: {
        name: q ? { contains: q } : {},
        address: district ? { contains: district } : {},
      },
      take: parseInt(limit),
      skip: skipPage * 10,
    });

    return NextResponse.json({
      page: parseInt(page),
      data: stores,
      totalCount: count,
      totalPage: Math.ceil(count / 10),
    } as StoreApiResponse);
  } else {
    const stores = await prisma.store.findMany({
      orderBy: { id: "asc" },
      where: {
        id: id ? parseInt(id) : {},
      },
      include: {
        likes: {
          where: session ? { userId: session.user.id } : {},
        },
      },
    });

    return NextResponse.json(id ? stores[0] : stores);
  }
}


export async function POST(req: NextRequest) {
  const formData = await req.json();
  const headers = {
    Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
  };

  const { data } = await axios.get(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
      formData.address
    )}`,
    { headers }
  );

  const result = await prisma.store.create({
    data: { ...formData, lat: data.documents[0].y, lng: data.documents[0].x },
  });

  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  const formData = await req.json();
  const headers = {
    Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
  };

  const { data } = await axios.get(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
      formData.address
    )}`,
    { headers }
  );

  const result = await prisma.store.update({
    where: { id: formData.id },
    data: { ...formData, lat: data.documents[0].y, lng: data.documents[0].x },
  });

  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const result = await prisma.store.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(result);
  }
  return NextResponse.json(null, { status: 500 });
}
