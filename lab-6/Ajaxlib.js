export class Ajax {
  constructor({ baseURL = '', headers = {}, timeout = 5000 } = {}) {
    this.d = {
      baseURL,
      headers: { 'Content-Type': 'application/json', ...headers },
      timeout
    }
  }

  async request(method, url, data = null, o = {}) {
    const c = new AbortController()
    const t = o.timeout ?? this.d.timeout
    const id = setTimeout(() => c.abort(), t)

    try {
      const r = await fetch((o.baseURL ?? this.d.baseURL) + url, {
        method,
        headers: { ...this.d.headers, ...o.headers },
        signal: c.signal,
        ...(data && { body: JSON.stringify(data) })
      })

      if (!r.ok) {
        const txt = await r.text().catch(() => '')
        throw new Error(`HTTP ${r.status} ${r.statusText}: ${txt}`)
      }

      return await r.json().catch(() => null)
    } catch (e) {
      if (e.name === 'AbortError') throw new Error(`Timeout ${t} ms`)
      throw new Error(`Network error: ${e.message}`)
    } finally {
      clearTimeout(id)
    }
  }

  get(url, o) { return this.request('GET', url, null, o) }
  post(url, d, o) { return this.request('POST', url, d, o) }
  put(url, d, o) { return this.request('PUT', url, d, o) }
  delete(url, o) { return this.request('DELETE', url, null, o) }
}
