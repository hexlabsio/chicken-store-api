// @ts-ignore
import express = require('express');
import {Filter} from "@hexlabs/http-api-ts";
import ChickenApi from "./chicken-api";

export interface Request {resource: string, httpMethod: string, path: string, body?: string, pathParameters?: any}
export interface Response {statusCode: number, body: string, headers?: any}

const loggerFilter: Filter<Request, Response> = next => async event => {
  console.log(`Entered ${event.httpMethod} ${event.resource}`);
  const result = await next(event);
  console.log(`Exited ${event.httpMethod} ${event.resource} with status ${result.statusCode}`);
  return result;
}

const chickenApi = new ChickenApi();
async function handle(request: Request): Promise<Response> {
  return loggerFilter(chickenApi.handle)(request);
}


// Server to mimic events coming from an external source like AWS API Gateway
const singularEndpointHandler = handlers('/chicken/{chickenId}');
const allEndpointHandler = handlers('/chicken');
express().use(rawBody)
.get('/chicken', allEndpointHandler)
.post('/chicken', allEndpointHandler)
.get('/chicken/:chickenId', singularEndpointHandler)
.put('/chicken/:chickenId', singularEndpointHandler)
.delete('/chicken/:chickenId', singularEndpointHandler)
.listen(3000, () => console.log('Get Chickens at http://localhost:3000/chicken'))

function rawBody(req: any, res: any, next: any) {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.on('data', (chunk: any) => { req.rawBody += chunk; });
  req.on('end', function () { next(); });
}

function handlers(resource: string) {
  return async (request: express.Request, response: express.Response) => {
    const result = await handle({
      resource,
      httpMethod: request.method,
      path: request.path,
      body: (request as any).rawBody,
      pathParameters: request.params
    });
    response.status(result.statusCode).set(result.headers).send(result.body);
  }
}
