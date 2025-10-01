import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type User = {
  id: number | string
  name: string
  email: string
  company: { name: string }
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!res.ok) throw new Error('Failed to fetch users')
        const data: User[] = await res.json()
        if (isMounted) setUsers(data)
      } catch (e) {
        if (isMounted) setError('Failed to load users')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadUsers()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return users
    return users.filter((user) => {
      const nameMatches = user.name.toLowerCase().includes(query)
      const emailMatches = user.email.toLowerCase().includes(query)
      return nameMatches || emailMatches
    })
  }, [users, searchQuery])

  if (loading) return <p>Loading users...</p>
  if (error) return <p>{error}</p>

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
          setUsers((prev) => [newUser, ...prev])
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
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            <th style={{ padding: '0.5rem' }}>Name</th>
            <th style={{ padding: '0.5rem' }}>Email</th>
            <th style={{ padding: '0.5rem' }}>Company</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td style={{ padding: '0.5rem' }}>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td style={{ padding: '0.5rem' }}>{u.email}</td>
              <td style={{ padding: '0.5rem' }}>{u.company?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


