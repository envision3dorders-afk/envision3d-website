import { useState } from "react";

export default function Orders({
  orders,
  updateStatus,
  deleteOrder,
  setPrice,
}) {
  const [priceInputs, setPriceInputs] = useState({});

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
          <h3>{o.ref || o.id}</h3>

          <p>
            <strong>Status:</strong> {o.status}
          </p>

          <p>
            <strong>Total:</strong>{" "}
            {o.total > 0 ? `R${o.total}` : "Quote Required"}
          </p>

          {/* ✅ MODEL LINK */}
          {o.modelLink && (
            <p>
              <a href={o.modelLink} target="_blank" rel="noreferrer">
                View Model Link
              </a>
            </p>
          )}

          {/* ✅ SET PRICE */}
          {o.status === "Quote Required" && (
            <div>
              <input
                type="number"
                placeholder="Enter price"
                value={priceInputs[o.id] || ""}
                onChange={(e) =>
                  setPriceInputs({
                    ...priceInputs,
                    [o.id]: e.target.value,
                  })
                }
              />

              <button
                onClick={() =>
                  setPrice(o.id, Number(priceInputs[o.id]))
                }
              >
                Set Price
              </button>
            </div>
          )}

          {/* ✅ PAYFAST BUTTON */}
          {o.status === "Pending Payment" && (
            <form
              action="https://sandbox.payfast.co.za/eng/process"
              method="post"
            >
              <input type="hidden" name="merchant_id" value="10000100" />
              <input type="hidden" name="merchant_key" value="46f0cd694581a" />

              <input
                type="hidden"
                name="amount"
                value={o.total}
              />

              <input
                type="hidden"
                name="item_name"
                value="Envision3D Order"
              />

              <input
                type="hidden"
                name="m_payment_id"
                value={o.id}
              />

              <button type="submit">
                Pay Now
              </button>
            </form>
          )}

          {/* ✅ ACTIONS */}
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => updateStatus(o.id, "Paid")}>
              Paid
            </button>

            <button onClick={() => updateStatus(o.id, "Completed")}>
              Completed
            </button>

            <button onClick={() => deleteOrder(o.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
