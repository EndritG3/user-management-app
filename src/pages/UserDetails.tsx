import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type User = {
  id: number
  name: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
}

export default function UserDetails() {
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function loadUser() {
      try {
        if (!id) throw new Error('Missing user id')
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        if (!res.ok) throw new Error('Failed to fetch user')
        const data: User = await res.json()
        if (isMounted) setUser(data)
      } catch (e) {
        if (isMounted) setError('Failed to load user')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadUser()
    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) return <p>Loading user...</p>
  if (error) return <p>{error}</p>
  if (!user) return <p>User not found.</p>

  return (
    <div>
      <h1>{user.name}</h1>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Phone:</strong> {user.phone}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Website:</strong> <a href={`https://${user.website}`} target="_blank" rel="noreferrer">{user.website}</a>
      </div>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Address</h2>
        <p style={{ margin: '0.25rem 0' }}>{user.address.street}</p>
        <p style={{ margin: '0.25rem 0' }}>{user.address.suite}</p>
        <p style={{ margin: '0.25rem 0' }}>{user.address.city}, {user.address.zipcode}</p>
      </div>
    </div>
  )
}


