export async function useToken(request) {
  const headers = await request?.headers;
  const token = await headers?.get("authorization");
  return token;
}

export async function useSearchParams(request) {
  const queryParam = request.nextUrl.searchParams;
  return queryParam;
}

export const isAlreadyExistMessage = "This email already exists.";

export const isNotLoginMessage = "You need to login first";

export const isTokenNotValidMessage = "Provide a valid authorization token";
