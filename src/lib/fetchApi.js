export default async (path, method, cb) => {
  const api_domain = process.env.NODE_ENV == "development" ? "http://localhost:3000" : ""
  let reponse = await fetch(api_domain + "/api/" + path, { 
    method: method,
    credentials: 'include'
  })
  try {
    let obj = await reponse.json()
    cb(reponse, obj.data)
  } catch (error) {
    cb(reponse, error)
  }
}