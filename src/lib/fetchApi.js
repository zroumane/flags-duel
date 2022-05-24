export default (path, method, cb) => {
  const api_domain = process.env.NODE_ENV == "development" ? "http://localhost:3000" : ""
  fetch(api_domain + "/api/" + path, { method: method})
  .then((rep) => rep.json()).then((obj) => cb(obj.data))
  .catch((err) => cb(err))
}