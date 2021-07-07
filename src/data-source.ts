import { v5 as uuid } from 'uuid';
import {Chicken, chickenTypes} from "./chicken";

// @ts-ignore
import * as dockerNames from 'docker-names';

function chickenHatcher(name: string, index: number): Chicken {
  return { identifier: uuid(name, '643dd3dc-204e-510e-991e-8868ae2a0c08'), name, type: chickenTypes[index % chickenTypes.length] };
}

const dataStore = dockerNames.surnames
.map(chickenHatcher)
.reduce((data: any, current: any) => ({...data, [current.identifier]: current}), {});

export default {
  getAll(): Promise<any[]> { return Promise.resolve(Object.values(dataStore)); },
  get(identifier: string): Promise<any> { return Promise.resolve(dataStore[identifier]); },
  put(item: any): Promise<void> {
    return new Promise(resolve => {
      dataStore[item.identifier] = item;
      resolve();
    });
  },
  delete(identifier: string): Promise<void> {
    return new Promise(resolve => {
      delete dataStore[identifier];
      resolve();
    });
  }
}
