# Product Catalog Service

A small RESTful Node.js service backed by SQLite. Product prices are represented
as integer cents throughout the API and database. For example, `$5.99` is
submitted as `priceCents: 599` and stored in the SQLite `price_cents` INTEGER
column as `599`.

## Requirements

- Node.js 20 or newer

## Run

```sh
npm install
npm start
```

The service listens on port `3000` by default. Set `PORT` to use a different
port. The database is created at `data/catalog.sqlite`.

## API

### `GET /api/catalog`

Returns all products:

```json
{
  "products": [
    {
      "id": 1,
      "name": "Example product",
      "priceCents": 599,
      "createdAt": "2026-10-20T00:00:00.000Z"
    }
  ]
}
```

### `POST /api/catalog`

Create a product by supplying a non-empty `name` and a non-negative integer
`priceCents`:

```sh
curl -X POST http://localhost:3000/api/catalog \
  -H 'Content-Type: application/json' \
  -d '{"name":"Example product","priceCents":599}'
```

Successful requests return `201 Created` with the created product. Invalid
names or non-integer/negative prices return `400 Bad Request`.

## Test

```sh
npm test
```
