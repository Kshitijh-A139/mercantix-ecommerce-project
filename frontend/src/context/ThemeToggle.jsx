import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

export default function ThemeToggle() {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "12px",
        borderRadius: "50%",
        background: "#2563eb",
        color: "white",
        border: "none",
      }}
    >
      ☀️
    </button>
  );
}