// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.setAttribute('aria-expanded', nav.classList.contains('active'));
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Simulate real-time market data
    if (document.getElementById('marketData')) {
        loadMarketData();
        setInterval(loadMarketData, 30000); // Update every 30 seconds
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize PWA features
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('ServiceWorker registration successful');
            }).catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
});

// Load and display market data
function loadMarketData() {
    const marketData = [
        {
            symbol: 'BTC',
            name: 'Bitcoin',
            price: 50234.56,
            change24h: 2.34,
            marketCap: 980456789123,
            icon: 'B'
        },
        {
            symbol: 'ETH',
            name: 'Ethereum',
            price: 2987.32,
            change24h: -1.23,
            marketCap: 358456789123,
            icon: 'E'
        },
        {
            symbol: 'BNB',
            name: 'Binance Coin',
            price: 412.78,
            change24h: 0.56,
            marketCap: 68456789123,
            icon: 'B'
        },
        {
            symbol: 'SOL',
            name: 'Solana',
            price: 102.45,
            change24h: 5.67,
            marketCap: 42456789123,
            icon: 'S'
        },
        {
            symbol: 'XRP',
            name: 'Ripple',
            price: 0.5321,
            change24h: -0.34,
            marketCap: 28456789123,
            icon: 'X'
        }
    ];
    
    const marketDataElement = document.getElementById('marketData');
    if (!marketDataElement) return;
    
    marketDataElement.innerHTML = marketData.map(asset => `
        <div class="market-row">
            <div class="asset">
                <div class="asset-icon">${asset.icon}</div>
                <div>
                    <div class="asset-name">${asset.name}</div>
                    <div class="asset-symbol">${asset.symbol}</div>
                </div>
            </div>
            <div>$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div class="${asset.change24h >= 0 ? 'price-up' : 'price-down'}">
                ${asset.change24h >= 0 ? '+' : ''}${asset.change24h}%
            </div>
            <div>$${(asset.marketCap / 1000000000).toFixed(2)}B</div>
            <div>
                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">Trade</button>
            </div>
        </div>
    `).join('');
    
    // Add slight random fluctuations to simulate real-time updates
    if (typeof loadMarketData.lastUpdate === 'undefined') {
        loadMarketData.lastUpdate = Date.now();
    } else {
        const now = Date.now();
        const timeDiff = (now - loadMarketData.lastUpdate) / 1000; // in seconds
        loadMarketData.lastUpdate = now;
        
        // Update prices with small random fluctuations
        document.querySelectorAll('.market-row').forEach((row, index) => {
            const asset = marketData[index];
            const priceElement = row.children[1];
            const changeElement = row.children[2];
            
            // Small random price change
            const fluctuation = (Math.random() - 0.5) * 0.2 * timeDiff;
            const newPrice = asset.price * (1 + fluctuation / 100);
            
            // Update 24h change slightly
            const newChange = asset.change24h + (Math.random() - 0.5) * 0.1 * timeDiff;
            
            priceElement.textContent = `$${newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            changeElement.textContent = `${newChange >= 0 ? '+' : ''}${newChange.toFixed(2)}%`;
            changeElement.className = newChange >= 0 ? 'price-up' : 'price-down';
        });
    }
    // Deposit functionality
function showDepositAddress(crypto) {
    // In a real app, these would be fetched from your backend
    const depositAddresses = {
        btc: {
            address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
            memo: '',
            network: 'Bitcoin (BTC) Network'
        },
        eth: {
            address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            memo: '',
            network: 'Ethereum (ERC20) Network'
        },
        usdt: {
            address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            memo: 'Required - Include this memo',
            network: 'Tron (TRC20) Network'
        }
    };

    const addressInfo = depositAddresses[crypto.toLowerCase()];
    if (!addressInfo) return;

    const content = `
        <div class="deposit-instructions">
            <h3>Deposit ${crypto.toUpperCase()}</h3>
            <div class="qr-code-placeholder">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${addressInfo.address}" 
                     alt="${crypto.toUpperCase()} Deposit QR Code" width="150" height="150">
            </div>
            
            <div class="address-info">
                <div class="info-row">
                    <span class="info-label">Wallet Address:</span>
                    <span class="info-value" id="walletAddress">${addressInfo.address}</span>
                    <button class="btn-copy" data-target="walletAddress">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                
                ${addressInfo.memo ? `
                <div class="info-row">
                    <span class="info-label">Memo/Tag:</span>
                    <span class="info-value" id="walletMemo">${addressInfo.memo}</span>
                    <button class="btn-copy" data-target="walletMemo">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                ` : ''}
                
                <div class="info-row">
                    <span class="info-label">Network:</span>
                    <span class="info-value">${addressInfo.network}</span>
                </div>
            </div>
            
            <div class="deposit-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Send only ${crypto.toUpperCase()} to this address. Sending other assets may result in permanent loss.</p>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-primary" id="confirmDeposit">I've Sent the Funds</button>
                <button class="btn btn-outline" id="cancelDeposit">Cancel</button>
            </div>
        </div>
    `;

    document.getElementById('depositContent').innerHTML = content;
    document.getElementById('depositModal').style.display = 'flex';

    // Add copy functionality
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const text = document.getElementById(targetId).textContent;
            navigator.clipboard.writeText(text);
            showAlert('Copied to clipboard!', 'success');
        });
    });

    document.getElementById('confirmDeposit').addEventListener('click', function() {
        // In a real app, you would confirm the deposit with your backend
        showAlert('Deposit initiated. Your funds will be credited after confirmation.', 'success');
        document.getElementById('depositModal').style.display = 'none';
    });

    document.getElementById('cancelDeposit').addEventListener('click', function() {
        document.getElementById('depositModal').style.display = 'none';
    });
}

// Withdrawal functionality
function showWithdrawalDetails() {
    // In a real app, these would be fetched from your backend
    const withdrawalInfo = {
        bank: {
            name: 'Bank of America',
            account: '******7890',
            routing: '026009593',
            swift: 'BOFAUS3N'
        },
        crypto: {
            btc: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
            eth: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
        }
    };

    const content = `
        <div class="withdrawal-instructions">
            <h3>Withdrawal Details</h3>
            
            <div class="withdrawal-methods">
                <div class="method-tabs">
                    <button class="method-tab active" data-method="bank">Bank Transfer</button>
                    <button class="method-tab" data-method="crypto">Cryptocurrency</button>
                </div>
                
                <div class="method-content active" id="bankMethod">
                    <div class="info-row">
                        <span class="info-label">Bank Name:</span>
                        <span class="info-value">${withdrawalInfo.bank.name}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Account Number:</span>
                        <span class="info-value">${withdrawalInfo.bank.account}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Routing Number:</span>
                        <span class="info-value">${withdrawalInfo.bank.routing}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">SWIFT Code:</span>
                        <span class="info-value">${withdrawalInfo.bank.swift}</span>
                    </div>
                    
                    <div class="withdrawal-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Bank transfers may take 3-5 business days to process. Ensure your account details are correct.</p>
                    </div>
                </div>
                
                <div class="method-content" id="cryptoMethod">
                    <div class="info-row">
                        <span class="info-label">BTC Address:</span>
                        <span class="info-value" id="btcWithdrawal">${withdrawalInfo.crypto.btc}</span>
                        <button class="btn-copy" data-target="btcWithdrawal">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="info-row">
                        <span class="info-label">ETH Address:</span>
                        <span class="info-value" id="ethWithdrawal">${withdrawalInfo.crypto.eth}</span>
                        <button class="btn-copy" data-target="ethWithdrawal">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    
                    <div class="withdrawal-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Send only to this exact address. Transactions cannot be reversed.</p>
                    </div>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-primary" id="confirmWithdrawal">Confirm Withdrawal</button>
                <button class="btn btn-outline" id="cancelWithdrawal">Cancel</button>
            </div>
        </div>
    `;

    document.getElementById('withdrawContent').innerHTML = content;
    document.getElementById('withdrawModal').style.display = 'flex';

    // Tab functionality
    document.querySelectorAll('.method-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Update active tab
            document.querySelectorAll('.method-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.method-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${method}Method`).classList.add('active');
        });
    });

    // Copy functionality
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const text = document.getElementById(targetId).textContent;
            navigator.clipboard.writeText(text);
            showAlert('Copied to clipboard!', 'success');
        });
    });

    document.getElementById('confirmWithdrawal').addEventListener('click', function() {
        // In a real app, you would confirm the withdrawal with your backend
        showAlert('Withdrawal request submitted. Processing may take 24-48 hours.', 'success');
        document.getElementById('withdrawModal').style.display = 'none';
    });

    document.getElementById('cancelWithdrawal').addEventListener('click', function() {
        document.getElementById('withdrawModal').style.display = 'none';
    });
}

