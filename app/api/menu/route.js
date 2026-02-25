import { connectDB } from "@/lib/db";
import Menu from "@/models/Menu";

export async function GET() {
  await connectDB();
  const items = await Menu.find().sort({ createdAt: -1 });
  return Response.json(items);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const newItem = await Menu.create(body);
  return Response.json(newItem);
}

export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();
  await Menu.findByIdAndDelete(id);
  return Response.json({ success: true });
}
