const API_BASE_URL  = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchEquipos() {
  
    const response = await fetch(`${API_BASE_URL}/equipos/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch equipos');
    }
    const data = await response.json();
    return data;
  }
  