import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NextResponse } from "next/server";
import type { ActiveOrder } from "@coconea/types";

function getSharedStorePath(): { dir: string; file: string } {
  const repoRoot = existsSync(resolve(process.cwd(), "pnpm-workspace.yaml"))
    ? process.cwd()
    : resolve(process.cwd(), "../..");
  const dir = resolve(repoRoot, "tmp");
  const file = resolve(dir, "live-orders-puebla.json");
  return { dir, file };
}

function readSharedOrders(): ActiveOrder[] {
  const { file } = getSharedStorePath();
  try {
    if (existsSync(file)) {
      const raw = readFileSync(file, "utf8");
      const parsed = JSON.parse(raw) as ActiveOrder[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore read error
  }
  return [];
}

function writeSharedOrders(orders: ActiveOrder[]): void {
  const { dir, file } = getSharedStorePath();
  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(file, JSON.stringify(orders, null, 2), "utf8");
  } catch {
    // Ignore write error
  }
}

export async function GET() {
  const orders = readSharedOrders();
  return NextResponse.json(
    { data: orders },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      order?: ActiveOrder;
      orders?: ActiveOrder[];
    };
    const current = readSharedOrders();

    if (body.order) {
      const idx = current.findIndex((o) => o.id === body.order!.id);
      if (idx >= 0) {
        current[idx] = body.order;
      } else {
        current.unshift(body.order);
      }
      writeSharedOrders(current);
      return NextResponse.json(
        { data: body.order, orders: current },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    if (Array.isArray(body.orders)) {
      writeSharedOrders(body.orders);
      return NextResponse.json(
        { data: body.orders },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json({ data: current });
  } catch {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 },
    );
  }
}
