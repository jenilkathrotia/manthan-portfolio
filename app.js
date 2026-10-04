const themes = {
  soil: { title: 'Understand the ground.', body: 'The report examines soil classification, groundwater conditions, and site characterization methods including SPT, CPT, and MASW.', y: '132' },
  response: { title: 'Trace the response.', body: 'The literature review connects subsurface stratigraphy and shear-wave velocity with local site effects and the response of ground to earthquake shaking.', y: '224' },
  risk: { title: 'Inform better decisions.', body: 'The study explores liquefaction susceptibility and seismic microzonation as inputs to site-specific hazard assessment and infrastructure planning.', y: '66' }
};
const tabs = [...document.querySelectorAll('[data-theme]')];
const panel = document.getElementById('research-panel');
function selectTheme(tab) {
  const theme = themes[tab.dataset.theme];
  tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
  panel.setAttribute('aria-labelledby', tab.id);
  panel.querySelector('h4').textContent = theme.title;
  panel.querySelector('p').textContent = theme.body;
  document.querySelector('.soil-node').setAttribute('cy', theme.y);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTheme(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTheme(tabs[next]); tabs[next].focus(); }
  });
});
document.getElementById('year').textContent = new Date().getFullYear();
