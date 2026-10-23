import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("styles.css", "utf8");
const js = readFileSync("app.js", "utf8");
const premium = readFileSync("premium.css", "utf8");

assert.match(html, /<title>[^<]+<\/title>/i, "Page title should exist");
assert.equal((html.match(/<main\b/gi) || []).length, 1, "Homepage should expose one main landmark");
assert.equal((html.match(/<\/main>/gi) || []).length, 1, "Main landmark should be properly closed");
assert.match(html, /class="skip-link" href="#main-content"/, "Skip navigation should jump to the main landmark");
assert.match(html, /<main id="main-content" tabindex="-1">/, "Main landmark should receive keyboard focus after skip navigation");

assert.match(html, /name="description"/i, "SEO description should exist");
assert.match(html, /rel="canonical" href="https:\/\/heritageautofinance\.netlify\.app\//i, "Canonical URL should use the production Netlify domain");
assert.match(html, /property="og:url" content="https:\/\/heritageautofinance\.netlify\.app\//i, "Social preview URL should use the production domain");
assert.match(html, /hero-cta-primary/, "Primary callback CTA should exist");
assert.match(html, /hero-trust-points/, "Service highlights should exist");
assert.equal((html.match(/class="main-poster"/g) || []).length, 1, "Hero should show only one main poster");
assert.equal((html.match(/loading="lazy" decoding="async"/g) || []).length, 8, "Poster images should load lazily to reduce initial page work");
assert.match(html, /fetchpriority="high"/, "Hero poster should be prioritized");
assert.match(html, /<link rel="preload" as="image" href="03\.png" fetchpriority="high">/, "Hero poster should be preloaded for faster initial rendering");
assert.match(html, /documentation guidance dete hain/i, "Commercial finance copy must describe assistance accurately");
assert.match(html, /Hum used car finance ke liye enquiry aur documentation guidance dete hain/i, "Used-car FAQ must describe assistance rather than imply direct lending");
assert.doesNotMatch(html, /Humari used car finance scheme ke tahat/i, "Avoid implying Heritage runs its own lending scheme");
for (const id of ["loanAmount", "interestRate", "loanTenure", "monthlyIncome"]) {
  assert.match(html, new RegExp(`id="${id}" aria-label="[^"]+"`), `${id} slider should have an accessible name`);
}
assert.doesNotMatch(html, /finance provide karte hain/i, "Avoid implying Heritage directly lends money");
assert.match(html, /id="scrollProgress"/, "Scroll progress indicator should exist");
assert.doesNotMatch(html, /5,000\+|24\/7/, "Unverified claims must not appear");
assert.match(html, /subject to the relevant lender or insurer/, "Finance disclaimer should exist");
assert.equal((html.match(/class="faq-item" role="button" tabindex="0" aria-expanded="false" aria-controls="faq-answer-\d+"/g) || []).length, 4, "All FAQ items should be keyboard accessible and linked to their answers");
assert.match(html, /href="styles\.css(?:\?v=[^"]*)?"/i, "HTML must load the external stylesheet, including an optional cache version");
assert.match(html, /href="premium\.css"/i, "HTML must load premium refinement styles");
assert.match(html, /privacy-policy\.html/, "Privacy policy must be linked from the homepage");
assert.match(html, /form-privacy-note/, "Callback form must show a privacy and sensitive-data notice");
assert.match(html, /Do not submit Aadhaar, PAN, bank account details/i, "Initial enquiry form must warn against sharing sensitive documents");
assert.match(html, /terms\.html/, "Terms must be linked from the homepage");
assert.ok(existsSync("privacy-policy.html"), "Privacy policy page must exist");
assert.ok(existsSync("terms.html"), "Terms page must exist");
assert.match(readFileSync("privacy-policy.html", "utf8"), /rel="canonical" href="https:\/\/heritageautofinance\.netlify\.app\/privacy-policy\.html"/i, "Privacy policy canonical must use the production domain");
assert.match(readFileSync("terms.html", "utf8"), /rel="canonical" href="https:\/\/heritageautofinance\.netlify\.app\/terms\.html"/i, "Terms canonical must use the production domain");

assert.match(premium, /\.legal-page/, "Legal pages must use the shared premium layout");
assert.match(html, /src="app\.js(?:\?v=[^"]*)?"/i, "HTML must load the external JavaScript, including an optional cache version");
assert.ok(existsSync("styles.css"), "styles.css must exist");
assert.ok(existsSync("app.js"), "app.js must exist");
assert.match(js, /function initPosterPreview\(\)/, "Poster gallery should support a full-screen preview");
assert.match(js, /dialog\.showModal\(\)/, "Poster preview should open as an accessible dialog");
assert.match(premium + readFileSync("next-level.css", "utf8"), /poster-preview-dialog/, "Poster preview should have responsive styling");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
assert.deepEqual([...new Set(duplicateIds)], [], "HTML ids must be unique");

