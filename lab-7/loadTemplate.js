const cache = new Map();

export const loadTemplate = async url => {
  if (!cache.has(url))
    cache.set(url, fetch(url, { cache: 'no-store' })
      .then(r => r.ok ? r.text() : Promise.reject(new Error(`Template load failed: ${url} (${r.status})`)))
      .then(html => Object.assign(document.createElement('template'), { innerHTML: html.trim() }).content)
    );

  return (await cache.get(url)).cloneNode(true);
};
