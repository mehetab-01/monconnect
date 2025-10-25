MonConnect

A Decentralized Escrow and Dispute Resolution Platform built on Monad Blockchain

MonConnect is a Web3-based platform that enables transparent collaboration between organizers and service providers. It ensures secure transactions through smart contract-based escrow management and introduces a decentralized jury system using AVS (Actively Validated Services) for fair dispute resolution.

-> Features
 Wallet Integration (MonConnect + MetaMask) — Seamless blockchain login and identity verification.

 Organizer & Service Provider Roles — Dual dashboards for managing projects and services.

 Escrow Smart Contract — Funds held securely until both parties confirm task completion.

 Jury-Based Dispute Resolution (AVS) — Decentralized voting mechanism powered by Monad validators.

-> NFT Identity — Unique NFTs for verified users.

  Real-Time Notifications — Transaction and dispute updates instantly shown on dashboard.

 Transparent Ledger — Every transaction and verdict recorded immutably on the Monad blockchain.



 Tech Stack

Frontend: React.js / TypeScript / Tailwind CSS
Backend: Solidity
Blockchain: Monad Network
Smart Contracts: Solidity
Storage: IPFS (optional for metadata/NFTs)
Web3 Libraries: Ethers.js, MonConnect SDK

 Setup & Installation
# Clone the repository
git clone https://github.com/<your-username>/MonConnect.git

# Navigate into the project
cd MonConnect

# Install dependencies
npm install

# Run the development server
npm start

Smart Contracts
Contract	Purpose
Escrow.sol	Handles fund deposit, release, and refund between parties
NFTVerify.sol	Mints identity NFTs for verified users

Deploy contracts using in remix ide.


-> Dispute Flow

Organizer or Service Provider raises a dispute.

Consensus is reached; results automatically executed by smart contract.

Rewards or penalties are distributed accordingly.

 -> Future Enhancements

Integration with EigenLayer Restaking for advanced AVS validation.
SBT for more trust and transperency.
DAO-based governance for jury selection.
