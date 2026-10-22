/* Heritage Auto Finance — privacy-conscious enquiry attribution.
   Adds optional campaign context to WhatsApp enquiries; no analytics vendor,
   cookies, personal-data collection, or persistent storage is used. */
(function () {
  "use strict";
  const allowedCampaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  const params = new URLSearchParams(window.location.search);
  const campaign = allowedCampaignKeys
    .map(key => [key.replace("utm_", ""), params.get(key)])
    .filter(([, value]) => value && value.trim())
    .map(([key, value]) => key + ": " + value.trim().slice(0, 100));
  const pageName = document.title.split("|")[0].trim() || "Heritage Auto Finance";
  const sourceParts = ["Website", "Page: " + pageName, ...campaign];
  const sourceNote = "\n\n— Enquiry source: " + sourceParts.join(" | ");
  const trackedLinks = new WeakSet();

  function trackWhatsAppLink(link) {
    if (!link || trackedLinks.has(link)) return;
    let url;
    try { url = new URL(link.href); } catch (_) { return; }
    if (url.hostname !== "wa.me" && !url.hostname.endsWith(".wa.me")) return;
    const originalText = url.searchParams.get("text") || "Hello Heritage Auto Finance, I would like to enquire about your services.";
    if (!originalText.includes("Enquiry source:")) {
      url.searchParams.set("text", originalText + sourceNote);
      link.href = url.toString();
    }
    trackedLinks.add(link);
  }

  function init() {
    document.querySelectorAll('a[href*="wa.me/"]').forEach(trackWhatsAppLink);
    document.addEventListener("click", function (event) {
      const link = event.target.closest('a[href*="wa.me/"]');
      if (link) {
        trackWhatsAppLink(link);
        window.dispatchEvent(new CustomEvent("heritage:enquiry", {
          detail: { channel: "whatsapp", page: pageName, campaign: campaign.reduce((out, item) => {
            const split = item.indexOf(": ");
            out[item.slice(0, split)] = item.slice(split + 2);
            return out;
          }, {}) }
        }));
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
