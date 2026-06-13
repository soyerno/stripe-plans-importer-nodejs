import { readFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import Stripe from 'stripe';

const apiKey = process.env.STRIPE_API_KEY;
if (!apiKey) {
  console.error('Falta STRIPE_API_KEY. Corré: STRIPE_API_KEY=sk_test_... npm start');
  process.exit(1);
}

const stripe = new Stripe(apiKey);

const CSV_PATH = process.env.PLANS_CSV ?? './plans.csv';

// Columnas posicionales del CSV exportado por Stripe (la fila 1 es encabezado):
// 0:id  1:Name  2:Created (UTC)  3:Interval  4:Amount  5:Currency  6:Interval Count
type Row = string[];

const records: Row[] = parse(readFileSync(CSV_PATH), {
  from_line: 2,
  skip_empty_lines: true,
  trim: true,
});

async function createPrice(row: Row): Promise<void> {
  const [id, name, , interval, amount, currency, intervalCount] = row;

  // La API de Plans está deprecada: creamos un Price recurrente con su Product
  // inline. El viejo `id` del plan se conserva como `lookup_key` (los Price ids
  // los genera Stripe y no se pueden fijar).
  const price = await stripe.prices.create({
    currency,
    unit_amount: Number(amount), // unidad mínima (ej. centavos)
    lookup_key: id,
    recurring: {
      interval: interval as Stripe.PriceCreateParams.Recurring.Interval,
      interval_count: intervalCount ? Number(intervalCount) : 1,
    },
    product_data: { name },
  });

  console.log(`Price ${price.id} (${id}) creado`);
}

async function main(): Promise<void> {
  for (const row of records) {
    try {
      await createPrice(row);
    } catch (err) {
      console.error(`Error en "${row[0]}":`, err instanceof Error ? err.message : err);
    }
  }
}

void main();
