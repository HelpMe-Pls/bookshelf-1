/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {FullPageSpinner} from './components/lib'
import * as colors from './styles/colors'
import {client} from './utils/api-client'
import {useAsync} from './utils/hooks'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

function App() {
  const {data, error, isIdle, isLoading, isSuccess, isError, run, setData} =
    useAsync()

  React.useEffect(() => {
    run(getUser()).then(u => setData(u))
  }, [run, setData])

  const login = form => auth.login(form).then(u => setData(u))
  const register = form => auth.register(form).then(u => setData(u))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

  if (isSuccess) {
    return data ? (
      <AuthenticatedApp user={data} logout={logout} />
    ) : (
      <UnauthenticatedApp login={login} register={register} />
    )
  }
}

export {App}
