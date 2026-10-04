(() => {
  'use strict';
  const id = window.PORTFOLIO_ANALYTICS?.measurementId || '';
  if (!/^G-[A-Z0-9]+$/.test(id)) return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
  if (location.hostname !== 'jenilkathrotia.github.io') return;

  const params = new URLSearchParams(location.search);
  const conference = params.get('utm_source') === 'conference' && params.get('utm_medium') === 'qr';
  const source = conference ? 'conference_qr' : 'other';
  // Do not send arbitrary query strings, fragment contents, or contact addresses.
  const cleanLocation = new URL(location.origin + location.pathname);
  if (conference) {
    cleanLocation.searchParams.set('utm_source', 'conference');
    cleanLocation.searchParams.set('utm_medium', 'qr');
    cleanLocation.searchParams.set('utm_campaign', 'portfolio');
  }
  let referrer = '';
  try { referrer = new URL(document.referrer).origin; } catch {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, {
    send_page_view: true,
    page_location: cleanLocation.href,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  const track = (name, details = {}) => window.gtag('event', name, {
    traffic_origin: source,
    transport_type: 'beacon',
    ...details
  });
  if (conference) track('conference_qr_visit');

  const milestones = [25, 50, 75, 100];
  const sent = new Set();
  let scheduled = false;
  function checkScroll() {
    scheduled = false;
    if (document.visibilityState === 'hidden') return;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    if (available <= 0 || window.scrollY <= 0) return;
    // Two pixels of tolerance accounts for fractional CSS pixels at the bottom.
    const depth = window.scrollY >= available - 2 ? 100 : Math.min(99, window.scrollY / available * 100);
    for (const milestone of milestones) {
      if (depth >= milestone && !sent.has(milestone)) {
        sent.add(milestone);
        track(`scroll_${milestone}`, { percent_scrolled: milestone });
      }
    }
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(checkScroll); }
  }, { passive: true });

  function trackLink(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    const placement = link.closest('.hero') ? 'hero' : link.closest('#work') ? 'work' : link.closest('#contact') ? 'contact' : 'other';
    if (url.origin === location.origin && url.pathname.endsWith('/assets/manthan-barvaliya-resume.pdf')) {
      track(link.hasAttribute('download') ? 'resume_download' : 'resume_view', { placement });
    } else if (url.protocol === 'mailto:') {
      track('contact_click', { contact_method: 'email', placement });
    } else if (url.hostname === 'www.linkedin.com' || url.hostname === 'linkedin.com') {
      track('contact_click', { contact_method: 'linkedin', placement });
    }
  }
  document.addEventListener('click', trackLink);
  document.addEventListener('auxclick', trackLink);
})();
