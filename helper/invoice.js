import { getBusinessProfile } from "@/helper/businessProfile";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatDateTime = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

const normalizeItems = (items, fallbackAmount) => {
  if (Array.isArray(items) && items.length > 0) {
    return items.map((item) => {
      const qty = Math.max(1, toNumber(item?.qty || 1));
      const lineTotal = toNumber(item?.lineTotal || item?.total || 0);
      const unitPrice = lineTotal > 0 ? lineTotal / qty : toNumber(item?.price || 0);

      return {
        name: String(item?.name || "Item"),
        qty,
        unitPrice,
        lineTotal: lineTotal > 0 ? lineTotal : unitPrice * qty,
      };
    });
  }

  return [
    {
      name: "Order Payment",
      qty: 1,
      unitPrice: toNumber(fallbackAmount),
      lineTotal: toNumber(fallbackAmount),
    },
  ];
};

const renderInvoiceHtml = (invoice) => {
  const business = getBusinessProfile();
  const issuedAt = formatDateTime(invoice?.issuedAt);
  const items = normalizeItems(invoice?.items, invoice?.totalAmount);
  const subtotal = items.reduce((sum, item) => sum + toNumber(item.lineTotal), 0);
  const totalAmount =
    toNumber(invoice?.totalAmount) > 0 ? toNumber(invoice.totalAmount) : subtotal;

  const addressLine = [business.address, business.city]
    .filter((value) => String(value || "").trim())
    .join(", ");

  const rows = items
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td style="text-align:center">${item.qty}</td>
        <td style="text-align:right">Rs. ${toNumber(item.unitPrice).toFixed(2)}</td>
        <td style="text-align:right">Rs. ${toNumber(item.lineTotal).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(invoice?.invoiceId || "Invoice")}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #111827; }
          .wrap { max-width: 860px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; gap: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 14px; }
          .brand { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
          .meta { font-size: 13px; color: #334155; margin: 2px 0; }
          .panel { margin-top: 14px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
          th { background: #f8fafc; text-align: left; color: #334155; }
          .totals { margin-top: 14px; width: 280px; margin-left: auto; }
          .totals td { border: none; padding: 6px 0; }
          .total { font-size: 16px; font-weight: 700; border-top: 2px solid #e5e7eb; }
          .foot { margin-top: 18px; font-size: 12px; color: #64748b; }
          @media print { body { padding: 8px; } }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="header">
            <div>
              <div class="brand">${escapeHtml(business.brandName)}</div>
              ${
                business.branchName
                  ? `<p class="meta">${escapeHtml(business.branchName)}</p>`
                  : ""
              }
              ${addressLine ? `<p class="meta">${escapeHtml(addressLine)}</p>` : ""}
              ${
                business.supportPhone
                  ? `<p class="meta">Phone: ${escapeHtml(business.supportPhone)}</p>`
                  : ""
              }
              ${
                business.supportEmail
                  ? `<p class="meta">Email: ${escapeHtml(business.supportEmail)}</p>`
                  : ""
              }
              ${
                business.gstNumber
                  ? `<p class="meta">GST: ${escapeHtml(business.gstNumber)}</p>`
                  : ""
              }
            </div>
            <div>
              <p class="meta"><strong>Invoice:</strong> ${escapeHtml(
                invoice?.invoiceId || "-"
              )}</p>
              <p class="meta"><strong>Issued:</strong> ${escapeHtml(issuedAt)}</p>
              <p class="meta"><strong>Order ID:</strong> ${escapeHtml(
                invoice?.orderId || "-"
              )}</p>
              <p class="meta"><strong>Payment ID:</strong> ${escapeHtml(
                invoice?.paymentId || "-"
              )}</p>
              <p class="meta"><strong>Table:</strong> ${escapeHtml(
                invoice?.tableNo || "NA"
              )}</p>
            </div>
          </div>

          <div style="margin-top:12px">
            <p class="meta"><strong>Customer:</strong> ${escapeHtml(
              invoice?.customerName || "Walk-in"
            )}</p>
            <p class="meta"><strong>Mobile:</strong> ${escapeHtml(
              invoice?.customerMobile || "-"
            )}</p>
            <p class="meta"><strong>Order Status:</strong> ${escapeHtml(
              invoice?.orderStatus || "-"
            )}</p>
            <p class="meta"><strong>Payment:</strong> ${escapeHtml(
              invoice?.paymentMethod || "-"
            )} (${escapeHtml(invoice?.paymentStatus || "-")})</p>
          </div>

          <div class="panel">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align:center">Qty</th>
                  <th style="text-align:right">Rate</th>
                  <th style="text-align:right">Amount</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>

          <table class="totals">
            <tr>
              <td>Subtotal</td>
              <td style="text-align:right">Rs. ${subtotal.toFixed(2)}</td>
            </tr>
            <tr class="total">
              <td>Total</td>
              <td style="text-align:right">Rs. ${totalAmount.toFixed(2)}</td>
            </tr>
          </table>

          <p class="foot">
            Generated from SwadPoint admin dashboard at ${escapeHtml(
              new Date().toLocaleString()
            )}.
          </p>
        </div>
      </body>
    </html>
  `;
};

const toSafeFileLabel = (value) => String(value || "invoice").replace(/[^\w-]/g, "_");

export const printInvoice = (invoice) => {
  if (typeof window === "undefined") return false;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return false;

  printWindow.document.write(renderInvoiceHtml(invoice));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  return true;
};

export const downloadInvoice = (invoice) => {
  if (typeof window === "undefined") return;

  const html = renderInvoiceHtml(invoice);
  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const fileLabel = toSafeFileLabel(invoice?.orderId || invoice?.paymentId || "invoice");
  anchor.href = url;
  anchor.download = `${fileLabel}-invoice.html`;
  anchor.click();
  URL.revokeObjectURL(url);
};

