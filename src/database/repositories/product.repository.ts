import { ProductCreateRequest, ProductUpdateRequest } from "@/src/controllers/types/product-request.type";
import ItemModel, { IItem } from "@/src/database/models/product.model";
import { SortOrder } from "mongoose";
import { ProductGetAllRepoParams, ProductSortParams } from "@/src/database/repositories/types/product-repository.type";

class ProductRepository {
    public async getAll(queries: ProductGetAllRepoParams) {
        const { page = 1, limit = 10, filter = {}, sort = { name: 'desc' } } = queries;
    
        // Convert sort from {'field': 'desc'} to {'field': '-1'}
        const sortFields = Object.keys(sort).reduce((acc, key) => {
            const direction = sort[key as keyof ProductSortParams];
            if (direction === 'asc' || direction === 'desc') {
                acc[key as keyof ProductSortParams] = direction === 'asc' ? 1 : -1;
            }
            return acc;
        }, {} as Record<keyof ProductSortParams, SortOrder>);
    
        // Build MongoDB filter object
        const buildFilter = (filter: Record<string, any>) => {
            const mongoFilter: Record<string, any> = {};
            for (const key in filter) {
                if (typeof filter[key] === 'object' && filter[key] !== null) {
                    if (filter[key].hasOwnProperty('min') || filter[key].hasOwnProperty('max')) {
                        mongoFilter[key] = {};
                        if (filter[key].min !== undefined) {
                            mongoFilter[key].$gte = filter[key].min;
                        }
                        if (filter[key].max !== undefined) {
                            mongoFilter[key].$lte = filter[key].max;
                        }
                    } else {
                        mongoFilter[key] = filter[key];
                    }
                } else {
                    mongoFilter[key] = filter[key];
                }
            }
            return mongoFilter;
        };
    
        try {
            const mongoFilter = buildFilter(filter);
            console.log("Filter:", JSON.stringify(filter, null, 2));
            console.log("Mongo Filter:", JSON.stringify(mongoFilter, null, 2));
    
            const operation = ItemModel.find(mongoFilter)
                .sort(sortFields)
                .skip((page - 1) * limit)
                .limit(limit);
    
            const result = await operation;
            const totalItems = await ItemModel.countDocuments(mongoFilter);
    
            return {
                [ItemModel.collection.collectionName]: result,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page
            };
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
    

    public async createProduct(productRequest: ProductCreateRequest): Promise<IItem>{
        try{
            const newProduct = await ItemModel.create(productRequest);
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    public async getProductById (id: string): Promise<IItem> {
        try{
            const product = await ItemModel.findById(id);

            if(!product){
                throw new Error('Product not found');
            }

            return product;
        }catch (error) {
            throw error;
        }
    }

    public async updateProduct (id: string, productRequest: ProductUpdateRequest) : Promise<IItem> {
       try{
        const updatedProduct = await ItemModel.findByIdAndUpdate(id, productRequest, {new: true});

        if(!updatedProduct){
            throw new Error('Product not found!');
        }

        return updatedProduct;
       }catch (error) {
        throw error;
       }
    }

    public async deleteProduct(id: string): Promise<void> {
        try {
            const deletedProduct = await ItemModel.findByIdAndDelete(id);

            if(!deletedProduct){
                throw new Error('Product not found!');
            }
        }catch (error) {
            throw error
        }
    }

}

export default new ProductRepository();