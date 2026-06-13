# stripe-plans-importer-nodejs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat&logo=stripe&logoColor=white)

Importá planes de **Stripe en masa desde un CSV** con Node.js. Apuntalo a un `plans.csv`, corré un comando y listo — sin crear cada plan a mano en el dashboard.

## 🚀 Uso

1. `npm install`
2. Poné tu **Stripe API key** en `index.js` (primera línea: `require('stripe')('TU_API_KEY')`).
3. Reemplazá `plans.csv` con tu archivo.
4. `node index.js`
5. ☕ — tus planes quedan creados.

## 📄 Formato del CSV

La fila 1 es el encabezado (se saltea). Cada fila siguiente es un plan. El importador usa estas columnas:

| Columna   | Posición | Ejemplo         | Stripe field |
|-----------|----------|-----------------|--------------|
| `id`      | 1        | `platinum-year` | `id`         |
| `Name`    | 2        | `platinum-year` | `name`       |
| `Interval`| 4        | `year`          | `interval`   |
| `Amount`  | 5        | `270000`        | `amount` (en la unidad mínima, ej. centavos) |
| `Currency`| 6        | `gbp`           | `currency`   |

Ejemplo (`plans.csv`):

```csv
id,Name,Created (UTC),Interval,Amount,Currency
platinum-year,platinum-year,2017-10-12 18:39,year,270000,gbp
gold-year,gold-year,2017-10-12 18:38,year,128500,gbp
```

> ⚠️ El `Amount` va en la **unidad mínima** de la moneda (por ej., `270000` = £2.700,00 en GBP).

## 🧱 Stack

Node.js · [`stripe`](https://www.npmjs.com/package/stripe) · [`csv`](https://www.npmjs.com/package/csv)

## ⚠️ Nota de seguridad

No commitees tu API key. Usá una **test key** (`sk_test_…`) mientras pruebas y movela a una variable de entorno (`process.env.STRIPE_KEY`) antes de usarla en serio.

## 📜 Licencia

MIT — Hernán De Souza.
