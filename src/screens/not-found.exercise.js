/** @jsx jsx */
import {jsx} from '@emotion/core'

// This page displays a regular link on the page, and we've got a styled component
// for that.
// 🐨 Import the Link from 'components/lib'
import {Link} from 'components/lib'
// 💰 and feel free to take a peek at the implementation of that styled component
// to be reminded how you can create styled components out of existing components

function NotFoundScreen() {
  return (
    <div
      css={{
        height: '100%',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        <p>Sorry... nothing here.</p>
        {/* 🐨 add a <Link> here that says "Go home" and sends the user to "/discover" */}
        <Link to="/discover">Go home</Link>
      </div>
    </div>
  )
}

export {NotFoundScreen}
