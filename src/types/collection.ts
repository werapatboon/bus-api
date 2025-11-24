export interface Collection {
  id: number;
  title: string;
  title_th: string;
  description: string;
  description_th: string;
  busIds: number[];
  image?: string; 
}

export interface CollectionsResponse {
  total: number;
  data: Collection[];
  offset?: number; 
  limit?: number; 
  lang?: string;  
}
