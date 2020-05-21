export interface GeocodingResult {
    status: string;
    results: GeocodingItem[];
}

interface GeocodingItem {
    formatted_address: string;
}