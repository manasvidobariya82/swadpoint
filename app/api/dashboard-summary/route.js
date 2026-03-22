import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ensureCoreTables } from "@/lib/db-schema";

export const runtime = "nodejs";

const RANGES = {
  today: {
    label: "Today",
    intervalSql: "NOW() - INTERVAL '1 day'",
  },
  week: {
    label: "This Week",
    intervalSql: "NOW() - INTERVAL '7 days'",
  },
  month: {
    label: "This Month",
    intervalSql: "NOW() - INTERVAL '30 days'",
  },
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeRange = (value) => {
  const key = String(value || "").trim().toLowerCase();
  return RANGES[key] ? key : "today";
};

export async function GET(request) {
  try {
    await ensureCoreTables();

    const range = normalizeRange(request.nextUrl.searchParams.get("range"));
    const selectedRange = RANGES[range];
    const sinceSql = selectedRange.intervalSql;

    const [statsResult, topItemsResult, alertsResult] = await Promise.all([
      pool.query(
        `
          WITH filtered_orders AS (
            SELECT *
            FROM orders
            WHERE order_time >= ${sinceSql}
          )
          SELECT
            COALESCE(
              SUM(
                CASE
                  WHEN status = 'Completed' OR LOWER(COALESCE(payment_status, '')) = 'paid'
                    THEN total
                  ELSE 0
                END
              ),
              0
            ) AS sales,
            COUNT(*) AS total_orders,
            COUNT(*) FILTER (WHERE COALESCE(table_no, 'NA') = 'NA') AS online_orders,
            COUNT(*) FILTER (WHERE status IN ('Pending', 'Preparing')) AS pending_orders,
            COUNT(DISTINCT NULLIF(COALESCE(table_no, 'NA'), 'NA')) FILTER (WHERE status IN ('Pending', 'Preparing')) AS active_tables,
            COUNT(DISTINCT customer_mobile) FILTER (
              WHERE customer_mobile ~ '^[0-9]{10}$'
            ) AS customer_count,
            COUNT(*) FILTER (WHERE COALESCE(table_no, 'NA') <> 'NA') AS dine_in_orders
          FROM filtered_orders
        `,
      ),
      pool.query(
        `
          SELECT
            COALESCE(NULLIF(TRIM(oi.item_name), ''), NULLIF(TRIM(oi.name), ''), 'Item') AS name,
            SUM(COALESCE(oi.quantity, oi.qty, 1))::int AS quantity
          FROM order_items oi
          INNER JOIN orders o ON o.id = oi.order_id
          WHERE o.order_time >= ${sinceSql}
            AND o.status <> 'Cancelled'
          GROUP BY 1
          ORDER BY quantity DESC, name ASC
          LIMIT 5
        `,
      ),
      pool.query(
        `
          SELECT item_name, current_stock, min_stock
          FROM low_stock_alerts
          WHERE is_active = TRUE
          ORDER BY updated_at DESC, item_name ASC
          LIMIT 5
        `,
      ),
    ]);

    const statsRow = statsResult.rows[0] || {};
    const notifications = [];

    const pendingOrders = toNumber(statsRow.pending_orders);
    const activeTables = toNumber(statsRow.active_tables);

    if (pendingOrders > 0) {
      notifications.push(`${pendingOrders} pending/preparing orders need attention`);
    }

    if (activeTables > 0) {
      notifications.push(`${activeTables} tables are currently active`);
    }

    for (const alert of alertsResult.rows) {
      notifications.push(
        `${alert.item_name || "Inventory item"} is low on stock (${toNumber(
          alert.current_stock,
        )}/${toNumber(alert.min_stock)})`,
      );
    }

    if (notifications.length === 0) {
      notifications.push("No new alerts right now");
    }

    return NextResponse.json({
      range,
      rangeLabel: selectedRange.label,
      stats: {
        sales: toNumber(statsRow.sales),
        totalOrders: toNumber(statsRow.total_orders),
        onlineOrders: toNumber(statsRow.online_orders),
        pending: pendingOrders,
        tables: activeTables,
        customers: toNumber(statsRow.customer_count),
        dineIn: toNumber(statsRow.dine_in_orders),
      },
      topSellingItems: topItemsResult.rows.map((row) => ({
        name: row.name || "Item",
        quantity: toNumber(row.quantity),
      })),
      notifications,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load dashboard summary" },
      { status: 500 },
    );
  }
}
