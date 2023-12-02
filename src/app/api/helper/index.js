export async function useToken(request) {
  const headers = await request?.headers;
  const token = await headers?.get("authorization");
  return token;
}

export async function useSearchParams(request) {
  const queryParam = await request.nextUrl.searchParams;
  return queryParam;
}
export async function getUsernameFromEmail(email) {
  const parts = await email.split("@");
  const username = await parts[0];
  return username;
}

export const isAlreadyExistMessage = "This email already exists.";

export const isNotLoginMessage = "You need to login first";

export const isTokenNotValidMessage = "Provide a valid authorization token";
