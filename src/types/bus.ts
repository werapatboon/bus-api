export interface Bus {
  id: number;
  lineNumber: string;
  lineName: string;
  lineName_th: string;
  route: string[];
  startTime: string;
  endTime: string;
  frequency: string;
  image?: string;
  details?: string;
  details_th?: string;
  operator?: string;
  operator_th?: string;
  type?: string;
  type_th?: string;
}

export interface BusesResponse {
  total: number;
  offset: number;
  limit: number;
  lang: string;
  data: Bus[];
}

export interface BusImage {
  url: string;
  type: "Map" | "Vehicle" | "Stop";
  order: number;
}
