"""Simulate federated averaging on heterogeneous synthetic transaction data."""
import json
import math
import random


def generate(count, region, rng):
    rows = []
    for _ in range(count):
        amount = rng.random()
        velocity = rng.random()
        probability = sigmoid(8 * amount + 7 * velocity - 9 + region)
        rows.append(((1.0, amount, velocity), int(rng.random() < probability)))
    return rows


def sigmoid(value):
    return 1 / (1 + math.exp(-value))


def predict(weights, features):
    return sigmoid(sum(w * x for w, x in zip(weights, features)))


def update(weights, rows, rate=0.8):
    gradient = [0.0] * len(weights)
    for features, label in rows:
        error = predict(weights, features) - label
        for index, feature in enumerate(features):
            gradient[index] += error * feature
    return [w - rate * g / len(rows) for w, g in zip(weights, gradient)]


class Client:
    def __init__(self, rows):
        self.rows = rows

    def train(self, weights):
        for _ in range(8):
            weights = update(weights, self.rows)
        return len(self.rows), weights


def loss(weights, rows):
    total = 0.0
    for features, label in rows:
        score = min(max(predict(weights, features), 1e-12), 1 - 1e-12)
        total -= math.log(score if label else 1 - score)
    return total / len(rows)


def run(seed=42):
    rng = random.Random(seed)
    regions = [-1, 0, 1]
    clients = [Client(generate(300 + 100 * i, offset, rng)) for i, offset in enumerate(regions)]
    validation = [row for offset in regions for row in generate(200, offset, rng)]
    weights = [0.0, 0.0, 0.0]
    baseline = loss(weights, validation)
    rounds = 30
    for _ in range(rounds):
        updates = [client.train(weights) for client in clients]
        samples = sum(count for count, _ in updates)
        weights = [
            sum(count * model[index] for count, model in updates) / samples
            for index in range(len(weights))
        ]
    return {
        "clients": len(clients),
        "rounds": rounds,
        "holdout_samples": len(validation),
        "baseline_log_loss": round(baseline, 4),
        "federated_log_loss": round(loss(weights, validation), 4),
    }


if __name__ == "__main__":
    print(json.dumps(run(), indent=2))
