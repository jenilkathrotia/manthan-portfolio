# Portfolio analytics

## Activation required

Tracking is prepared but disabled until a real Google Analytics 4 web-stream measurement ID is entered in `analytics-config.js`. GitHub Pages cannot store analytics by itself. No analytics data is collected while the ID is empty.

1. Open https://analytics.google.com/ and create/select your Analytics account and GA4 property.
2. In Admin → Data streams, add a Web stream for `https://jenilkathrotia.github.io/manthan-portfolio/`.
3. Copy the measurement ID beginning `G-` and enter it in `analytics-config.js`, then commit and push.
4. For this single-page portfolio, disable enhanced-measurement scroll, file-download, and outbound-click events if you want only the explicitly defined events below. Disable page-view history-change measurement to avoid counting anchor navigation as another visit.
5. Open the live site and check Realtime; click the résumé and contact links and scroll to the bottom. Verify events arrive in the correct property before treating collection as active.

## Reports and event definitions

- Views: `page_view`. Sessions estimate visits; Total users estimates unique browser users, not named people or deduplicated humans across devices.
- `scroll_25`, `scroll_50`, `scroll_75`, `scroll_100`: each fires once per page load at the corresponding percentage of the scrollable distance. 100 means the viewport reached the bottom; it does not prove every section was read. Anchor jumps may cross multiple milestones.
- `resume_download`: a click on a résumé download link, not proof that the browser completed saving the file.
- `resume_view`: a click on the full-experience PDF view link.
- `contact_click`: email or LinkedIn link clicks, not confirmed messages or new connections.
- `conference_qr_visit`: a page load using the conference-tagged URL. Forwarding that URL preserves the tag, so this measures tagged traffic rather than proving a physical QR scan.

Use Reports → Engagement → Events for event counts, and Acquisition → Traffic acquisition for conference / qr traffic. Use Total users and Sessions in reports/explorations for audience counts. Register event-scoped custom dimensions for `traffic_origin`, `placement`, and `contact_method` if you want these breakdowns in explorations. Standard reports may take 24–48 hours to populate.

## Conference QR

The PNG and SVG now encode:

`https://jenilkathrotia.github.io/manthan-portfolio/?utm_source=conference&utm_medium=qr&utm_campaign=portfolio`

Use the new QR assets on conference materials. Previously downloaded or printed QR codes have no campaign parameters and cannot be retroactively attributed to the conference. Analytics only records after activation; earlier visits cannot be reconstructed.

## Collection boundaries

No names, email addresses, user IDs, arbitrary query strings, or URL fragments are sent by the custom tracking. Google Analytics uses its own browser identifiers/cookies for visitor estimates. Google Signals and advertising personalization are disabled. The script respects Do Not Track and Global Privacy Control. Blocking analytics or enabling these browser preferences excludes that traffic. Contact links and downloads work normally even if analytics is unavailable.

Official reference: https://developers.google.com/analytics/devguides/collection/ga4/events
