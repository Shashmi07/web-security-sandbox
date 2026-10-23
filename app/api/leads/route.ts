import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { leadSchema } from "@/lib/lead-schema";
import { serverError } from "@/lib/api-handler";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const parsed = leadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid lead data." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("leads")
      .insert({ ...parsed.data, owner_id: user.id })
      .select("id, name, email, phone, status, ownerId:owner_id")
      .single();

    if (error || !data) {
      if (error) {
        console.error("Lead creation database error:", error.code);
      }
      return NextResponse.json(
        { message: "Unable to create lead." },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead: data }, { status: 201 });
  } catch (error) {
    return serverError(error, "Lead creation request error");
  }
}
