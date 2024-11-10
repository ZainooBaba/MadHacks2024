// utils.ts
import { getDatabase, ref, get } from 'firebase/database';

export function decodeJWT(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Invalid token format', error);
      return null;
    }
  }
  
export function encodeEmail(email: string){
  return email.replaceAll('.', ',').replaceAll('#', ',').replaceAll('$', ',').replaceAll('[', ',').replaceAll(']', ',');
}

export function decodeEmail(email: string){
  return email.replaceAll(',', '.')
}

/**
 * Looks up and returns the name associated with a given email.
 * @param {string} email - The email of the user whose name is to be retrieved.
 * @returns {Promise<string|null>} - The name of the user, or null if not found.
 */
export const getNameByEmail = async (email) => {
  try {
    // Encode email to match Firebase structure
    const encodedEmail = encodeEmail(email);

    // Get a reference to the user in the database
    const db = getDatabase();
    const userRef = ref(db, `Users/${encodedEmail}`);

    // Fetch the user's data
    const snapshot = await get(userRef);

    // Return the user's name if found
    if (snapshot.exists()) {
      return snapshot.val().name || null;
    } else {
      console.warn(`User with email ${email} not found in database.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching name for email ${email}:`, error);
    return null;
  }
};
