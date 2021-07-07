import {Chicken, ChickenCreateRequest} from "./chicken";
import dataStore from './data-source';
import {v4 as uuid} from 'uuid';

export default class ChickenService {
  
  constructor(private readonly client = dataStore) {}
  
  async createChicken(chicken: ChickenCreateRequest): Promise<Chicken> {
    const newChicken: Chicken = {identifier: uuid(), ...chicken};
    await this.putChicken(newChicken);
    return newChicken;
  }
  
  async getChickens(): Promise<Chicken[]> {
    return await this.client.getAll();
  }
  
  async getChicken(identifier: string): Promise<Chicken | undefined> {
    return await this.client.get(identifier);
  }
  
  async putChicken(chicken: Chicken): Promise<void> {
    await this.client.put(chicken);
  }
  
  async deleteChicken(identifier: string): Promise<void> {
    await this.client.delete(identifier);
  }
}
