import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("styles.css", "utf8");
const js = readFileSync("app.js", "utf8");

assert.match(html, /<title>[^<]+<\/title>/i, "Page title should exist");
assert.match(html, /name="description"/i, "SEO description should exist");
assert.match(html, /hero-cta-primary/, "Primary callback CTA should exist");
assert.match(html, /hero-trust-points/, "Service highlights should exist");
assert.equal((html.match(/class="main-poster"/g) || []).length, 1, "Hero should show only one main poster");
assert.equal((html.match(/loading="lazy" decoding="async"/g) || []).length, 8, "Poster images should load lazily to reduce initial page work");
assert.match(html, /fetchpriority="high"/, "Hero poster should be prioritized");
assert.match(html, /documentation guidance dete hain/i, "Commercial finance copy must describe assistance accurately");
assert.doesNotMatch(html, /finance provide karte hain/i, "Avoid implying Heritage directly lends money");
assert.match(html, /id="scrollProgress"/, "Scroll progress indicator should exist");
assert.doesNotMatch(html, /5,000\+|24\/7/, "Unverified claims must not appear");
assert.match(html, /subject to the relevant lender or insurer/, "Finance disclaimer should exist");
assert.equal((html.match(/class="faq-item" role="button" tabindex="0"/g) || []).length, 4, "All FAQ items should be keyboard accessible");
assert.match(html, /href="styles\.css"/i, "HTML must load the external stylesheet");
assert.match(html, /src="app\.js"/i, "HTML must load the external JavaScript");
assert.ok(existsSync("styles.css"), "styles.css must exist");
assert.ok(existsSync("app.js"), "app.js must exist");

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
assert.equal((css.match(/\/\* Premium conversion-focused polish \*\//g) || []).length, 1, "Premium CSS rules should not be duplicated");
assert.match(css, /\.hs-form-frame\s*\{[^}]*overflow:\s*visible/s, "Embedded lead form must not be clipped");
assert.match(js, /function calculateEMI\s*\(/, "EMI calculator handler must exist");
assert.match(js, /function calculateEligibility\s*\(/, "Affordability calculator handler must exist");
assert.match(js, /function filterPosters\s*\(/, "Poster filter handler must exist");
assert.match(js, /function toggleFaq\s*\(/, "FAQ handler must exist");
assert.match(js, /IntersectionObserver/, "Scroll reveal should use IntersectionObserver");
assert.match(js, /updateScrollProgress/, "Scroll progress behavior should exist");
assert.doesNotMatch(js, /Your inquiry has been submitted\./, "Do not claim a lead was submitted without confirmed form success");

console.log("Website smoke tests passed.");
console.log(`Checked ${ids.length} HTML ids, local asset references, navigation targets, responsive CSS, form visibility, and core JavaScript handlers.`);
