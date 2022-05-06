const apiURL = process.env.REACT_APP_API_URL

async function client(endpoint, token, customConfig = {}) {
  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    ...customConfig,
  }

  const response = await window.fetch(`${apiURL}/${endpoint}`, config)
  const data = await response.json()
  if (response.ok) {
    return data
  } else {
    return Promise.reject(data)
  }
}

export {client}
