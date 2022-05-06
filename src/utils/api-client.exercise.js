import * as auth from 'auth-provider'
const apiURL = process.env.REACT_APP_API_URL

async function client(
  endpoint,
  {token, data, headers: customHeaders, ...customConfig} = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  const response = await window.fetch(`${apiURL}/${endpoint}`, config)
  if (response.status === 401) {
    await auth.logout()
    // refresh the page for them
    window.location.assign(window.location)
    return Promise.reject({message: 'Please re-authenticate.'})
  }
  const res = await response.json()
  if (response.ok) {
    return res
  } else {
    return Promise.reject(res)
  }
}

export {client}
