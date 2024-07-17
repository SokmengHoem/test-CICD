
import { ProductCreateRequest, ProductGetAllRequest, ProductUpdateRequest } from '@/src/controllers/types/product-request.type';
import { IItem } from '@/src/database/models/product.model';
import ProductRepository from '@/src/database/repositories/product.repository';


export class ProductServices {
    public async getAllProducts(queries: ProductGetAllRequest) {
        try{
            const {page, limit, filter, sort} = queries;

            const newQueries = {
                page, 
                limit,
                filter: filter && JSON.parse(filter),
                sort: sort && JSON.parse(sort)
            }

            const result = await ProductRepository.getAll(newQueries);

            return result;
        }catch (error) {
            console.error(`ProductService - getAllProducts() method error: ${error}`)
            throw error;
        }
    }

    public async createProduct(productRequest: ProductCreateRequest): Promise<IItem> {
        try{
            const newProduct = await ProductRepository.createProduct(productRequest);
            return newProduct;
        } catch (error){
            console.log(`ProductService - createProduct() method error: ${error}`)
            throw error;
        }
    }

    public async getProductById (id: string) : Promise<IItem> {
       try {
        const product = await ProductRepository.getProductById(id);

        return product;
       }catch (error) {
        throw error;
       }
    }

    public async updateProduct(id: string , productRequest: ProductUpdateRequest) : Promise<IItem> {
        try{
            const updatedProduct = await ProductRepository.updateProduct(id, productRequest);

            return updatedProduct;
        }catch (error) {
            throw error;
        }
    }

    public async deleteProduct (id: string): Promise<void> {
        try{
            await ProductRepository.deleteProduct(id);
        } catch (error) {
            throw error;
        }
    }
}

export default new ProductServices();