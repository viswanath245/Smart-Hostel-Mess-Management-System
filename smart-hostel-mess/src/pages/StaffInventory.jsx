import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, RefreshCw } from "lucide-react";

function StaffInventory() {
  const [vendors, setVendors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    vendorId: "",
    itemName: "",
    quantity: "",
    reorderLevel: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("staffToken");

  const loadData = async () => {
    try {
      const [vendorsRes, inventoryRes] = await Promise.all([
        fetch("http://localhost:5000/api/staff/vendors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:5000/api/staff/inventory", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const vendorsData = await vendorsRes.json();
      const inventoryData = await inventoryRes.json();

      setVendors(
        Array.isArray(vendorsData)
          ? vendorsData
          : vendorsData.vendors || vendorsData.data || []
      );

      setInventory(
        Array.isArray(inventoryData)
          ? inventoryData
          : inventoryData.inventory || inventoryData.inventoryItems || inventoryData.data || []
      );
    } catch (error) {
      setMessage("Failed to load inventory data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getStockStatus = (quantity, reorderLevel) => {
    if (Number(quantity) <= Number(reorderLevel)) {
      return "Low Stock";
    }

    return "Normal";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const quantity = Number(form.quantity);
    const reorderLevel = Number(form.reorderLevel);

    if (
      !form.vendorId ||
      !form.itemName.trim() ||
      quantity < 0 ||
      reorderLevel < 0
    ) {
      setMessage("Please enter valid inventory details.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/staff/inventory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vendorId: form.vendorId,
            itemName: form.itemName.trim(),
            quantity,
            reorderLevel,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to add inventory item.");
        setLoading(false);
        return;
      }

      setMessage("Inventory item added successfully.");

      setForm({
        vendorId: "",
        itemName: "",
        quantity: "",
        reorderLevel: "",
      });

      await loadData();
    } catch (error) {
      setMessage("Server error. Please try again.");
    }

    setLoading(false);
  };

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 0) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/staff/inventory/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update inventory.");
        return;
      }

      setMessage("Inventory updated successfully.");
      await loadData();
    } catch (error) {
      setMessage("Server error while updating inventory.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link to="/staff" className="back-link">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <h1>
            <Package size={28} />
            Inventory Management
          </h1>

          <p>Manage ingredient stock and monitor reorder levels.</p>
        </div>

        <button className="refresh-btn" onClick={loadData}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="form-card">
        <h2>Add Inventory Item</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vendor</label>

            <select
              name="vendorId"
              value={form.vendorId}
              onChange={handleChange}
              required
            >
              <option value="">Select Vendor</option>

              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.vendorName} ({vendor.vendorId})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="itemName"
                placeholder="Enter Item Name"
                value={form.itemName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                min="0"
                step="0.01"
                placeholder="Enter quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              min="0"
              step="0.01"
              placeholder="Enter reorder level"
              value={form.reorderLevel}
              onChange={handleChange}
              required
            />
          </div>

          {message && <p className="form-message">{message}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Inventory Item"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h2>Inventory Stock</h2>
          <span>{inventory.length} Items</span>
        </div>

        {inventory.length === 0 ? (
          <div className="empty-state">No inventory items available.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Vendor</th>
                  <th>Quantity</th>
                  <th>Reorder Level</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {inventory.map((item) => {
                  const quantity = Number(item.quantity || 0);
                  const reorderLevel = Number(item.reorderLevel || 0);
                  const status = getStockStatus(quantity, reorderLevel);

                  return (
                    <tr key={item._id}>
                      <td>{item.itemName}</td>

                      <td>
                        {item.vendorId?.vendorName ||
                          item.vendorId?.vendorId ||
                          "Unknown"}
                      </td>

                      <td>{quantity}</td>

                      <td>{reorderLevel}</td>

                      <td>
                        <span
                          className={`status-badge ${
                            status === "Low Stock" ? "high" : "low"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="refresh-btn"
                          onClick={() =>
                            updateQuantity(item, quantity + 1)
                          }
                        >
                          +1
                        </button>

                        <button
                          className="refresh-btn"
                          onClick={() =>
                            updateQuantity(item, quantity - 1)
                          }
                          disabled={quantity <= 0}
                          style={{ marginLeft: "6px" }}
                        >
                          -1
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffInventory;