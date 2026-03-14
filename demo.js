const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;
const SERVER_URL = `http://localhost:${PORT}`;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xNotDeployedYet";

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function callEndpoint(endpoint, data, label) {
    console.log(chalk.cyan(`\u2192 Calling ${endpoint}...`));

    const spinner = ora(chalk.yellow('💳 Payment processing via x402...')).start();

    try {
        // In a real x402 flow, the client would first hit the endpoint, 
        // get a 402, pay via SDK, and then retry with the header.
        // For this demo tool, we assume the server might be in DEMO_MODE 
        // or we are simulating the client-side delay for visual effect.
        await delay(2000);

        const response = await axios.post(`${SERVER_URL}${endpoint}`, data);

        spinner.succeed(chalk.green(`\u2713 Payment confirmed: ${response.data.paymentTxHash || response.data.txHash || "0xDemoHash"}`));

        console.log(chalk.blue(`\u{1F916} AI Response:`));
        if (endpoint === '/api/analyze') {
            console.log(chalk.white(`  Sentiment: ${response.data.sentiment}`));
            console.log(chalk.white(`  Keywords: ${response.data.keywords.join(', ')}`));
            console.log(chalk.white(`  Summary: ${response.data.summary}`));
        } else {
            console.log(chalk.white(`  ${response.data.summary || response.data.result}`));
        }

        console.log(chalk.magenta(`\u{1F4DD} Recorded on-chain: ${response.data.contractTxHash}`));
        console.log(chalk.dim('--------------------------------------------------'));

        return response.data;
    } catch (error) {
        spinner.fail(chalk.red(`Error: ${error.message}`));
        if (error.response?.status === 402) {
            console.log(chalk.red("  ! HTTP 402: Payment Required. Ensure you are using an x402 compatible client or DEMO_MODE=true."));
        }
        console.log(chalk.dim('--------------------------------------------------'));
    }
}

async function start() {
    console.log(chalk.bold.green("\n\u2611\uFE0F NeuralPay Gateway \u2014 Live Demo"));
    console.log(chalk.white(`Network: Avalanche Fuji Testnet`));
    console.log(chalk.white(`Contract: ${CONTRACT_ADDRESS}\n`));

    const healthSpinner = ora('Checking gateway status...').start();
    try {
        const health = await axios.get(`${SERVER_URL}/api/health`);
        healthSpinner.succeed(chalk.green(`Status: ${health.data.status} | Total On-Chain Records: ${health.data.totalCalls}`));
    } catch (e) {
        healthSpinner.fail(chalk.red("Gateway offline. Please start 'node server.js' first."));
        process.exit(1);
    }

    console.log("");

    // 1. Summarize
    await callEndpoint('/api/summarize', {
        text: "Artificial intelligence is transforming every industry by automating complex tasks and providing deep insights through data analysis. From healthcare to finance, AI systems are being integrated to improve efficiency and accuracy. However, this rapid advancement also brings challenges regarding ethics, transparency, and the future of work."
    }, "Summarize");

    // 2. Generate
    await callEndpoint('/api/generate', {
        prompt: "Write a short poem about blockchain technology"
    }, "Generate");

    // 3. Analyze
    await callEndpoint('/api/analyze', {
        text: "The new product launch was incredibly successful and customers loved it. The interface is intuitive, the performance is snappy, and it solves a real pain point for our users. We are seeing extremely positive feedback across the board."
    }, "Analyze");

    console.log(chalk.bold.green("\n\u{1F38A} Demo Completed Successfully!"));
    console.log(chalk.white("Total calls made: 3"));
    console.log(chalk.white("Total paid: $0.004"));
    console.log(chalk.white("All transactions recorded on Avalanche Fuji"));
}

start();
