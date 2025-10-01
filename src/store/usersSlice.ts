import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type User = {
  id: number
  name: string
  email: string
  company?: { name: string }
}

type UsersState = {
  items: User[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchUsers = createAsyncThunk<User[]>('users/fetch', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users')
  if (!res.ok) throw new Error('Failed to fetch users')
  const data = await res.json()
  return data.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    company: { name: u?.company?.name || '' },
  })) as User[]
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<User>) {
      state.items.unshift(action.payload)
    },
    updateUser(state, action: PayloadAction<User>) {
      const idx = state.items.findIndex((u) => u.id === action.payload.id)
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload }
      }
    },
    deleteUser(state, action: PayloadAction<number>) {
      state.items = state.items.filter((u) => u.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Failed to load users'
      })
  },
})

export const { addUser, updateUser, deleteUser } = usersSlice.actions
export default usersSlice.reducer


