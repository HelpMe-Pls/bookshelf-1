// 🐨 instead of React Testing Library, you'll use React Hooks Testing Library
import {renderHook, act} from '@testing-library/react'

// 🐨 Here's the thing you'll be testing:
import {useAsync} from '../hooks'

// 💰 I'm going to give this to you. It's a way for you to create a promise
// which you can imperatively resolve or reject whenever you want.

// Use it like this:
// const {promise, resolve} = deferred()
// promise.then(() => console.log('resolved'))
// do stuff/make assertions you want to before calling resolve
// resolve()
// await promise
// do stuff/make assertions you want to after the promise has resolved
function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

beforeEach(() => {
  jest.spyOn(console, 'error')
})

afterEach(() => {
  console.error.mockRestore()
})

// 🐨 flesh out these tests
test('calling run with a promise which resolves', async () => {
  // 🐨 get a promise and resolve function from the deferred utility
  const {promise, resolve} = deferred()

  // 🐨 use renderHook with useAsync to get the result
  const {result} = renderHook(() => useAsync())

  // 🐨 assert the result.current is the correct default state
  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,

    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,

    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })

  // 🐨 call `run`, passing the promise
  //    (💰 this updates state so it needs to be done in an `act` callback)
  let prms
  act(() => {
    prms = result.current.run(promise)
  })

  // 🐨 assert that result.current is the correct "pending" state
  expect(result.current).toEqual({
    status: 'pending',
    data: null,
    error: null,

    isIdle: false,
    isLoading: true,
    isError: false,
    isSuccess: false,

    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })

  // 🐨 call resolve and wait for the promise to be resolved
  //    (💰 this updates state too and you'll need it to be an async `act` call so you can await the promise)
  const resolvedValue = Symbol('resolved value')
  await act(async () => {
    resolve(resolvedValue)
    await prms
  })

  // 🐨 assert the resolved state
  expect(result.current).toEqual({
    status: 'resolved',
    data: resolvedValue,
    error: null,

    isIdle: false,
    isLoading: false,
    isError: false,
    isSuccess: true,

    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })

  // 🐨 call `reset` (💰 this will update state, so...)
  act(() => {
    result.current.reset()
  })

  // 🐨 assert the result.current has actually been reset (back to 'idle')
  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,

    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,

    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
})

test('calling run with a promise which rejects', async () => {
  // 🐨 this will be very similar to the previous test, except you'll reject the
  // promise instead and assert on the error state (not assert the `result.current` has actually been reset).
  const {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,

    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,

    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })

  let prms
  act(() => {
    prms = result.current.run(promise)
  })
  expect(result.current).toEqual({
    status: 'pending',
    data: null,
    error: null,

    isIdle: false,
    isLoading: true,
    isError: false,
    isSuccess: false,

    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })

  // 💰 to avoid the promise actually failing your test, you can catch
  // the promise returned from `run` with `.catch(() => {})`
  const rejectedValue = Symbol('rejected value')
  await act(async () => {
    reject(rejectedValue)
    await prms.catch(() => {
      /* ignore erorr */
    })
  })
  expect(result.current).toEqual({
    data: null,
    error: rejectedValue,
    status: 'rejected',

    isIdle: false,
    isLoading: false,
    isError: true,
    isSuccess: false,

    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
})

test('can specify an initial state', () => {
  const mockData = Symbol('resolved value')

  // 💰 useAsync(customInitialState)
  const customInitialState = {status: 'resolved', data: mockData}
  const {result} = renderHook(() => useAsync(customInitialState))

  expect(result.current).toEqual({
    status: 'resolved',
    data: mockData,
    error: null,

    isIdle: false,
    isLoading: false,
    isError: false,
    isSuccess: true,

    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
})

test('can set the data', () => {
  const mockData = Symbol('resolved value')
  const {result} = renderHook(() => useAsync())

  // 💰 result.current.setData('whatever you want')
  act(() => {
    result.current.setData(mockData)
  })

  expect(result.current).toEqual({
    status: 'resolved',
    data: mockData,
    error: null,

    isIdle: false,
    isLoading: false,
    isError: false,
    isSuccess: true,

    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
})

test('can set the error', () => {
  const mockMessage = Symbol('rejected value')
  const {result} = renderHook(() => useAsync())

  // 💰 result.current.setError('whatever you want')
  act(() => {
    result.current.setError(mockMessage)
  })

  expect(result.current).toEqual({
    status: 'rejected',
    data: null,
    error: mockMessage,

    isIdle: false,
    isLoading: false,
    isError: true,
    isSuccess: false,

    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
})

test('No state updates happen if the component is unmounted while pending', async () => {
  // 💰 const {result, unmount} = renderHook(...)
  const {promise, resolve} = deferred()
  const {result, unmount} = renderHook(() => useAsync())

  let prms
  act(() => {
    prms = result.current.run(promise)
  })

  // 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)
  unmount()
  await act(async () => {
    resolve()
    await prms
  })
  expect(console.error).not.toHaveBeenCalled()
})

test('calling "run" without a promise results in an early error', () => {
  const {result} = renderHook(() => useAsync())
  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
