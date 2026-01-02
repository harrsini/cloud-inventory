import { useEffect, useState } from 'react';
import { getItems, addProduct, updateStock } from '../services/api';
import '../styles/dashboard.css';

export default function Dashboard({ user, signOut }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // form state
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [threshold, setThreshold] = useState('');
  const [quantity, setQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);


  async function loadItems() {
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleAddProduct(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await addProduct({
        productName,
        category,
        price: Number(price),
        threshold: Number(threshold),
        quantity: Number(quantity),
      });

      setProductName('');
      setCategory('');
      setPrice('');
      setThreshold('');
      setQuantity('');

      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const totalProducts = items.length;
  const totalStock = items.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0),
    0
  );
  const lowStockCount = items.filter(
    (item) => Number(item.quantity ?? 0) < Number(item.threshold)
  ).length;

  return (
    <div className="page">
      <div className="card">

        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1>Inventory Dashboard</h1>
            <p className="welcome-text">Welcome, {user.username}</p>
          </div>
          <button className="logout-btn" onClick={signOut}>
            Logout
          </button>
        </div>

        {/* STATS */}
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
            <h2>{lowStockCount}</h2>
          </div>
        </div>

        {/* ADD PRODUCT CARD */}
        <div className="add-product-card">
          <h2>Add Product</h2>

          <form onSubmit={handleAddProduct} className="add-product-form">
            <input
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />

           <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Grocery">Grocery</option>
            <option value="Cosmetics">Cosmetics</option>
            <option value="Electronics">Electronics</option>
            <option value="Stationery">Stationery</option>
            <option value="Household">Household</option>
          </select>


            <input
              type="number"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Threshold"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Initial Stock"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>

          {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
        </div>

        <h2>Products</h2>
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Grocery">Grocery</option>
            <option value="Cosmetics">Cosmetics</option>
            <option value="Electronics">Electronics</option>
            <option value="Stationery">Stationery</option>
            <option value="Household">Household</option>
          </select>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
            />
            Low Stock Only
          </label>
        </div>


        <div className="products-grid">
          {items
            .filter((item) =>
              item.productName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
            )
            .filter((item) =>
              categoryFilter ? item.category === categoryFilter : true
            )
            .filter((item) =>
              lowStockOnly
                ? Number(item.quantity ?? 0) < Number(item.threshold)
                : true
            )
            .map((item) => (

            <ProductCard
              key={item.productId}
              item={item}
              onUpdate={loadItems}
              setError={setError}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

/* ---------------- PRODUCT CARD ---------------- */

function ProductCard({ item, onUpdate, setError }) {
  const [addQuantity, setAddQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  const currentStock = Number(item.quantity ?? 0);
  const threshold = Number(item.threshold);
  const maxAddable = Math.max(threshold - currentStock, 0);
  const isLowStock = currentStock < threshold;

  async function handleUpdate() {
    if (addQuantity <= 0) return;

    setLoading(true);
    setError('');

    try {
      const newQuantity = currentStock + addQuantity;
      await updateStock(item.productId, newQuantity);
      setAddQuantity(0);
      await onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`product-card ${isLowStock ? 'low-stock-glow' : ''}`}>
      <div className="product-title">
        <h3>{item.productName}</h3>
        {isLowStock && <span className="badge">LOW STOCK</span>}
      </div>

      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ₹{item.price}</p>
      <p><strong>Threshold:</strong> {threshold}</p>
      <p><strong>Current Stock:</strong> {currentStock}</p>

      <div className="quantity-row">
        <input
          type="number"
          min="1"
          max={maxAddable}
          value={addQuantity}
          onChange={(e) => setAddQuantity(Number(e.target.value))}
          disabled={maxAddable === 0}
        />
        <button
          onClick={handleUpdate}
          disabled={loading || addQuantity <= 0}
        >
          {loading ? 'Updating...' : 'Add Stock'}
        </button>
      </div>

      {maxAddable === 0 && (
        <p style={{ color: '#16a34a', fontSize: 13, marginTop: 8 }}>
          Stock is sufficient
        </p>
      )}
    </div>
  );
}
