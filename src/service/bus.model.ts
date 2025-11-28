// src/app/service/bus.model.ts
export interface Bus {
  id: string;
  number: string;
  status: string;
  routeName?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  driverId?: string;
  routeId?: string;
}

export interface BusLocation {
  busId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed?: number;
  direction?: number;
}

export interface TripStatus {
  busId: string;
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
  currentRoute?: string;
}
