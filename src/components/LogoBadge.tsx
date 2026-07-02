export default function LogoBadge() {
  return (
    <div
      style={{
        position: "fixed",
        top: "1.4rem",
        left: "1.4rem",
        zIndex: 50,
        background: "#ffffff",
        borderRadius: "16px",
        padding: "0.55rem 0.85rem",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
      }}
    >
      <img
        src="/redbull-logo.svg"
        alt="Red Bull"
        style={{ height: "30px", display: "block" }}
      />
    </div>
  );
}
