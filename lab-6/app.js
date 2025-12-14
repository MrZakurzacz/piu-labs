import { Ajax } from "./Ajaxlib.js"

const api = new Ajax({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000
})

const $ = id => document.getElementById(id)
const [btnLoad, btnError, btnReset, list, loader, errorBox] =
  ["Load","Error","Reset","list","loading","error"].map($)

const loading = v => (loader.style.display = v ? "block" : "none")
const setError = (m = "") => (errorBox.textContent = m)
const render = items =>
  (list.innerHTML = items.map(i => `<li>${i.id}: ${i.title}</li>`).join(""))

const run = (path, prefix = "") => {
  loading(1); setError(); list.innerHTML = ""
  return api.get(path)
    .then(d => d && render(d))
    .catch(e => setError(prefix + e.message))
    .finally(() => loading(0))
}

btnLoad.onclick  = () => run("/posts?_limit=10")
btnError.onclick = () => run("/wrong-endpoint", "Błąd: ")
btnReset.onclick = () => { list.innerHTML = ""; setError() }
