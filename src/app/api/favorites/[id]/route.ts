import { NextRequest, NextResponse } from "next/server";
import { createServerClient, extractAccessToken } from "@/lib/supabase";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const authHeader = request.headers.get("Authorization");
  const accessToken = extractAccessToken(authHeader);
  const supabase = createServerClient(authHeader);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken ?? undefined);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId) || numericId <= 0) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  // .eq("user_id", user.id) provides defence-in-depth alongside the RLS policy
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", numericId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete favorite." }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
