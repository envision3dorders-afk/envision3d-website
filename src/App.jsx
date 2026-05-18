// Only showing key part changes to keep it clean for you

const containerStyle = {
  fontFamily: "Arial",
  background: "#0f172a", // ✅ dark navy
  minHeight: "100vh",
  color: "#e5e7eb" // ✅ light text
};

const cardStyle = {
  background: "#1e293b", // ✅ dark card
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.5)"
};

const buttonStyle = {
  padding: "8px 12px",
  marginRight: "8px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  background: "#3b82f6", // blue accent
  color: "#fff"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px 30px",
  background: "#020617", // almost black
  alignItems: "center",
  borderBottom: "1px solid #1e293b"
};

// THEN APPLY IT BELOW:

return (
  <div style={containerStyle}>

    <div style={headerStyle}>
      <h2 style={{ cursor: "pointer" }}>Envision3D</h2>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "6px",
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #334155"
        }}
      />

      <button style={buttonStyle}>Cart ({cart.length})</button>
      <button style={buttonStyle}>Orders ({orders.length})</button>

      {logo}
    </div>
