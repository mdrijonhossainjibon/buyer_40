// Client-side signature generation using Web Crypto API
export async function generateClientSignature(data: string, secret: string) {
  const timestamp = Date.now().toString();
  
  // Step 1: Create hash using Web Crypto API
  const encoder = new TextEncoder();
  const dataToHash = encoder.encode(data + timestamp);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataToHash);
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Step 2: Create signature using Web Crypto API
  const secretKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    secretKey,
    encoder.encode(hash)
  );
  
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return { timestamp, hash, signature };
}

// Fetch user data from API
export async function fetchUserData(userId: number) {
  try {
    const secret = process.env.NEXT_PUBLIC_SECRET_KEY || '';
    const data = userId.toString();
    const { timestamp, hash, signature } = await generateClientSignature(data, secret);
    
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        timestamp,
        signature,
        hash
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch user data:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Update user data via API
export async function updateUserData(userId: number, updateData: any) {
  try {
    const secret = process.env.NEXT_PUBLIC_SECRET_KEY || '';
    const data = userId.toString() + JSON.stringify(updateData);
    const { timestamp, hash, signature } = await generateClientSignature(data, secret);
    
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        timestamp,
        signature,
        hash,
        updateData
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to update user data:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    return null;
  }
}
