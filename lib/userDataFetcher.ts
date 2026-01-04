/**
 * User data fetching utilities
 * Ensures all data is filtered by current user's Clerk ID
 */

export async function getUserUploads() {
  const response = await fetch('/api/uploads')
  
  if (!response.ok) {
    throw new Error('Failed to fetch uploads')
  }
  
  return response.json()
}

export async function getUploadTrades(uploadId: string) {
  const response = await fetch(`/api/uploads/${uploadId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch trades')
  }
  
  return response.json()
}
