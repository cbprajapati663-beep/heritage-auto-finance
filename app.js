/* Heritage Auto Finance - site interactions */
(function () {
  "use strict";

  const textArray = ["Dream Car!", "Commercial Fleet!", "Family Protection!", "Business Growth!"];
  let textIndex = 0;
  let charIndex = 0;
  let typingTimer = null;
  const typingSpeed = 125;
  const erasingSpeed = 65;
  const pauseAfterWord = 2400;

  const formatINR = value => "₹ " + Math.round(Number(value) || 0).toLocaleString("en-IN");

  // Preserve the original typewriter animation on desktop. Keep the full phrase
  // static on small screens, where the reserved headline slot prevents reflow.
  function typeNext() {
    const target = document.querySelector(".typed-text");
    if (!target) return;
    if (window.matchMedia("(max-width: 700px)").matches) {
      target.textContent = textArray[0];
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.textContent = textArray[textIndex];
      charIndex = textArray[textIndex].length;
      typingTimer = window.setTimeout(() => {
        textIndex = (textIndex + 1) % textArray.length;
        charIndex = 0;
        typeNext();
      }, 4200);
      return;
    }
    const word = textArray[textIndex];
    if (charIndex < word.length) {
      target.textContent = word.slice(0, ++charIndex);
      typingTimer = window.setTimeout(typeNext, typingSpeed);
    } else {
      typingTimer = window.setTimeout(eraseNext, pauseAfterWord);
    }
  }

  function eraseNext() {
    const target = document.querySelector(".typed-text");
    if (!target) return;
    if (charIndex > 0) {
      target.textContent = textArray[textIndex].slice(0, --charIndex);
      typingTimer = window.setTimeout(eraseNext, erasingSpeed);
    } else {
      textIndex = (textIndex + 1) % textArray.length;
      typingTimer = window.setTimeout(typeNext, 250);
    }
  }

  function filterPosters(category, evt) {
    const selected = ["all", "loans", "insurance"].includes(category) ? category : "all";
    document.querySelectorAll(".poster-item").forEach(item => {
      const visible = selected === "all" || item.classList.contains(selected);
      item.classList.toggle("show", visible);
      item.setAttribute("aria-hidden", String(!visible));
    });
    document.querySelectorAll(".tab-btn").forEach(button => {
      const active = button.dataset.category === selected ||
        (!button.dataset.category && button.getAttribute("onclick")?.includes("'" + selected + "'"));
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (evt && evt.currentTarget) {
      document.querySelectorAll(".tab-btn").forEach(button => button.classList.toggle("active", button === evt.currentTarget));
      evt.currentTarget.setAttribute("aria-pressed", "true");
    }
  }

  function calculateEMI() {
    const amountEl = document.getElementById("loanAmount");
    const rateEl = document.getElementById("interestRate");
    const tenureEl = document.getElementById("loanTenure");
    const resultEl = document.getElementById("emiResult");
    if (!amountEl || !rateEl || !tenureEl || !resultEl) return;

    const principal = Math.max(0, Number(amountEl.value));
    const annualRate = Math.max(0, Number(rateEl.value));
    const months = Math.max(1, Number(tenureEl.value));
    const monthlyRate = annualRate / 1200;
    const emi = monthlyRate === 0
      ? principal / months
      : principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
        (Math.pow(1 + monthlyRate, months) - 1);

    const amountLabel = document.getElementById("amountLabel");
    const rateLabel = document.getElementById("rateLabel");
    const tenureLabel = document.getElementById("tenureLabel");
    const safeEmi = Number.isFinite(emi) ? emi : 0;
    if (amountLabel) amountLabel.textContent = formatINR(principal);
    if (rateLabel) rateLabel.textContent = annualRate + " %";
    if (tenureLabel) tenureLabel.textContent = months + " Months";
    resultEl.textContent = formatINR(safeEmi);

    const totalRepayment = safeEmi * months;
    const principalSummary = document.getElementById("principalSummary");
    const interestSummary = document.getElementById("interestSummary");
    const totalSummary = document.getElementById("totalSummary");
    if (principalSummary) principalSummary.textContent = formatINR(principal);
    if (interestSummary) interestSummary.textContent = formatINR(Math.max(0, totalRepayment - principal));
    if (totalSummary) totalSummary.textContent = formatINR(totalRepayment);
    const whatsappLink = document.getElementById("emiWhatsApp");
    if (whatsappLink) {
      const message = "Hello Heritage Auto Finance, please help me understand vehicle finance options. Estimated loan amount: " +
        formatINR(principal) + ", interest rate: " + annualRate + "% p.a., tenure: " + months +
        " months, estimated EMI: " + formatINR(safeEmi) + ". I understand this is only an illustration, not a loan offer or approval.";
      whatsappLink.href = "https://wa.me/917600211085?text=" + encodeURIComponent(message);
    }
  }

  function calculateEligibility() {
    const incomeEl = document.getElementById("monthlyIncome");
    const resultEl = document.getElementById("eligibleResult");
    if (!incomeEl || !resultEl) return;
    const income = Math.max(0, Number(incomeEl.value));
    const label = document.getElementById("incomeLabel");
    if (label) label.textContent = formatINR(income);
    // Clearly an illustrative multiplier, not lender eligibility or approval.
    resultEl.textContent = formatINR(income * 30);
  }

  function toggleFaq(item) {
    if (!item) return;
    const isOpen = item.classList.toggle("active");
    item.setAttribute("aria-expanded", String(isOpen));
  }

  function initReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach(element => element.classList.add("active"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px 80px 0px", threshold: 0.01 });
    elements.forEach(element => observer.observe(element));
  }

  function initPosterPreview() {
    const gallery = document.querySelector("#portfolio .poster-grid");
    if (!gallery || document.getElementById("posterPreviewDialog")) return;
    const dialog = document.createElement("dialog");
    dialog.id = "posterPreviewDialog";
    dialog.className = "poster-preview-dialog";
    dialog.setAttribute("aria-label", "Poster preview");
    dialog.innerHTML = '<button type="button" class="poster-preview-close" aria-label="Close poster preview">×</button><button type="button" class="poster-preview-prev" aria-label="Previous poster">‹</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="poster-preview-next" aria-label="Next poster">›</button>';
    document.body.appendChild(dialog);
    const previewImage = dialog.querySelector("img");
    const caption = dialog.querySelector("figcaption");
    let currentItems = [];
    let currentIndex = 0;
    const show = index => {
      if (!currentItems.length) return;
      currentIndex = (index + currentItems.length) % currentItems.length;
      const source = currentItems[currentIndex].querySelector("img");
      if (!source) return;
      previewImage.src = source.currentSrc || source.src;
      previewImage.alt = source.alt || "Heritage Auto Finance poster";
      caption.textContent = source.alt || "Heritage Auto Finance";
      dialog.querySelector(".poster-preview-prev").disabled = currentItems.length < 2;
      dialog.querySelector(".poster-preview-next").disabled = currentItems.length < 2;
    };
    gallery.addEventListener("click", event => {
      const image = event.target.closest(".poster-item img");
      if (!image) return;
      const item = image.closest(".poster-item");
      if (!item || item.getAttribute("aria-hidden") === "true") return;
      currentItems = Array.from(gallery.querySelectorAll(".poster-item")).filter(card =>
        card.getAttribute("aria-hidden") !== "true" && getComputedStyle(card).display !== "none"
      );
      currentIndex = currentItems.indexOf(item);
      show(currentIndex);
      if (!dialog.open) dialog.showModal();
    });
    dialog.querySelector(".poster-preview-close").addEventListener("click", () => dialog.close());
    dialog.querySelector(".poster-preview-prev").addEventListener("click", () => show(currentIndex - 1));
    dialog.querySelector(".poster-preview-next").addEventListener("click", () => show(currentIndex + 1));
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft") { event.preventDefault(); show(currentIndex - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); show(currentIndex + 1); }
    });
  }

  function init() {
    const shareButton = document.getElementById("siteShareButton");
    if (shareButton) {
      const defaultShareLabel = shareButton.textContent.trim();
      shareButton.addEventListener("click", async () => {
        const shareData = {
          title: "Heritage Auto Finance",
          text: "Vehicle finance and motor insurance assistance in Mehsana and North Gujarat.",
          url: "https://heritageautofinance.netlify.app/"
        };
        try {
          if (navigator.share) {
            await navigator.share(shareData);
          } else if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(shareData.url);
            shareButton.textContent = "✓ Link copied";
            window.setTimeout(() => { shareButton.textContent = defaultShareLabel; }, 2200);
          } else {
            window.prompt("Copy the Heritage Auto Finance website link:", shareData.url);
          }
        } catch (error) {
          if (error && error.name !== "AbortError") {
            if (navigator.clipboard && window.isSecureContext) {
              try {
                await navigator.clipboard.writeText(shareData.url);
                shareButton.textContent = "✓ Link copied";
                window.setTimeout(() => { shareButton.textContent = defaultShareLabel; }, 2200);
              } catch (_) { window.prompt("Copy the Heritage Auto Finance website link:", shareData.url); }
            } else {
              window.prompt("Copy the Heritage Auto Finance website link:", shareData.url);
            }
          }
        }
      });
    }

    const progressBar = document.getElementById("scrollProgress");
    const updateScrollProgress = () => {
      if (!progressBar) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
    };
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    // Keep an Apply Now action available after the visitor scrolls past the hero.
    const floatingApply = document.getElementById("hafFloatingApply");
    if (floatingApply) {
      const updateFloatingApply = () => floatingApply.classList.toggle("is-visible", window.scrollY > 520);
      window.addEventListener("scroll", updateFloatingApply, { passive: true });
      updateFloatingApply();
    }

    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
      const updateTopButton = () => backToTop.classList.toggle("show", window.scrollY > 300);
      window.addEventListener("scroll", updateTopButton, { passive: true });
      updateTopButton();
      backToTop.addEventListener("click", event => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    document.querySelectorAll(".tab-btn").forEach((button, index) => {
      const categories = ["all", "loans", "insurance"];
      button.dataset.category = categories[index] || "all";
      button.setAttribute("aria-pressed", String(index === 0));
      button.addEventListener("click", event => filterPosters(button.dataset.category, event));
    });
    filterPosters("all");
    initPosterPreview();

    document.querySelectorAll(".faq-item").forEach(item => {
      item.setAttribute("aria-expanded", String(item.classList.contains("active")));
      item.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleFaq(item);
        }
      });
    });

    ["loanAmount", "interestRate", "loanTenure"].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.addEventListener("input", calculateEMI);
    });
    const income = document.getElementById("monthlyIncome");
    if (income) income.addEventListener("input", calculateEligibility);
    calculateEMI();
    calculateEligibility();
    initReveal();



    // Desktop-only pointer lighting: subtle, accessible depth without a heavy 3D library.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const hero = document.querySelector(".hero-banner");
      if (hero) {
        hero.addEventListener("pointermove", event => {
          const rect = hero.getBoundingClientRect();
          hero.style.setProperty("--haf-pointer-x", ((event.clientX - rect.left) / rect.width * 100) + "%");
          hero.style.setProperty("--haf-pointer-y", ((event.clientY - rect.top) / rect.height * 100) + "%");
        }, { passive: true });
        hero.addEventListener("pointerleave", () => {
          hero.style.setProperty("--haf-pointer-x", "50%");
          hero.style.setProperty("--haf-pointer-y", "40%");
        }, { passive: true });
      }
      document.querySelectorAll(".poster-grid .poster-item").forEach(card => {
        card.addEventListener("pointermove", event => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;
          card.style.setProperty("--haf-card-x", (x * 100) + "%");
          card.style.setProperty("--haf-card-y", (y * 100) + "%");
          card.style.transform = "perspective(900px) rotateX(" + ((.5 - y) * 4).toFixed(2) + "deg) rotateY(" + ((x - .5) * 5).toFixed(2) + "deg) translateY(-2px)";
        }, { passive: true });
        card.addEventListener("pointerleave", () => { card.style.transform = ""; }, { passive: true });
      });
    }



    // Active section indicator for the main navigation, with graceful fallback.
    const navLinks = Array.from(document.querySelectorAll('nav .nav-links a[href^="#"]'));
    const navTargets = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    if ("IntersectionObserver" in window && navTargets.length) {
      const navObserver = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach(link => {
          const active = link.getAttribute("href") === "#" + visible.target.id;
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }, { rootMargin: "-22% 0px -62% 0px", threshold: [0, .15, .35, .6] });
      navTargets.forEach(target => navObserver.observe(target));
    }


    // WhatsApp route: the visitor reviews and sends the prefilled enquiry themselves.
    const directWaForm = document.getElementById("directWhatsAppEnquiry");
    if (directWaForm && !directWaForm.dataset.bound) {
      directWaForm.dataset.bound = "true";
      directWaForm.addEventListener("submit", event => {
        event.preventDefault();
        if (!directWaForm.reportValidity()) return;
        const data = new FormData(directWaForm);
        const name = String(data.get("name") || "").trim();
        const phone = String(data.get("phone") || "").trim();
        const phoneDigits = phone.replace(/\\D/g, "");
        const enquiryType = String(data.get("enquiryType") || "").trim();
        const phoneInput = document.getElementById("waEnquiryPhone");
        const status = document.getElementById("waEnquiryStatus");
        if (phoneDigits.length < 10 || phoneDigits.length > 15) {
          if (phoneInput) {
            phoneInput.setCustomValidity("Please enter a valid phone number with 10 to 15 digits.");
            phoneInput.reportValidity();
            phoneInput.addEventListener("input", () => phoneInput.setCustomValidity(""), { once: true });
          }
          if (status) status.textContent = "Please check your mobile number and try again.";
          return;
        }
        if (phoneInput) phoneInput.setCustomValidity("");
        const message = String(data.get("message") || "").trim();
        const lines = ["Hello Heritage Auto Finance, I would like a callback.", "Name: " + name, "Mobile: " + phone, "Enquiry: " + enquiryType];
        if (message) lines.push("Message: " + message);
        lines.push("Please contact me about this enquiry.");
        const url = "https://wa.me/917600211085?text=" + encodeURIComponent(lines.join("\n"));
        if (status) status.textContent = "Opening WhatsApp. Review your details and press Send there to submit.";
        // Avoid "noopener" in the feature string: some browsers return null
        // even when the tab opens, causing an incorrect same-tab fallback.
        const waWindow = window.open(url, "_blank");
        if (waWindow) {
          try { waWindow.opener = null; } catch (error) { /* Cross-origin restrictions may apply. */ }
        } else {
          if (status) status.textContent = "Your browser blocked the new tab. Opening WhatsApp in this tab instead…";
          window.location.assign(url);
        }
      });
    }

    if (textArray.length) typeNext();
  }

  // Keep the existing inline handlers compatible with the separated script.
  window.filterPosters = filterPosters;
  window.calculateEMI = calculateEMI;
  window.calculateEligibility = calculateEligibility;
  window.toggleFaq = toggleFaq;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
