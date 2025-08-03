// Shared API client functions

export async function fetchUser(userId: string) {
  // Example fetch call
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
} 