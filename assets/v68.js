(() => {
  const APP_ID = "58afac42-f259-4105-8bc6-c9ff2414f2e7";
  const DISMISS_KEY = "oatf-push-control-dismissed-v1";

  window.OneSignalDeferred = window.OneSignalDeferred || [];

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const createUI = () => {
    if (document.querySelector(".oatf-push-control")) return;

    const control = document.createElement("aside");
    control.className = "oatf-push-control";
    control.setAttribute("aria-live", "polite");
    control.innerHTML = `
      <button class="oatf-push-dismiss" type="button" aria-label="Dismiss notification invitation">×</button>
      <div class="oatf-push-icon" aria-hidden="true">🔔</div>
      <div class="oatf-push-copy">
        <strong>Get OATF updates</strong>
        <span>Fair announcements, schedules and giveaways.</span>
      </div>
      <button class="oatf-push-button" type="button">Enable</button>
    `;

    const help = document.createElement("div");
    help.className = "oatf-ios-push-help";
    help.setAttribute("role", "dialog");
    help.setAttribute("aria-modal", "true");
    help.setAttribute("aria-label", "Enable notifications on iPhone");
    help.innerHTML = `
      <div class="oatf-ios-push-card">
        <h2>Add OATF to your Home Screen</h2>
        <p>Apple allows website notifications after the site is saved to your Home Screen.</p>
        <div class="oatf-ios-steps">
          <div class="oatf-ios-step"><b>1</b><span>Tap the Safari Share button.</span></div>
          <div class="oatf-ios-step"><b>2</b><span>Choose <strong>Add to Home Screen</strong>.</span></div>
          <div class="oatf-ios-step"><b>3</b><span>Open OATF from the new Home Screen icon and tap Enable again.</span></div>
        </div>
        <button class="oatf-ios-close" type="button">Got it</button>
      </div>
    `;

    document.body.append(control, help);

    const button = control.querySelector(".oatf-push-button");
    const dismiss = control.querySelector(".oatf-push-dismiss");
    const closeHelp = help.querySelector(".oatf-ios-close");

    dismiss.addEventListener("click", () => {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
      control.classList.remove("is-ready");
    });

    closeHelp.addEventListener("click", () => help.classList.remove("is-open"));
    help.addEventListener("click", event => {
      if (event.target === help) help.classList.remove("is-open");
    });

    window.OneSignalDeferred.push(async function(OneSignal) {
      try {
        await OneSignal.init({
          appId: APP_ID,
          serviceWorkerPath: "push/onesignal/OneSignalSDKWorker.js",
          serviceWorkerParam: { scope: "/push/onesignal/" },
          notifyButton: { enable: false },
          welcomeNotification: {
            title: "Out at the Fair®",
            message: "You’re subscribed! We’ll keep you posted on fair news and updates."
          }
        });

        const supported = OneSignal.Notifications.isPushSupported();
        if (!supported) return;

        const update = () => {
          const optedIn = OneSignal.User.PushSubscription.optedIn;
          if (optedIn) {
            button.textContent = "Enabled";
            button.disabled = true;
            control.querySelector(".oatf-push-copy strong").textContent = "Notifications are on";
            control.querySelector(".oatf-push-copy span").textContent = "You’ll receive OATF updates on this device.";
          } else {
            button.textContent = "Enable";
            button.disabled = false;
          }
        };

        update();

        OneSignal.User.PushSubscription.addEventListener("change", update);

        button.addEventListener("click", async () => {
          if (isIOS && !isStandalone) {
            help.classList.add("is-open");
            return;
          }

          button.disabled = true;
          button.textContent = "Opening…";
          try {
            await OneSignal.User.PushSubscription.optIn();
          } catch (error) {
            console.warn("OneSignal opt-in failed:", error);
          }
          update();
        });

        const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
        const dismissedRecently = Date.now() - dismissedAt < 1000 * 60 * 60 * 24 * 30;
        if (!dismissedRecently || OneSignal.User.PushSubscription.optedIn) {
          window.setTimeout(() => control.classList.add("is-ready"), 1600);
        }
      } catch (error) {
        console.warn("OneSignal initialization failed:", error);
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createUI, { once: true });
  } else {
    createUI();
  }
})();