const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const request = require("supertest");
const { createApp } = require("../src/app");
const { createDatabase } = require("../src/database");

let db;
let app;

before(() => {
  db = createDatabase(":memory:");
  app = createApp(db);
});

after(() => {
  db.close();
});

test("POST stores and returns a product price as integer cents", async () => {
  const response = await request(app)
    .post("/api/catalog")
    .send({ name: "Example product", priceCents: 599 })
    .expect(201);

  assert.equal(response.body.product.name, "Example product");
  assert.equal(response.body.product.priceCents, 599);
  assert.equal(
    typeof db.prepare("SELECT price_cents FROM products WHERE id = ?").get(response.body.product.id)
      .price_cents,
    "number"
  );
  assert.equal(
    db.prepare("SELECT price_cents FROM products WHERE id = ?").get(response.body.product.id)
      .price_cents,
    599
  );
});

test("GET returns the products in the catalog", async () => {
  const response = await request(app).get("/api/catalog").expect(200);

  assert.equal(response.body.products.length, 1);
  assert.equal(response.body.products[0].priceCents, 599);
});

test("POST rejects invalid product names and prices", async () => {
  await request(app)
    .post("/api/catalog")
    .send({ name: " ", priceCents: 599 })
    .expect(400);
  await request(app)
    .post("/api/catalog")
    .send({ name: "Invalid price", priceCents: 5.99 })
    .expect(400);
});