// Update your existing deposit and withdrawal button event listeners
if (depositBtn) {
    depositBtn.addEventListener('click', function() {
        // Show crypto selection first
        const content = `
            <div class="crypto-selection">
                <h3>Select Deposit Method</h3>
                <div class="crypto-options">
                    <div class="crypto-option" data-crypto="btc">
                        <i class="fab fa-bitcoin"></i>
                        <span>Bitcoin (BTC)</span>
                    </div>
                    <div class="crypto-option" data-crypto="eth">
                        <i class="fab fa-ethereum"></i>
                        <span>Ethereum (ETH)</span>
                    </div>
                    <div class="crypto-option" data-crypto="usdt">
                        <i class="fas fa-coins"></i>
                        <span>Tether (USDT)</span>
                    </div>
                </div>
                <button class="btn btn-outline btn-block" id="cancelDepositSelect">Cancel</button>
            </div>
        `;
        
        document.getElementById('depositContent').innerHTML = content;
        document.getElementById('depositModal').style.display = 'flex';
        
        document.querySelectorAll('.crypto-option').forEach(option => {
            option.addEventListener('click', function() {
                const crypto = this.getAttribute('data-crypto');
                showDepositAddress(crypto);
            });
        });
        
        document.getElementById('cancelDepositSelect').addEventListener('click', function() {
            document.getElementById('depositModal').style.display = 'none';
        });
    });
}

if (withdrawBtn) {
    withdrawBtn.addEventListener('click', function() {
        if (userData.balance <= 0) {
            // Show deposit prompt if no balance
            withdrawContent.innerHTML = `
                <div style="text-align: center; padding: 20px 0;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: var(--accent); margin-bottom: 20px;"></i>
                    <h3>Account Balance Insufficient</h3>
                    <p>You need to deposit funds before you can make a withdrawal.</p>
                    <button class="btn btn-primary" id="goToDeposit" style="margin-top: 20px;">Deposit Funds</button>
                </div>
            `;
            
            document.getElementById('goToDeposit').addEventListener('click', function() {
                withdrawModal.style.display = 'none';
                depositBtn.click();
            });
        } else {
            showWithdrawalDetails();
        }
        
        withdrawModal.style.display = 'flex';
    });
}
}