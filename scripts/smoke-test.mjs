import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("styles.css", "utf8");
const js = readFileSync("app.js", "utf8");

assert.match(html, /<title>[^<]+<\/title>/i, "Page title should exist");
assert.match(html, /name="description"/i, "SEO description should exist");
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
assert.match(css, /\.hs-form-frame\s*\{[^}]*overflow:\s*visible/s, "Embedded lead form must not be clipped");
assert.match(js, /function calculateEMI\s*\(/, "EMI calculator handler must exist");
assert.match(js, /function calculateEligibility\s*\(/, "Affordability calculator handler must exist");
assert.match(js, /function filterPosters\s*\(/, "Poster filter handler must exist");
assert.match(js, /function toggleFaq\s*\(/, "FAQ handler must exist");
assert.match(js, /IntersectionObserver/, "Scroll reveal should use IntersectionObserver");
assert.doesNotMatch(js, /Your inquiry has been submitted\./, "Do not claim a lead was submitted without confirmed form success");

console.log("Website smoke tests passed.");
console.log(`Checked ${ids.length} HTML ids, local asset references, navigation targets, responsive CSS, form visibility, and core JavaScript handlers.`);
