export interface SearchLocation {
  city: string;
  latitude: number;
  county: string;
  state: string;
  zip_code: string;
  longitude: number;
}
export interface SearchResponse {
  results: SearchLocation[];
  total: number;
}
