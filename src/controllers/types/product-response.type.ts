import { IItem } from "@/src/database/models/product.model";

export interface ProductResponse {
  message: string;
  data: IItem
}

export interface ProductPaginatedResponse {
  message: string,
  data: {
    [key: string]: IItem[] | number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }
}