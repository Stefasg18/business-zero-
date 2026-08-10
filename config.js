window.BZ_CONFIG = {
  API_BASE: "https://business-zero-backend.onrender.com",
  BOT_USERNAME: "BusinessZeroGameBot"
};

window.addEventListener("load", () => {
  const progression = document.createElement("script");
  progression.src = `progression-v32.js?v=32-${Date.now()}`;
  progression.async = false;
  progression.onload = () => {
    const security = document.createElement("script");
    security.src = `security-v33.js?v=33-${Date.now()}`;
    security.async = false;
    document.body.appendChild(security);
  };
  document.body.appendChild(progression);
});
