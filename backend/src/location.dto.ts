export class LocationDto {
  lat: number;
  lng: number;
}

export class CountDto{
  cnt: number
}

export class SingleLocationDto {
  emp_id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  recorded_at: string;
  address: string;
  device_type: string;
}

export class LocationsBatchDto {
  locations: SingleLocationDto[];
}
