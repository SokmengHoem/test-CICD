export interface ProductCreateRequest {
    name: string;
    category: string;
    price: number;
  }


export interface ProductUpdateRequest {
  name? : string,
  category? : string;
  price?: number;
}

export interface ProductGetAllRequest {
  page? : number;
  limit? : number;
  filter? : string;
  sort? : string;
}