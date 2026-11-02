import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardList, RefreshCw } from "lucide-react";

function StaffOrders() {
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    vendorId: "",
    itemName: "",
    quantity: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("staffToken");

  const loadData = async () => {
    try {
      const [vendorsRes, ordersRes] = await Promise.all([
        fetch("http://localhost:5000/api/staff/vendors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:5000/api/staff/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const vendorsData = await vendorsRes.json();
      const ordersData = await ordersRes.json();

      setVendors(
        Array.isArray(vendorsData)
          ? vendorsData
          : vendorsData.vendors || vendorsData.data || []
      );

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : ordersData.orders || ordersData.data || []
      );
    } catch (error) {
      setMessage("Failed to load order data.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const quantity = Number(form.quantity);

    if (!form.vendorId || !form.itemName.trim() || quantity <= 0) {
      setMessage("Please enter valid order details.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/staff/orders",
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
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create order.");
        setLoading(false);
        return;
      }

      setMessage("Order created successfully.");

      setForm({
        vendorId: "",
        itemName: "",
        quantity: "",
      });

      await loadData();
    } catch (error) {
      setMessage("Server error. Please try again.");
    }

    setLoading(false);
  };

  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/staff/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update order status.");
        return;
      }

      setMessage("Order status updated successfully.");
      await loadData();
    } catch (error) {
      setMessage("Server error while updating order.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "low";
      case "Ordered":
        return "normal";
      case "Cancelled":
        return "high";
      default:
        return "normal";
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
            <ClipboardList size={28} />
            Order Management
          </h1>

          <p>Create ingredient orders and track their delivery status.</p>
        </div>

        <button className="refresh-btn" onClick={loadData}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="form-card">
        <h2>Create New Order</h2>

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
                min="1"
                step="0.01"
                placeholder="Enter quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {message && <p className="form-message">{message}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Order"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h2>Orders</h2>
          <span>{orders.length} Orders</span>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">No orders available.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Vendor</th>
                  <th>Quantity</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.itemName}</td>

                    <td>
                      {order.vendorId?.vendorName ||
                        order.vendorId?.vendorId ||
                        "Unknown"}
                    </td>

                    <td>{order.quantity}</td>

                    <td>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ordered">Ordered</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffOrders;