# NeuralPay Gateway

**NeuralPay Gateway** is a Pay-Per-Use AI Gateway that integrates the **x402 Payment Protocol** with **On-Chain Access Logging** on the Avalanche Fuji Testnet.

## What it does
NeuralPay Gateway allows developers to monetize AI services with micro-fees. Every request is gated by an x402 paywall, ensuring instant crypto settlement before the AI response is delivered. Additionally, every successful payment is permanently logged on-chain via a smart contract for transparent usage auditing.

## How x402 Works Here
- **402 Required**: Any request to an AI endpoint without a valid payment header receives an HTTP 402 code.
- **Micro-Payments**: Users pay a specific set price (e.g., $0.001) in USDC via the Facinet facilitator network.
- **Gasless for Users**: The x402 protocol allows users to sign payments while facilitators pay the gas.
- **Instant Unlock**: Once payment is verified, the server executes the Gemini AI task and logs the transaction on-chain.

## Smart Contract
- **Contract Address**: `[CONTRACT_ADDRESS]`
- **Network**: Avalanche Fuji Testnet
- **Explorer**: [https://testnet.snowtrace.io/address/[CONTRACT_ADDRESS]](https://testnet.snowtrace.io/address/[CONTRACT_ADDRESS])

## Tech Stack
- **Backend**: Node.js, Express
- **AI**: Gemini 1.5 Flash (@google/generative-ai)
- **Payments**: facinet-sdk (x402 Protocol)
- **Blockchain**: Solidity, Ethers.js, Hardhat (Avalanche Fuji)
- **Logistics**: Dotenv, Chalk, Ora

## Setup

1. **Clone Repo**
   ```bash
   git clone <repo-url>
   cd neuralpay-gateway
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd contracts && npm install
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Fill in `GEMINI_API_KEY`, `WALLET_ADDRESS`, and `PRIVATE_KEY`.

4. **Deploy Smart Contract**
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network fuji
   ```
   - Copy the deployed address into your `.env` file as `CONTRACT_ADDRESS`.

5. **Start Server**
   ```bash
   node server.js
   ```

6. **Run Demo**
   ```bash
   node demo.js
   ```

## API Endpoints

### 1. Summarize Text ($0.001)
```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -H "X-Payment: <x402-payload>" \
  -d '{"text": "Your long text here..."}'
```

### 2. Generate Content ($0.002)
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -H "X-Payment: <x402-payload>" \
  -d '{"prompt": "Your AI prompt here..."}'
```

### 3. Analyze Text ($0.001)
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -H "X-Payment: <x402-payload>" \
  -d '{"text": "Text to analyze sentiment..."}'
```

### 4. History (Free)
```bash
curl http://localhost:3000/api/history
```
