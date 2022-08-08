# Toxicity Script
This repository calculates a lending toxicity metric for Hundred Finance on Polygon.

### To test:

1. Clone the repository
2. Create a .env file based on the example (update the nodeURL)
3. Run:

```node
npm install
```

To update the collateral/loan pair, change the `COLLATERAL_ASSET` and `DEBT_ASSET` variables in `./scripts/calculate_toxicity.js`.

### Get Toxicity:
Run:

```node
node scripts/calculate_toxicity.js
```