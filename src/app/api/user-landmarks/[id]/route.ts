import { NextRequest, NextResponse } from "next/server";
import { createServerClient, extractAccessToken } from "@/lib/supabase";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

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

  // Verify the landmark belongs to the user before deleting
  const { data: landmark, error: fetchError } = await supabase
    .from("user_landmarks")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !landmark) {
    return NextResponse.json({ error: "Landmark not found." }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from("user_landmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json({ error: "Failed to delete landmark." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
