// utils/cookieUtils.ts
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

export const getAccessToken = (): string | null => {
  const token = getCookie("accessToken");
  console.log("getAccessToken called:", {
    found: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : null,
  });
  return token;
};

export const getRefreshToken = (): string | null => {
  const token = getCookie("refreshToken");
  console.log("getRefreshToken called:", {
    found: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : null,
  });
  return token;
};

export const debugCookies = () => {
  console.log("=== FRONTEND COOKIE DEBUG ===");
  console.log("Document.cookie:", document.cookie);
  console.log("Access token:", getAccessToken());
  console.log("Refresh token:", getRefreshToken());

  // Parse all cookies for better visibility
  const cookies = document.cookie.split(";").reduce((acc: any, cookie) => {
    const [name, value] = cookie.trim().split("=");
    acc[name] = value;
    return acc;
  }, {});
  console.log("Parsed cookies:", cookies);
  console.log("===============================");
};

export const setCookie = (name: string, value: string, days?: number): void => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

export const deleteCookie = (name: string): void => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};
