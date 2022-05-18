import {formatDate} from '../misc'

test('formatDate formats the date to look nice', () => {
  expect(formatDate(new Date('September 6, 1969'))).toBe('Sep 69')
})
