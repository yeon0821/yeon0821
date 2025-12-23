import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db";
import { CommentApiResponse } from "@/interface";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const storeId = searchParams.get("storeId") || "";
  const user = searchParams.get("user") === "true";

  const session = await getServerSession(authOptions);

  const skipPage = parseInt(page) - 1;
  const count = await prisma.comment.count({
    where: {
      storeId: storeId ? parseInt(storeId) : {},
      userId: user ? session?.user.id : {},
    },
  });

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      storeId: storeId ? parseInt(storeId) : {},
      userId: user ? session?.user.id : {},
    },
    skip: skipPage * parseInt(limit),
    take: parseInt(limit),
    include: {
      user: true,
      store: true,
    },
  });

  return NextResponse.json({
    data: comments,
    page: parseInt(page),
    totalPage: Math.ceil(count / parseInt(limit)),
  } as CommentApiResponse);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { storeId, body }: { storeId: number; body: string } = await req.json();
  const comment = await prisma.comment.create({
    data: {
      storeId,
      body,
      userId: session?.user.id,
    },
  });

  return NextResponse.json(comment);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!session?.user || !id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.comment.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json(result);
}
