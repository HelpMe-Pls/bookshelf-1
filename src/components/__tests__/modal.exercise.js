// 🐨 you're gonna need this stuff:
import * as React from 'react'
import {Modal, ModalContents, ModalOpenButton} from '../modal'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('can be opened and closed', async () => {
  const label = 'Modal Label'
  const title = 'Modal Title'
  const content = 'Modal content'

  // 🐨 render the Modal, ModalOpenButton, and ModalContents
  render(
    <Modal>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
      <ModalContents aria-label={label} title={title}>
        <div>{content}</div>
      </ModalContents>
    </Modal>,
  )

  // 💰 Remember all userEvent utils are async, so you need to await them.
  // 🐨 click the open button
  await userEvent.click(screen.getByRole('button', {name: /open/i}))

  // 🐨 verify the <Modal/> contains the {label}, {title}, {content}
  const modal = screen.getByRole('dialog')
  expect(modal).toHaveAttribute('aria-label', label)
  const inModal = within(modal)
  expect(inModal.getByRole('heading', {name: title})).toBeInTheDocument()
  expect(inModal.getByText(content)).toBeInTheDocument()

  // 🐨 click the close button
  await userEvent.click(screen.getByRole('button', {name: /close/i}))

  // 🐨 verify the modal is no longer rendered
  // 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
