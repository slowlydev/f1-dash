import { NextRequest, NextResponse } from "next/server";
import { MapType } from "../../../../types/map.type";

type Context = {
  params: {
    circuit: string | undefined;
  };
};

export async function GET(request: NextRequest, context: Context) {
  const circuit = context.params.circuit;

  if (!circuit) return new NextResponse("No circuit provided");

  const year = new Date().getFullYear();

  try {
    const mapRequest = await fetch(
      `https://api.multiviewer.app/api/v1/circuits/${circuit}/${year}`,
      { next: { revalidate: 20 } }
    );

    const map: MapType = await mapRequest.json();

    return NextResponse.json(map);
  } catch (_) {
    return new NextResponse("Failed to get map", { status: 500 });
  }
}
