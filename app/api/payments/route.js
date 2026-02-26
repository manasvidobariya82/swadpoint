import { NextResponse } from "next/server";
import { addPaymentToStore, getPaymentsFromStore } from "@/lib/server-store";

const sortByLatest = (payments) =>
  [...payments].sort(
    (a, b) =>
      new Date(b?.timestamp || 0).getTime() - new Date(a?.timestamp || 0).getTime()
  );

export async function GET() {
  try {
    const payments = await getPaymentsFromStore();
    return NextResponse.json(sortByLatest(payments));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payment = await request.json();
    if (!payment || typeof payment !== "object" || !payment.id) {
      return NextResponse.json(
        { error: "Invalid payment payload" },
        { status: 400 }
      );
    }

    const saved = await addPaymentToStore(payment);
    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save payment" },
      { status: 500 }
    );
  }
}
