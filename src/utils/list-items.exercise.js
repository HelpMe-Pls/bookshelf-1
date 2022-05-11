import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'

export const useListItem = (user, bookId) =>
  useListItems(user)?.find(li => li.bookId === bookId) ?? null

export const useListItems = user => {
  const {data} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {token: user.token}).then(res => res.listItems),
  })
  return data
}

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

export const useCreateListItem = user =>
  useMutation(
    ({bookId}) => client(`list-items`, {data: {bookId}, token: user.token}),
    defaultMutationOptions,
  )

export const useRemoveListItem = user =>
  useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    defaultMutationOptions,
  )

export const useUpdateListItem = user =>
  useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    defaultMutationOptions,
  )
