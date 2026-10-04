import type { HttpMethod } from './HttpResponse'

/** A ready-made request: choosing it fills in the method, URL, and (for POST and PUT) the payload. */
export interface RequestPreset {
  label: string
  method: HttpMethod
  url: string
  payload: string
}

/** A free public API that needs no key and allows requests from any web page (CORS). */
export interface ExampleApi {
  id: string
  name: string
  docsUrl: string
  /** What the API is good for and anything to know before sending, in one or two sentences. */
  description: string
  presets: RequestPreset[]
}

const json = (value: unknown) => JSON.stringify(value, null, 2)
const get = (label: string, url: string): RequestPreset => ({ label, method: 'GET', url, payload: '' })
const remove = (label: string, url: string): RequestPreset => ({ label, method: 'DELETE', url, payload: '' })
const send = (label: string, method: 'POST' | 'PUT', url: string, body: unknown): RequestPreset => ({ label, method, url, payload: json(body) })

/** restful-api.dev only lets you change objects you created; this stands in for the id its POST returns. */
export const restfulApiIdPlaceholder = 'ID_FROM_CREATE'

/** A distinctive id for the shared Swagger Petstore, so the examples work on one pet from create to delete. */
const petId = 20261004

/**
 * The example APIs, in the order the menu shows them. Every request here was sent from a browser page
 * on another origin while writing this file, to check CORS and the response; tests never call them.
 */
export const exampleApis: readonly ExampleApi[] = [
  {
    id: 'jsonplaceholder',
    name: 'JSONPlaceholder',
    docsUrl: 'https://jsonplaceholder.typicode.com/guide/',
    description: 'Posts, comments, and users for learning CRUD. It answers every method but does not save changes, so examples can be sent any number of times.',
    presets: [
      get('Get a post', 'https://jsonplaceholder.typicode.com/posts/1'),
      get('List a user’s posts', 'https://jsonplaceholder.typicode.com/posts?userId=1'),
      send('Create a post', 'POST', 'https://jsonplaceholder.typicode.com/posts', { title: 'Hello from GJP Lab', body: 'Sent with the fetch API.', userId: 1 }),
      send('Replace a post', 'PUT', 'https://jsonplaceholder.typicode.com/posts/1', { id: 1, title: 'Updated title', body: 'Replaced with PUT.', userId: 1 }),
      remove('Delete a post', 'https://jsonplaceholder.typicode.com/posts/1'),
    ],
  },
  {
    id: 'dummyjson',
    name: 'DummyJSON',
    docsUrl: 'https://dummyjson.com/docs',
    description: 'Realistic products, carts, users, and recipes, with search and paging. Writes return the expected result but are not saved.',
    presets: [
      get('Get a product', 'https://dummyjson.com/products/1'),
      get('Search products', 'https://dummyjson.com/products/search?q=phone&limit=3'),
      send('Add a product', 'POST', 'https://dummyjson.com/products/add', { title: 'GJP Lab mug', price: 12.5 }),
      send('Update a product', 'PUT', 'https://dummyjson.com/products/1', { title: 'Renamed product' }),
      remove('Delete a product', 'https://dummyjson.com/products/1'),
    ],
  },
  {
    id: 'reqres',
    name: 'ReqRes',
    docsUrl: 'https://reqres.in/',
    description: 'Users with realistic status codes: 201 on create, 204 with an empty body on delete, and 404 for a missing user. Anonymous use is rate-limited per IP; writes are not saved.',
    presets: [
      get('Get a user', 'https://reqres.in/api/users/2'),
      get('List users', 'https://reqres.in/api/users?page=2'),
      get('Missing user (404)', 'https://reqres.in/api/users/23'),
      send('Create a user', 'POST', 'https://reqres.in/api/users', { name: 'Ada', job: 'Engineer' }),
      send('Update a user', 'PUT', 'https://reqres.in/api/users/2', { name: 'Ada', job: 'Lead engineer' }),
      remove('Delete a user (204)', 'https://reqres.in/api/users/2'),
    ],
  },
  {
    id: 'restful-api',
    name: 'restful-api.dev',
    docsUrl: 'https://restful-api.dev/',
    description: `Objects that are really saved in a database. The built-in objects cannot be changed, so send Create first and put the id it returns in place of ${restfulApiIdPlaceholder}. Limited to 50 requests a day without a key.`,
    presets: [
      get('List objects', 'https://api.restful-api.dev/objects'),
      get('Get an object', 'https://api.restful-api.dev/objects/7'),
      send('Create an object', 'POST', 'https://api.restful-api.dev/objects', { name: 'GJP Lab laptop', data: { year: 2026, price: 999 } }),
      send('Replace your object', 'PUT', `https://api.restful-api.dev/objects/${restfulApiIdPlaceholder}`, { name: 'GJP Lab laptop', data: { year: 2026, price: 899 } }),
      remove('Delete your object', `https://api.restful-api.dev/objects/${restfulApiIdPlaceholder}`),
    ],
  },
  {
    id: 'httpbin',
    name: 'httpbin',
    docsUrl: 'https://httpbin.org/',
    description: 'Echoes your request back: the query, headers, and body it received. Useful to see exactly what fetch sent, and to get any status code on purpose.',
    presets: [
      get('Echo a GET', 'https://httpbin.org/get?lab=gjp'),
      send('Echo a POST', 'POST', 'https://httpbin.org/post', { message: 'Hello from GJP Lab' }),
      send('Echo a PUT', 'PUT', 'https://httpbin.org/put', { message: 'Replaced' }),
      remove('Echo a DELETE', 'https://httpbin.org/delete'),
      get('Status 418', 'https://httpbin.org/status/418'),
    ],
  },
  {
    id: 'petstore',
    name: 'Swagger Petstore',
    docsUrl: 'https://petstore.swagger.io/',
    description: `The OpenAPI sample server. It is shared by everyone, so changes are visible to others and may be reset; never send personal data. The examples use pet ${petId}: add it before getting, updating, or deleting it.`,
    presets: [
      get('Find available pets', 'https://petstore.swagger.io/v2/pet/findByStatus?status=available'),
      send('Add a pet', 'POST', 'https://petstore.swagger.io/v2/pet', { id: petId, name: 'Lab cat', status: 'available', photoUrls: [] }),
      get('Get the pet', `https://petstore.swagger.io/v2/pet/${petId}`),
      send('Update the pet', 'PUT', 'https://petstore.swagger.io/v2/pet', { id: petId, name: 'Lab cat', status: 'sold', photoUrls: [] }),
      remove('Delete the pet', `https://petstore.swagger.io/v2/pet/${petId}`),
    ],
  },
  {
    id: 'pokeapi',
    name: 'PokeAPI',
    docsUrl: 'https://pokeapi.co/docs/v2',
    description: 'Pokémon data with large, nested responses. It is read-only, so it answers GET only.',
    presets: [
      get('Get Pikachu', 'https://pokeapi.co/api/v2/pokemon/pikachu'),
      get('First five Pokémon', 'https://pokeapi.co/api/v2/pokemon?limit=5'),
      get('Electric type', 'https://pokeapi.co/api/v2/type/electric'),
      get('A berry', 'https://pokeapi.co/api/v2/berry/1'),
    ],
  },
]
