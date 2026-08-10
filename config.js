window.BZ_CONFIG = {
  API_BASE: "https://business-zero-backend.onrender.com",
  BOT_USERNAME: "BusinessZeroGameBot"
};

window.addEventListener("load", () => {
  const script = document.createElement("script");
  script.src = `progression-v32.js?v=32-${Date.now()}`;
  script.async = false;
  document.body.appendChild(script);
});
