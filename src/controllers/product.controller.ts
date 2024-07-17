import { Body, Controller, Delete, Get, Middlewares, Path, Post, Put, Queries, Response, Route } from 'tsoa';
import ProductServices  from '@/src/services/product.service';
import { ProductCreateRequest, ProductGetAllRequest, ProductUpdateRequest } from '@/src/controllers/types/product-request.type';
import { ProductPaginatedResponse, ProductResponse } from '@/src/controllers/types/product-response.type';
import validateRequest from '@/src/middlewares/validate-input';
import productJoiSchema from '@/src/schemas/product-schema';


@Route("/v1/products")
export class ProductController extends Controller {
  @Get()
  public async getAllProducts(@Queries() queries: ProductGetAllRequest): Promise<ProductPaginatedResponse> {
    try{
      const response = await ProductServices.getAllProducts(queries);

      return {
        message: "success",
        data: response
      }
    } catch(error) {
      console.error(`ProductsController - getAllProducts() method error: ${error}`)
      throw error;
    }
  }

  @Post()
  @Response(201, 'Create Success')
  @Middlewares(validateRequest(productJoiSchema)) // Add this local middleware to check the valid input
  public async createItem(@Body() requestBody: ProductCreateRequest) : Promise<ProductResponse> {
    try{
      const newProduct = await ProductServices.createProduct(requestBody);

      return {
        message: "success",
        data: {
          name: newProduct.name,
          category: newProduct.category,
          price: newProduct.price
        }
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('{id}')
  public async getItemById (@Path() id: string) : Promise<ProductResponse> {
    try{
      const product = await ProductServices.getProductById(id);

      return {
        message: "success",
        data: product
      };
    }catch (error){
      throw error;
    }
  }

  @Put('{id}')
  public async updateItem (@Path() id: string, @Body() requestBody: ProductUpdateRequest): Promise<ProductResponse> {
    try{
      const updatedProduct = await ProductServices.updateProduct(id, requestBody);
      
      return {message: 'success', data: updatedProduct}
    }catch (error) {
      throw error;
    }
  }

  @Delete('{id}') 
  @Response(204, 'Delete Success')
  public async deleteItemById(@Path() id: string): Promise<void> {
    try{
       await ProductServices.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }
}
