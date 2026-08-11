window.BZ_CONFIG = {
  API_BASE: "https://business-zero-backend.onrender.com",
  BOT_USERNAME: "BusinessZeroGameBot"
};

window.addEventListener("load", () => {
  const load = (src, done) => {
    const script = document.createElement("script");
    script.src = `${src}?v=453-${Date.now()}`;
    script.async = false;
    script.onload = () => done?.();
    script.onerror = () => console.error(`Не удалось загрузить ${src}`);
    document.body.appendChild(script);
  };

  load("progression-v32.js", () => {
    load("security-v33.js", () => {
      load("admin-v34.js", () => {
        load("store-v35.js", () => {
          load("ux-v37.js", () => {
            load("ux-v37-patch.js", () => {
              load("mobile-fix-v371.js", () => {
                load("stability-v372.js", () => {
                  load("arcade-v39.js", () => {
                    load("ui-v39.js", () => {
                      load("passive-income-v40.js", () => {
                        load("quest-state-v401.js", () => {
                          load("referral-v402.js", () => {
                            load("action-labels-v44.js", () => {
                              load("profile-cosmetics-v44.js", () => {
                                load("store-personalization-v45.js", () => {
                                  load("title-preview-fix-v451.js", () => {
                                    load("profile-polish-v453.js");
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
