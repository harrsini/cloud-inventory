export default function InventoryStats({ products }) {
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.quantity),
    0
  );

  const lowStock = products.filter(
    (p) => Number(p.quantity) < Number(p.threshold)
  ).length;

  return (
    <div className="stats-row">
      <div className="stat-card">
        <p>Total Products</p>
        <h2>{totalProducts}</h2>
      </div>

      <div className="stat-card">
        <p>Total Stock</p>
        <h2>{totalStock}</h2>
      </div>

      <div className="stat-card alert">
        <p>Low Stock</p>
        <h2>{lowStock}</h2>
      </div>
    </div>
  );
}
