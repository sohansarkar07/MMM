// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessLog {
    struct PaymentRecord {
        address wallet;
        string endpoint;
        uint256 timestamp;
        uint256 amount;
    }

    mapping(address => uint256) public totalCalls;
    mapping(address => mapping(string => uint256)) public endpointCalls;
    PaymentRecord[] public paymentHistory;
    address public owner;
    uint256 public totalPayments;

    event PaymentRecorded(address indexed wallet, string endpoint, uint256 amount, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    function recordPayment(address wallet, string memory endpoint, uint256 amount) public {
        // In a real hackathon, you might want to restrict this to only be callable by the backend wallet
        // But for simplicity as per requirements:
        PaymentRecord memory newRecord = PaymentRecord({
            wallet: wallet,
            endpoint: endpoint,
            timestamp: block.timestamp,
            amount: amount
        });

        paymentHistory.push(newRecord);
        totalCalls[wallet]++;
        endpointCalls[wallet][endpoint]++;
        totalPayments++;

        emit PaymentRecorded(wallet, endpoint, amount, block.timestamp);
    }

    function hasAccess(address wallet) public view returns (bool) {
        return totalCalls[wallet] > 0;
    }

    function getPaymentHistory() public view returns (PaymentRecord[] memory) {
        return paymentHistory;
    }

    function getTotalPayments() public view returns (uint256) {
        return totalPayments;
    }
}
