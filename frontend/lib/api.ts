import Cookies from 'js-cookie';
type HeadersInit = Record<string, string>;

const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1';

// Helper function to get auth headers from Cookies (set by login) or Storage
export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') {
    return {
      'x-user-id': '',
      'x-user-role': 'student'
    };
  }

  // 1. Try to get user data from cookies (set by login server action)
  const userDataCookie = Cookies.get('user-data');
  if (userDataCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userDataCookie));
      if (user && user.id) {
        return {
          'x-user-id': user.id,
          'x-user-role': user.role || 'student'
        };
      }
    } catch (e) {
      console.error('[API] Error parsing user-data cookie:', e);
    }
  }

  // 2. Fallback to localStorage or defaults for development
  const userId = 
    localStorage.getItem('userId') || 
    sessionStorage.getItem('userId') || 
    'student_01'; 

  const userRole = 
    localStorage.getItem('userRole') || 
    sessionStorage.getItem('userRole') || 
    'student';

  return {
    'x-user-id': userId,
    'x-user-role': userRole
  };
};

// Doubts API
export async function getDoubts() {
  try {
    const headers = getAuthHeaders();
    console.log('[API] Fetching doubts from:', `${BASE_URL}/doubts`);
    console.log('[API] Headers:', headers);
    
    const response = await fetch(`${BASE_URL}/doubts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      } as HeadersInit
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error response (${response.status}):`, errorText);
      throw new Error(`Failed to fetch doubts: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('[API] Doubts data:', data);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching doubts:', error);
    return [];
  }
}

export async function getDoubtDetails(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/doubts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      } as HeadersInit
    });
    if (!response.ok) throw new Error('Failed to fetch doubt details');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching doubt details:', error);
    throw error;
  }
}

export async function createDoubt(payload: {
  title: string;
  subject_id: string;
  initial_message: { text: string; image_url?: string };
  teacher_id?: string;
}) {
  try {
    const response = await fetch(`${BASE_URL}/doubts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      } as HeadersInit,
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to create doubt');
    const data = await response.json();
    return data.doubt;
  } catch (error) {
    console.error('Error creating doubt:', error);
    throw error;
  }
}

export async function updateDoubtStatus(id: string, status: string) {
  try {
    const response = await fetch(`${BASE_URL}/doubts/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      } as HeadersInit,
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update doubt status');
    const data = await response.json();
    return data.doubt;
  } catch (error) {
    console.error('Error updating doubt status:', error);
    throw error;
  }
}

// Messages API
export async function addMessage(doubtId: string, message: {
  text?: string;
  image_url?: string;
}) {
  try {
    const response = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      } as HeadersInit,
      body: JSON.stringify({
        doubt_id: doubtId,
        ...message
      })
    });
    if (!response.ok) throw new Error('Failed to add message');
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
}

// Upload API
export async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders()
      } as HeadersInit,
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload image');
    const data = await response.json();
    return data.image_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Subjects API (if available)
export async function getSubjects() {
  try {
    const response = await fetch(`${BASE_URL}/subjects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      } as HeadersInit
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
}

// Teachers API (if available)
export async function getTeachers() {
  try {
    const response = await fetch(`${BASE_URL}/teachers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      } as HeadersInit
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
}
