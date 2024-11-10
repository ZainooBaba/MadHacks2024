// utils.ts
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