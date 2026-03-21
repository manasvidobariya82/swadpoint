import { redirect } from "next/navigation";

const normalizeTableNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";

  const parsed = Number(digits);
  if (!Number.isInteger(parsed) || parsed <= 0) return "";
  return String(parsed);
};

export default async function TableMenuRedirectPage({ params }) {
  const resolvedParams = await params;
  const table = normalizeTableNumber(resolvedParams?.table);

  if (!table) {
    redirect("/menu");
  }

  redirect(`/menu?table=${encodeURIComponent(table)}`);
}
