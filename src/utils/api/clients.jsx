const API_BASE_URL  = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchClients() {
  
    const response = await fetch(`${API_BASE_URL}/clients/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    const data = await response.json();
    return data;
  }
  