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
    security.onload = () => {
      const admin = document.createElement("script");
      admin.src = `admin-v34.js?v=34-${Date.now()}`;
      admin.async = false;
      admin.onload = () => {
        const storeFix = document.createElement("script");
        storeFix.src = `store-v35.js?v=35-${Date.now()}`;
        storeFix.async = false;
        storeFix.onload = () => {
          const ux = document.createElement("script");
          ux.src = `ux-v37.js?v=37-${Date.now()}`;
          ux.async = false;
          ux.onload = () => {
            const patch = document.createElement("script");
            patch.src = `ux-v37-patch.js?v=37-${Date.now()}`;
            patch.async = false;
            patch.onload = () => {
              const mobileFix = document.createElement("script");
              mobileFix.src = `mobile-fix-v371.js?v=371-${Date.now()}`;
              mobileFix.async = false;
              mobileFix.onload = () => {
                const noLevel = document.createElement("script");
                noLevel.src = `no-level-v38.js?v=38-${Date.now()}`;
                noLevel.async = false;
                document.body.appendChild(noLevel);
              };
              document.body.appendChild(mobileFix);
            };
            document.body.appendChild(patch);
          };
          document.body.appendChild(ux);
        };
        document.body.appendChild(storeFix);
      };
      document.body.appendChild(admin);
    };
    document.body.appendChild(security);
  };
  document.body.appendChild(progression);
});
