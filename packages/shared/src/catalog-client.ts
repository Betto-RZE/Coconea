export class CatalogApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
  }
}

export async function catalogRequest<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      credentials: "include",
      cache: "no-store",
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new CatalogApiError(
      0,
      "No se pudo conectar con la API local. Comprueba que esté iniciada.",
    );
  }
  const payload = await response.json();
  if (!response.ok)
    throw new CatalogApiError(
      response.status,
      payload.error?.message ||
        payload.message ||
        "No se pudo completar la operación.",
      payload.error?.code || payload.code,
    );
  return payload.data as T;
}
