/* eslint-disable @typescript-eslint/no-explicit-any */

import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const { sessionClaims } = await auth();
    if (!sessionClaims) {
      return Response.json({ error: "Unauthorized", step: "no_sessionClaims" }, { status: 401 });
    }

    const user = await currentUser();
    const orgIdFromClaims =
  typeof sessionClaims === "object" &&
  sessionClaims !== null &&
  "o" in sessionClaims &&
  typeof (sessionClaims as any).o === "object"
    ? (sessionClaims as any).o.id ?? null
    : null;

    console.log("orgIdFromClaim",orgIdFromClaims)

    if (!user) {
      return Response.json({ error: "Unauthorized", step: "no_user" }, { status: 401 });
    }

    const { room } = await req.json();
    if (!room) {
      return Response.json({ error: "Bad Request", step: "missing_room" }, { status: 400 });
    }

    console.log("Liveblocks auth room:", room);
    console.log("Clerk user id:", user.firstName);
    
    console.log("Org claim:", sessionClaims);

    const document = await convex.query(api.documents.getById, { id: room });

    if (!document) {
      return Response.json(
        { error: "Unauthorized", step: "document_not_found", room },
        { status: 401 }
      );
    }

    console.log("Document ownerId:", document);
    console.log("Document orgId:", document.organizationId);

    const isOwner = document.ownerId === user.id;
    

    const isOrganizationMember =
      !!document.organizationId &&
      document.organizationId === orgIdFromClaims;

    if (!isOwner && !isOrganizationMember) {
      return Response.json(
        {
          error: "Unauthorized",
          step: "permission_denied",
          isOwner,
          isOrganizationMember,
        },
        { status: 401 }
      );
    }

    const name =
      user.fullName ??
      user.primaryEmailAddress?.emailAddress ??
      "Anonymous";

    const hue =
      Math.abs(
        name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % 360;

    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name,
        avatar: user.imageUrl,
        color: `hsl(${hue}, 80%, 60%)`,
      },
    });

    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();
    return new Response(body, { status });
  } catch (err) {
    console.error("Liveblocks auth error:", err);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
