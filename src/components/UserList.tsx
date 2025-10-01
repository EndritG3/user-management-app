import { useEffect, useState } from 'react'

type User = {
  id: number
  name: string
  email: string
  company: { name: string }
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) return <p>Loading users...</p>
  if (error) return <p>{error}</p>

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead>
        <tr>
          <th style={{ padding: '0.5rem' }}>Name</th>
          <th style={{ padding: '0.5rem' }}>Email</th>
          <th style={{ padding: '0.5rem' }}>Company</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td style={{ padding: '0.5rem' }}>{u.name}</td>
            <td style={{ padding: '0.5rem' }}>{u.email}</td>
            <td style={{ padding: '0.5rem' }}>{u.company?.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


