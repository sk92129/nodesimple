const express = require("express");

function createApp(db) {
  const app = express();
  app.use(express.json());

  app.get("/api/catalog", (req, res) => {
    const products = db
      .prepare(
        `SELECT id, name, price_cents AS priceCents, created_at AS createdAt
         FROM products
         ORDER BY id`
      )
      .all();

    res.json({ products });
  });

  app.post("/api/catalog", (req, res) => {
    const { name, priceCents } = req.body ?? {};

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "name must be a non-empty string" });
    }

    if (!Number.isSafeInteger(priceCents) || priceCents < 0) {
      return res
        .status(400)
        .json({ error: "priceCents must be a non-negative safe integer" });
    }

    const result = db
      .prepare("INSERT INTO products (name, price_cents) VALUES (?, ?)")
      .run(name.trim(), priceCents);

    const product = db
      .prepare(
        `SELECT id, name, price_cents AS priceCents, created_at AS createdAt
         FROM products
         WHERE id = ?`
      )
      .get(result.lastInsertRowid);

    return res.status(201).json({ product });
  });

  return app;
}

module.exports = { createApp };
