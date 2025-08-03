// Utilitaire pour parser les erreurs backend FastAPI et retourner un message lisible
export function parseApiError(error: any): string {
  if (!error) return "Erreur inconnue";
  // Axios: error.response?.data?.detail
  // Fetch: error.detail
  const detail = error?.response?.data?.detail || error?.detail || error?.message;
  if (Array.isArray(detail)) {
    // Erreurs de validation Pydantic (FastAPI)
    return detail.map((e: any) => e.msg || JSON.stringify(e)).join(' | ');
  }
  return typeof detail === 'string' ? detail : JSON.stringify(detail);
}
