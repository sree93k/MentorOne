export const checkAuthStatus = (): boolean => {
  console.log("🔍 checkAuthStatus: Checking authentication");
  console.log("🔍 All cookies:", document.cookie);

  // Check the readable cookie
  const isAuthenticated = getCookie("isAuthenticated");
  console.log("🔍 isAuthenticated cookie value:", isAuthenticated);

  const result = isAuthenticated === "true";
  console.log("🔍 checkAuthStatus result:", result);

  return result;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    console.log("🔍 getCookie: Running in server environment");
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    console.log(`🔍 getCookie: Found ${name} =`, cookieValue);
    return cookieValue || null;
  }

  console.log(`🔍 getCookie: ${name} not found`);
  return null;
};