for (const match of html.matchAll(/(?:src|href)="(?!https?:|\/\/|#|mailto:|tel:|data:)([^"]+)"/g)) {
  const path = match[1].split(/[?#]/)[0];
  if (path && !path.startsWith("javascript:")) {
    assert.ok(existsSync(path), `Local asset referenced by HTML must exist: ${path}`);
  }
}
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(ids.includes(match[1]), `In-page link target must exist: #${match[1]}`);
}

assert.match(css, /@media\s*\(max-width:\s*768px\)/, "Mobile layout rules should exist");
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, "Reduced-motion preferences should be respected");
assert.equal((css.match(/\/\* Premium conversion-focused polish \*\//g) || []).length, 1, "Premium CSS rules should not be duplicated");
assert.match(css, /\.hs-form-frame\s*\{[^}]*overflow:\s*visible/s, "Embedded lead form must not be clipped");
assert.match(html, /id="emiWhatsApp"[^>]+href="https:\/\/wa\.me\/917600211085/i, "EMI estimate should offer a WhatsApp follow-up");
assert.match(html, /class="enquiry-path-grid"/, "Service-specific enquiry paths should be visible");
assert.match(html, /This simplified illustration multiplies monthly income by 30\. It is not a lender eligibility calculation/i, "Affordability illustration must explain its simplified formula and limits");
assert.match(html, /id="emiResult" aria-live="polite" aria-atomic="true"/, "EMI result updates should be announced to assistive technology");
assert.match(html, /id="eligibleResult" aria-live="polite" aria-atomic="true"/, "Affordability result updates should be announced to assistive technology");
for (const enquiryType of ["new car finance", "used car finance", "commercial vehicle finance", "vehicle refinance", "motor insurance"]) {
  assert.ok(html.toLowerCase().includes(enquiryType), `A WhatsApp enquiry path should cover: ${enquiryType}`);
}
assert.match(html, /Do not send Aadhaar, PAN, bank details/i, "WhatsApp enquiry paths must include a sensitive-data warning");
for (const id of ["principalSummary", "interestSummary", "totalSummary", "emiWhatsApp"]) {
  assert.match(html, new RegExp(`id="${id}"`), `EMI summary must include #${id}`);
}
assert.match(js, /totalRepayment\s*=\s*safeEmi\s*\*\s*months/, "EMI summary should calculate total repayment from EMI and tenure");
assert.match(js, /encodeURIComponent\(message\)/, "EMI WhatsApp message should URL-encode the estimate");
assert.match(html, /href="tel:\+917600211085"[^>]*class="mobile-action-call"/, "Mobile quick actions should include a working call link");
assert.match(html, /href="https:\/\/wa\.me\/917600211085[^"]*"[^>]*class="mobile-action-whatsapp"[^>]*target="_blank" rel="noopener noreferrer"/, "Mobile WhatsApp link should safely open in a new tab");
assert.match(html, /href="#contact"[^>]*class="mobile-action-callback"/, "Mobile quick actions should include the callback form shortcut");
assert.match(js, /function calculateEMI\s*\(/, "EMI calculator handler must exist");
assert.match(js, /function calculateEligibility\s*\(/, "Affordability calculator handler must exist");
assert.match(js, /function filterPosters\s*\(/, "Poster filter handler must exist");
assert.match(js, /function toggleFaq\s*\(/, "FAQ handler must exist");
assert.match(js, /IntersectionObserver/, "Scroll reveal should use IntersectionObserver");
assert.match(js, /updateScrollProgress/, "Scroll progress behavior should exist");
assert.doesNotMatch(js, /Your inquiry has been submitted\./, "Do not claim a lead was submitted without confirmed form success");


const favicon = readFileSync("favicon.svg", "utf8");
assert.match(favicon, /<svg[\s>]/i, "Branded favicon must be a valid SVG document");
for (const page of ["index.html", "404.html", "privacy-policy.html", "terms.html"]) {
  const pageHtml = readFileSync(page, "utf8");
  assert.match(pageHtml, /rel="icon"[^>]+href="favicon\.svg"/i, `${page} should load the branded favicon`);
}
assert.ok(existsSync("robots.txt"), "Robots instructions must exist");
assert.ok(existsSync("sitemap.xml"), "XML sitemap must exist");
const robots = readFileSync("robots.txt", "utf8");
const sitemap = readFileSync("sitemap.xml", "utf8");
assert.match(robots, /Sitemap:\s*https:\/\/heritageautofinance\.netlify\.app\/sitemap\.xml/i, "Robots file must advertise the production sitemap");
assert.match(sitemap, /<urlset[\s>]/i, "Sitemap must contain a URL set");
assert.match(sitemap, /https:\/\/heritageautofinance\.netlify\.app\//i, "Sitemap must list the production homepage");
assert.match(sitemap, /privacy-policy\.html/i, "Sitemap must include the privacy policy");
assert.match(sitemap, /terms\.html/i, "Sitemap must include the terms page");

const notFound = readFileSync("404.html", "utf8");
assert.match(notFound, /<title>Page Not Found \| Heritage Auto Finance<\/title>/, "Custom 404 page should have a clear title");
assert.match(notFound, /href="\.\/"[^>]*>Go to homepage|href="\.\/"[^>]*>← Back to homepage/, "Custom 404 page should link home");
assert.match(notFound, /wa\.me\/917600211085/, "Custom 404 page should provide a WhatsApp help path");

console.log("Website smoke tests passed.");
console.log(`Checked ${ids.length} HTML ids, local asset references, navigation targets, responsive CSS, favicon and SEO assets, form visibility, and core JavaScript handlers.`);

assert.equal((html.match(/aria-controls="faq-answer-\d+"/g) || []).length, 4, "Each FAQ trigger should reference its answer region");
assert.equal((html.match(/class="faq-answer" id="faq-answer-\d+" role="region"/g) || []).length, 4, "FAQ answers should expose named regions to assistive technology");

assert.match(premium, /:where\(a,button,input,select,textarea,\[role="button"\],\[tabindex\]\):focus-visible/, "Interactive controls should have a consistent visible keyboard focus indicator");


// Keep sitemap entries aligned with real, tracked site pages and production URLs.
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.ok(sitemapLocations.length >= 3, "Sitemap should list the homepage and legal pages");
assert.equal(new Set(sitemapLocations).size, sitemapLocations.length, "Sitemap URLs should not be duplicated");
for (const url of sitemapLocations) {
  assert.match(url, /^https:\/\/heritageautofinance\.netlify\.app\//, "Sitemap entries must use the canonical production host");
  const pathname = new URL(url).pathname;
  const localPage = pathname === "/" ? "index.html" : pathname.slice(1);
  assert.ok(existsSync(localPage), `Sitemap entry must point to a tracked page: ${url}`);
}
assert.match(notFound, /name="viewport"/, "Custom 404 page should be responsive on mobile");
assert.match(notFound, /rel="noopener noreferrer"/, "External 404 links should use safe target attributes");


const attribution = readFileSync("lead-tracking.js", "utf8");
assert.match(html, /src="lead-tracking\.js(?:\?v=[^"]*)?" defer/i, "Homepage must load the enquiry attribution module");
assert.match(attribution, /utm_source[\s\S]*utm_medium[\s\S]*utm_campaign[\s\S]*utm_content/, "Enquiry attribution should support standard UTM campaign fields");
assert.match(attribution, /heritage:enquiry/, "WhatsApp enquiry clicks should emit the documented attribution event");
assert.match(attribution, /new URL\(link\.href\)/, "WhatsApp links should be parsed safely before attribution is added");
assert.doesNotMatch(attribution, /localStorage|sessionStorage|document\.cookie/, "Enquiry attribution must not persist tracking data in browser storage");
assert.match(html, /form-fallback-actions/, "A direct contact fallback must remain available if the third-party callback form fails");

assert.equal((html.match(/<h1\b/gi) || []).length, 1, "Homepage should have one primary semantic heading");
assert.match(html, /<h1 class="typing-container">Finance for your/, "The hero message should be the primary page heading");
for (const phrase of ["new car finance", "used car finance", "vehicle refinance", "commercial vehicle finance", "motor insurance assistance"]) {
  assert.ok(html.toLowerCase().includes(phrase), "Service enquiry copy should cover: " + phrase);
}
assert.equal((html.match(/class="service-tile" href="https:\/\/wa\.me\/917600211085[^"]*" target="_blank" rel="noopener noreferrer"/g) || []).length, 5, "Each service shortcut should open a service-specific WhatsApp enquiry safely");


assert.match(html, /fonts\.googleapis\.com/, "Font origin should be preconnected for faster rendering");
assert.match(html, /fonts\.gstatic\.com/, "Font asset origin should be preconnected");
assert.match(readFileSync("elite-finish.css", "utf8"), /env\(safe-area-inset-bottom\)/, "Mobile controls should respect device safe areas");
assert.match(readFileSync("elite-finish.css", "utf8"), /touch-action:\s*manipulation/, "Interactive controls should avoid delayed touch handling");

assert.match(html, /fonts\.googleapis\.com\/css2\?family=Playfair\+Display/, "Google Fonts stylesheet should be discoverable directly from the document head");
assert.doesNotMatch(css, /^@import\s+url\(['"]https:\/\/fonts\.googleapis\.com/m, "Main stylesheet should not hide font loading behind CSS @import");
