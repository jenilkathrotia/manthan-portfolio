const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = readFileSync(`${__dirname}/analytics.js`, 'utf8');
function setup({ id = 'G-TEST123', dnt = false, conference = false } = {}) {
  const listeners = {}, docListeners = {}, scripts = [];
  const location = new URL(`https://jenilkathrotia.github.io/manthan-portfolio/${conference ? '?utm_source=conference&utm_medium=qr&utm_campaign=portfolio&email=private' : ''}`);
  const window = { PORTFOLIO_ANALYTICS: { measurementId: id }, innerHeight: 800, scrollY: 0,
    addEventListener: (n, fn) => listeners[n] = fn, requestAnimationFrame: fn => fn() };
  const document = { referrer: '', visibilityState: 'visible', documentElement: { scrollHeight: 4800 },
    head: { appendChild: node => scripts.push(node) }, createElement: () => ({}),
    addEventListener: (n, fn) => docListeners[n] = fn };
  vm.runInNewContext(code, { window, document, navigator: { doNotTrack: dnt ? '1' : '0' }, location, URL, URLSearchParams, Set, Date });
  const events = () => Array.from(window.dataLayer || []).filter(x => x[0] === 'event').map(x => ({ name: x[1], details: x[2] }));
  const scroll = y => { window.scrollY = y; listeners.scroll(); };
  const click = (href, download = false, type = 'click', button = 0) => docListeners[type]({ type, button, target: { closest: () => ({ href, hasAttribute: () => download, closest: () => null }) } });
  return { window, document, scripts, events, scroll, click };
}
assert.equal(setup({ id: '' }).scripts.length, 0);
assert.equal(setup({ dnt: true }).scripts.length, 0);
const s = setup({ conference: true });
assert.equal(s.scripts.length, 1);
assert.equal(s.events()[0].name, 'conference_qr_visit');
assert.ok(!s.window.dataLayer[1][2].page_location.includes('private'));
s.scroll(999); assert.equal(s.events().length, 1);
s.scroll(1000); s.scroll(2000); s.scroll(3000); s.scroll(3998); s.scroll(0); s.scroll(4000);
assert.deepEqual(s.events().slice(1).map(x => x.name), ['scroll_25', 'scroll_50', 'scroll_75', 'scroll_100']);
s.click('https://jenilkathrotia.github.io/manthan-portfolio/assets/manthan-barvaliya-resume.pdf', true);
s.click('https://jenilkathrotia.github.io/manthan-portfolio/assets/manthan-barvaliya-resume.pdf');
s.click('mailto:manthanbarvalia@gmail.com');
s.click('https://www.linkedin.com/in/manthanbarvaliya/', false, 'auxclick', 1);
assert.deepEqual(s.events().slice(5).map(x => x.name), ['resume_download', 'resume_view', 'contact_click', 'contact_click']);
assert.ok(!JSON.stringify(s.events()).includes('@'));
s.click('https://example.com/'); assert.equal(s.events().length, 9);
const hidden = setup(); hidden.document.visibilityState = 'hidden'; hidden.scroll(4000); assert.equal(hidden.events().length, 0);
const short = setup(); short.document.documentElement.scrollHeight = 600; short.scroll(1); assert.equal(short.events().length, 0);
console.log('Analytics checks passed: activation, privacy preferences, campaign tagging, scroll deduplication, and link events.');
