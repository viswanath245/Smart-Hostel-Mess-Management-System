import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Truck } from "lucide-react";

function StaffVendors() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    vendorId: "",
    vendorName: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("staffToken");

  const loadVendors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/staff/vendors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setVendors(
        Array.isArray(data)
          ? data
          : data.vendors || data.data || []
      );
    } catch (error) {
      setMessage("Failed to load vendors.");
    }
  };

  useEffect(() => {
    loadVendors();
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
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/staff/vendors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to add vendor.");
        setLoading(false);
        return;
      }

      setMessage("Vendor added successfully.");

      setForm({
        vendorId: "",
        vendorName: "",
        phone: "",
        address: "",
      });

      await loadVendors();
    } catch (error) {
      setMessage("Server error. Please try again.");
    }

    setLoading(false);
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
            <Truck size={28} />
            Vendor Management
          </h1>

          <p>Manage vendors that supply ingredients and inventory.</p>
        </div>

        <button className="refresh-btn" onClick={loadVendors}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="form-card">
        <h2>Add Vendor</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Vendor ID</label>
              <input
                type="text"
                name="vendorId"
                placeholder="Enter Vendor ID"
                value={form.vendorId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Vendor Name</label>
              <input
                type="text"
                name="vendorName"
                placeholder="Enter vendor name"
                value={form.vendorName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter vendor address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {message && <p className="form-message">{message}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Vendor"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h2>Registered Vendors</h2>
          <span>{vendors.length} Vendors</span>
        </div>

        {vendors.length === 0 ? (
          <div className="empty-state">
            No vendors available.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Vendor ID</th>
                  <th>Vendor Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                </tr>
              </thead>

              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor._id}>
                    <td>{vendor.vendorId}</td>
                    <td>{vendor.vendorName}</td>
                    <td>{vendor.phone}</td>
                    <td>{vendor.address}</td>
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

export default StaffVendors;