import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addUser as addUserAction, deleteUser as deleteUserAction, fetchUsers, updateUser as updateUserAction } from '../store/usersSlice'

type User = {
  id: number
  name: string
  email: string
  company?: { name: string }
}

export default function UserList() {
  const dispatch = useAppDispatch()
  const users = useAppSelector((s) => s.users.items)
  const status = useAppSelector((s) => s.users.status)
  const error = useAppSelector((s) => s.users.error)
  const [searchQuery, setSearchQuery] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<'name' | 'email'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers())
    }
  }, [status, dispatch])

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return users
    return users.filter((user) => {
      const nameMatches = user.name.toLowerCase().includes(query)
      const emailMatches = user.email.toLowerCase().includes(query)
      return nameMatches || emailMatches
    })
  }, [users, searchQuery])

  const sortedUsers = useMemo(() => {
    const copy = [...filteredUsers]
    copy.sort((a, b) => {
      const aVal = (a[sortField] || '').toString().toLowerCase()
      const bVal = (b[sortField] || '').toString().toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return copy
  }, [filteredUsers, sortField, sortDir])

  if (status === 'loading') return <p>Loading users...</p>
  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <p style={{ margin: 0 }}>Error: {error}</p>
      <button onClick={() => dispatch(fetchUsers())}>Retry</button>
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', maxWidth: '420px', padding: '0.5rem' }}
          aria-label="Search users by name or email"
        />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const name = nameInput.trim()
          const email = emailInput.trim()
          if (!name || !email) {
            setFormError('Name and Email are required')
            return
          }
          const emailValid = /\S+@\S+\.\S+/.test(email)
          if (!emailValid) {
            setFormError('Please enter a valid email')
            return
          }
          const newUser: User = {
            id: Date.now(),
            name,
            email,
            company: { name: '' },
          }
          dispatch(addUserAction(newUser))
          setNameInput('')
          setEmailInput('')
          setFormError(null)
        }}
        style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap' }}
        aria-labelledby="add-user-heading"
      >
        <h2 id="add-user-heading" style={{ margin: 0, fontSize: '1.1rem', width: '100%' }}>Add User</h2>
        <input
          type="text"
          placeholder="Name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{ padding: '0.5rem', minWidth: '200px' }}
          aria-label="Name"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          style={{ padding: '0.5rem', minWidth: '240px' }}
          aria-label="Email"
          required
        />
        <button type="submit" style={{ padding: '0.6rem 1rem' }}>Add</button>
        {formError && (
          <span role="alert" style={{ color: '#ff6b6b', alignSelf: 'center' }}>{formError}</span>
        )}
      </form>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <label>
          Sort by:{' '}
          <select value={sortField} onChange={(e) => setSortField(e.target.value as 'name' | 'email')}>
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
        </label>
        <label>
          Direction:{' '}
          <select value={sortDir} onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            <th style={{ padding: '0.5rem' }}>Name</th>
            <th style={{ padding: '0.5rem' }}>Email</th>
            <th style={{ padding: '0.5rem' }}>Company</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((u) => (
            <tr key={u.id}>
              <td style={{ padding: '0.5rem' }}>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td style={{ padding: '0.5rem' }}>{u.email}</td>
              <td style={{ padding: '0.5rem' }}>{u.company?.name}</td>
              <td style={{ padding: '0.5rem' }}>
                <button
                  onClick={() => {
                    const newName = window.prompt('New name', u.name)?.trim()
                    const newEmail = window.prompt('New email', u.email)?.trim()
                    if (!newName || !newEmail) return
                    const emailValid = /\S+@\S+\.\S+/.test(newEmail)
                    if (!emailValid) return
                    dispatch(updateUserAction({ ...u, name: newName, email: newEmail }))
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteUserAction(u.id))}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


