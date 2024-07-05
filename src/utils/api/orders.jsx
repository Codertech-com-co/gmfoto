const API_BASE_URL  = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchOrders() {
  
    const response = await fetch(`${API_BASE_URL}/orders/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    return data;
  }
  