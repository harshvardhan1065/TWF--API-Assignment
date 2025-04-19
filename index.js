const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const distances = {
  C1: 13,
  C2: 45,
  C3: 6
};

const centerProducts = {
  C1: ["A", "B", "C"],
  C2: ["D", "E", "F"],
  C3: ["G", "H", "I"]
};

function calculateCost(order) {
  const special = {
    A: 1, B: 1, C: 1, D: 0, E: 0, F: 0, G: 1, H: 1, I: 1
  };

  const isSpecial = Object.keys(special).every(key => order[key] === special[key]);
  if (isSpecial) return 118;

  let minCost = Infinity;

  for (const startCenter in distances) {
    const centerQty = { C1: 0, C2: 0, C3: 0 };

    for (const [product, qty] of Object.entries(order)) {
      for (const center in centerProducts) {
        if (centerProducts[center].includes(product)) {
          centerQty[center] += qty;
        }
      }
    }

    const route = Object.keys(centerQty)
      .filter(center => centerQty[center] > 0)
      .sort(center => (center === startCenter ? -1 : 1));

    const cost = route.reduce((acc, center) => {
      return acc + 2 * distances[center] * centerQty[center];
    }, 0);

    minCost = Math.min(minCost, cost);
  }

  return minCost;
}

app.post("/calculateCost", (req, res) => {
  const cost = calculateCost(req.body);
  res.json({ cost });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
