export const syncLowStockAlert = async (client, inventoryItemInput) => {
  if (!client || !inventoryItemInput) return null;

  let inventoryItem = inventoryItemInput;
  if (typeof inventoryItemInput === "string") {
    const lookupResult = await client.query(
      `SELECT id, name, current_stock, min_stock
       FROM inventory_items
       WHERE id = $1
       LIMIT 1`,
      [inventoryItemInput],
    );

    if (lookupResult.rowCount === 0) return null;
    inventoryItem = lookupResult.rows[0];
  }

  const currentStock = Number(inventoryItem.current_stock ?? inventoryItem.currentStock ?? 0);
  const minStock = Number(inventoryItem.min_stock ?? inventoryItem.minStock ?? 0);
  const itemId = String(inventoryItem.id || "").trim();
  const itemName = String(inventoryItem.name || "").trim() || "Inventory Item";

  if (!itemId) return null;

  const isActive = minStock > 0 && currentStock <= minStock;

  const result = await client.query(
    `INSERT INTO low_stock_alerts (
       inventory_item_id, item_name, current_stock, min_stock, is_active,
       last_triggered_at, resolved_at, updated_at
     ) VALUES (
       $1, $2, $3, $4, $5,
       CASE WHEN $5 THEN NOW() ELSE NULL END,
       CASE WHEN $5 THEN NULL ELSE NOW() END,
       NOW()
     )
     ON CONFLICT (inventory_item_id)
     DO UPDATE SET
       item_name = EXCLUDED.item_name,
       current_stock = EXCLUDED.current_stock,
       min_stock = EXCLUDED.min_stock,
       is_active = EXCLUDED.is_active,
       last_triggered_at = CASE
         WHEN EXCLUDED.is_active THEN NOW()
         ELSE low_stock_alerts.last_triggered_at
       END,
       resolved_at = CASE
         WHEN EXCLUDED.is_active THEN NULL
         ELSE NOW()
       END,
       updated_at = NOW()
     RETURNING inventory_item_id, item_name, current_stock, min_stock, is_active,
               last_triggered_at, resolved_at, updated_at`,
    [itemId, itemName, currentStock, minStock, isActive],
  );

  return result.rows[0] || null;
};
