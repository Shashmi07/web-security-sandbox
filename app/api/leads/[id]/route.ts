
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { canAccessLead } from "@/lib/lead-access";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isValidId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

async function authorizeLead(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      response: NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      ),
    };
  }

  if (!isValidId(id)) {
    return {
      response: NextResponse.json(
        { message: "Lead not found." },
        { status: 404 }
      ),
    };
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .select("id, name, ownerId:owner_id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Lead lookup error:", error.code);

    return {
      response: NextResponse.json(
        { message: "Unable to retrieve lead." },
        { status: 500 }
      ),
    };
  }

  if (!lead) {
    return {
      response: NextResponse.json(
        { message: "Lead not found." },
        { status: 404 }
      ),
    };
  }

  const allowed = canAccessLead(user, {
    ownerId: lead.ownerId,
  });

  if (!allowed) {
    return {
      response: NextResponse.json(
        { message: "You cannot access this lead." },
        { status: 403 }
      ),
    };
  }

  return { user, lead };
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const result = await authorizeLead(id);

    if ("response" in result) {
      return result.response;
    }

    return NextResponse.json({
      lead: result.lead,
    });
  } catch {
    return NextResponse.json(
      { message: "Request failed." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const result = await authorizeLead(id);

    if ("response" in result) {
      return result.response;
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("name" in body) ||
      typeof body.name !== "string" ||
      !body.name.trim() ||
      body.name.trim().length > 200
    ) {
      return NextResponse.json(
        { message: "A valid lead name is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("leads")
      .update({ name: body.name.trim() })
      .eq("id", id)
      .select("id, name, ownerId:owner_id")
      .single();

    if (error || !data) {
      console.error("Lead update error:", error?.code);

      return NextResponse.json(
        { message: "Unable to update lead." },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead: data });
  } catch {
    return NextResponse.json(
      { message: "Invalid request." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const result = await authorizeLead(id);

    if ("response" in result) {
      return result.response;
    }

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Lead deletion error:", error.code);

      return NextResponse.json(
        { message: "Unable to delete lead." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Lead deleted successfully.",
    });
  } catch {
    return NextResponse.json(
      { message: "Request failed." },
      { status: 500 }
    );
  }
}
