export interface SearchQueryParams {
  q: string;
}

export interface SearchServiceParams extends SearchQueryParams {
  userId: string;
}
