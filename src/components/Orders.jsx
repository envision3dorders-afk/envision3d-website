export default function Orders({ orders, updateStatus, deleteOrder }) {
  return (
    <div>
      <h2>Orders</h2>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map((o) => (
        <div
          key={o.id}
          style={{
            background: "#1c1f26",
            padding: "20px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #2a2e37",
            color: "#e5e7eb",
          }}
        >
          {/* ✅ ORDER INFO */}
          <h3>{o.ref}</h3>
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color:
                  o.status === "Completed"
                    ? "lightgreen"
                    : o.status === "Paid"
                    ? "#3b82f6"
                    : o.status === "Pending Payment"
                    ? "orange"
                    : "#facc15",
              }}
            >
              {o.status}
            </span>
          </p>

          <p>
            <strong>Total:</strong>{" "}
            {o.total > 0 ? `R${o.total}` : "Quote Required"}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {o.date ? new Date(o.date).toLocaleString() : "N/A"}
          </p>

          {/* ✅ FILE LINK */}
          {o.fileURL && (
            <p>
              <strong>File:</strong>{" "}
              <a
                href={o.fileURL}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#3b82f6" }}
              >
                View Uploaded File
              </a>
            </p>
          )}

          {/* ✅ MODEL LINK */}
          {o.modelLink && (
            <p>
              <strong>Model Link:</strong>{" "}
              <a
                href={o.modelLink}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#3b82f6" }}
              >
                Open Link
              </a>
            </p>
          )}

          {/* ✅ ACTION BUTTONS */}
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => updateStatus(o.id, "Paid")}
              style={{
                marginRight: "5px",
                padding: "6px 10px",
                borderRadius: "5px",
                border: "none",
                background: "#3b82f6",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Mark Paid
            </button>

            <button
              onClick={() => updateStatus(o.id, "Completed")}
              style={{
                marginRight: "5px",
                padding: "6px 10px",
                borderRadius: "5px",
                border: "none",
                background: "green",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Complete
            </button>

            <button
              onClick={() => deleteOrder(o.id)}
              style={{
                padding: "6px 10px",
                borderRadius: "5px",
                border: "none",
                background: "red",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
