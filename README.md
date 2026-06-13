<p align="center">
  <img src=".github/banner.svg" alt="stripe-plans-importer" width="100%">
</p>

# stripe-plans-importer-nodejs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat&logo=stripe&logoColor=white)

Importá precios de **Stripe en masa desde un CSV** con Node.js + TypeScript. Apuntalo a un `plans.csv`, corré un comando y listo — sin crear cada precio a mano en el dashboard.

> **v2 — migrado a la API de Prices.** La API de Plans de Stripe quedó deprecada (`stripe.plans.create` ya no acepta `name` y exige un `product`). Esta versión crea un **Price** recurrente con su **Product** inline por cada fila. El `id` viejo del plan se conserva como **`lookup_key`** (los `price_…` ids los genera Stripe y no se pueden fijar).

## 🚀 Uso

1. `npm install`
2. Reemplazá `plans.csv` con tu archivo.
3. Corré con tu **Stripe API key** en una variable de entorno:

   ```bash
   STRIPE_API_KEY=sk_test_... npm start
   ```

4. ☕ — tus precios quedan creados.

Para compilar a JS (`dist/`): `npm run build`.

## 📄 Formato del CSV

La fila 1 es el encabezado (se saltea). Cada fila siguiente es un precio. El importador usa estas columnas **por posición**:

| Columna          | Posición | Ejemplo         | Stripe (Prices API)              |
|------------------|----------|-----------------|----------------------------------|
| `id`             | 1        | `platinum-year` | `lookup_key`                     |
| `Name`           | 2        | `platinum-year` | `product_data.name`              |
| `Interval`       | 4        | `year`          | `recurring.interval`             |
| `Amount`         | 5        | `270000`        | `unit_amount` (unidad mínima)    |
| `Currency`       | 6        | `gbp`           | `currency`                       |
| `Interval Count` | 7        | `1`             | `recurring.interval_count`       |

Ejemplo (`plans.csv`):

```csv
id,Name,Created (UTC),Interval,Amount,Currency,Interval Count
platinum-year,platinum-year,2017-10-12 18:39,year,270000,gbp,1
gold-year,gold-year,2017-10-12 18:38,year,128500,gbp,1
```

> ⚠️ El `Amount` va en la **unidad mínima** de la moneda (por ej., `270000` = £2.700,00 en GBP).

## 🧱 Stack

Node.js · TypeScript · [`stripe`](https://www.npmjs.com/package/stripe) v19 · [`csv-parse`](https://www.npmjs.com/package/csv-parse) v5

## ⚠️ Nota de seguridad

No commitees tu API key. Usá una **test key** (`sk_test_…`) mientras probás. La key se lee de `process.env.STRIPE_API_KEY` — nunca va hardcodeada en el código.

## 📜 Licencia

MIT — Hernán De Souza.