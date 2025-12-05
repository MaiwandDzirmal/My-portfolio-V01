import { useState } from "react";
import Snake3D from "./Snake3D";

type SnakeStyle = "classic" | "colorful" | "metallic";

export default function Snake3DShowcase() {
  const [selectedStyle, setSelectedStyle] = useState<SnakeStyle>("classic");

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#fff" }}>
        🐍 3D Snake Options
      </h2>

      {/* Style Selector */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setSelectedStyle("classic")}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            border: "2px solid #4caf50",
            borderRadius: "8px",
            background: selectedStyle === "classic" ? "#4caf50" : "transparent",
            color: selectedStyle === "classic" ? "#fff" : "#4caf50",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          🟢 Classic Green
        </button>
        <button
          onClick={() => setSelectedStyle("colorful")}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            border: "2px solid #ff6b6b",
            borderRadius: "8px",
            background:
              selectedStyle === "colorful" ? "#ff6b6b" : "transparent",
            color: selectedStyle === "colorful" ? "#fff" : "#ff6b6b",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          🌈 Colorful Rainbow
        </button>
        <button
          onClick={() => setSelectedStyle("metallic")}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            border: "2px solid #c0c0c0",
            borderRadius: "8px",
            background:
              selectedStyle === "metallic" ? "#c0c0c0" : "transparent",
            color: selectedStyle === "metallic" ? "#000" : "#c0c0c0",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          ✨ Metallic Silver
        </button>
      </div>

      {/* 3D Snake Display */}
      <div
        style={{
          border: "2px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Snake3D style={selectedStyle} segments={10} />
      </div>

      {/* Description */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
          color: "#fff",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {selectedStyle === "classic" && "🟢 Classic Green Snake"}
          {selectedStyle === "colorful" && "🌈 Colorful Rainbow Snake"}
          {selectedStyle === "metallic" && "✨ Metallic Silver Snake"}
        </h3>
        <p style={{ margin: "10px 0", lineHeight: "1.6" }}>
          {selectedStyle === "classic" &&
            "A traditional green snake with a natural look. Perfect for classic gameplay!"}
          {selectedStyle === "colorful" &&
            "A vibrant rainbow snake that changes color along its body. Eye-catching and fun!"}
          {selectedStyle === "metallic" &&
            "A sleek metallic silver snake with a shiny, reflective surface. Modern and elegant!"}
        </p>
        <p style={{ margin: "10px 0", fontSize: "14px", opacity: 0.7 }}>
          💡 Tip: Use your mouse to rotate and zoom the 3D snake!
        </p>
      </div>
    </div>
  );
}
