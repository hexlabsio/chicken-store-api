import {bind, HttpMethod, router} from "@hexlabs/http-api-ts";
import {Chicken, ChickenCreateRequest} from "./chicken";
import ChickenService from "./chicken-service";
import {Request, Response} from './index'

export default class ChickenApi {
  constructor(private readonly chickenService = new ChickenService()) {}
  
  handle = router<Request, Response>([
    bind('/chicken', router([
      bind(HttpMethod.GET, request => this.getChickens(request)),
      bind(HttpMethod.POST, request => this.createChicken(request)),
      bind('/{chickenId}', router( [
        bind(HttpMethod.GET, request => this.getChicken(request)),
        bind(HttpMethod.PUT, request => this.updateChicken(request)),
        bind(HttpMethod.DELETE, request => this.deleteChicken(request)),
      ]))
    ]))
  ]);
  
  async getChickens(request: Request): Promise<Response> {
    const chickens = await this.chickenService.getChickens();
    return { statusCode: 200, body: JSON.stringify(chickens), headers: {'Content-Type': 'application/json'} };
  }
  
  async getChicken(request: Request): Promise<Response> {
    const identifier = request.pathParameters['chickenId'];
    const chicken = await this.chickenService.getChicken(identifier);
    return chicken ? { statusCode: 200, body: JSON.stringify(chicken), headers: {'Content-Type': 'application/json'} } : { statusCode: 404, body: 'NOT FOUND' };
  }
  
  async createChicken(request: Request): Promise<Response> {
    const createRequest: ChickenCreateRequest = JSON.parse(request.body!);
    const chicken = await this.chickenService.createChicken(createRequest);
    return { statusCode: 201, body: JSON.stringify(chicken), headers: {'Content-Type': 'application/json', 'Location': `/chicken/${chicken.identifier}`} };
  }
  
  async updateChicken(request: Request): Promise<Response> {
    const identifier = request.pathParameters['chickenId'];
    const createRequest: ChickenCreateRequest = JSON.parse(request.body!);
    const chicken: Chicken = {...createRequest, identifier};
    await this.chickenService.putChicken(chicken);
    return { statusCode: 200, body: JSON.stringify(chicken), headers: {'Content-Type': 'application/json'} };
  }
  
  async deleteChicken(request: Request): Promise<Response> {
    const identifier = request.pathParameters['chickenId'];
    await this.chickenService.deleteChicken(identifier);
    return { statusCode: 200, body: 'Deleted' };
  }
}
