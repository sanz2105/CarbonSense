import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found — CarbonSense'
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      gap: '16px',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ fontSize: '56px' }}>🌿</div>
      <h1 style={{ 
        fontSize: '22px', 
        fontWeight: 600,
        color: '#111827',
        margin: 0 
      }}>
        Page Not Found
      </h1>
      <p style={{ 
        color: '#6B7280', 
        margin: 0,
        fontSize: '14px'
      }}>
        This page doesn't exist or was moved.
      </p>
      <Link
        to="/"
        style={{
          marginTop: '8px',
          padding: '8px 20px',
          background: '#1D9E75',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 500
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
