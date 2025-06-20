document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const transactionModal = document.getElementById('transactionModal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modalTitle');
    const transactionForm = document.getElementById('transactionForm');
    const depositSection = document.getElementById('depositSection');
    const withdrawSection = document.getElementById('withdrawSection');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const currencySelect = document.getElementById('currency');
    const amountInput = document.getElementById('amount');
    const currencySymbol = document.getElementById('currencySymbol');
    const currentBalance = document.getElementById('currentBalance');
    const amountOptions = document.querySelectorAll('.amount-option');
    const copyAddressBtn = document.getElementById('copyAddress');
    const depositAddress = document.getElementById('depositAddress');
    const withdrawAddress = document.getElementById('withdrawAddress');
    const networkSelect = document.getElementById('network');
    const networkFee = document.getElementById('networkFee');
    const receiveAmount = document.getElementById('receiveAmount');
    const submitBtn = document.getElementById('submitBtn');
    const amountLabel = document.getElementById('amountLabel');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // User data from authentication
    const currentUser = JSON.parse(localStorage.getItem('cryptoUser')) || {
        name: 'shadrack Arhin',
        balances: {
            BTC: 0.054321,
            ETH: 1.234567,
            USDT: 1250.50
        }
    };
    
    // Mock deposit addresses (replace with actual data from your backend)
    const depositAddresses = {
        BTC: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
        ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        USDT: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    };
    
    // Mock network fees (replace with actual data from your backend)
    const networkFees = {
        BTC: 0.0005,
        ETH: 0.001,
        USDT: 1.0
    };
    
    // Current transaction type
    let currentTransactionType = 'deposit';
    
    // Initialize dashboard
    function initDashboard() {
        // Set username in header
        document.querySelector('.username').textContent = currentUser.name;
        
        // Update currency info
        updateCurrencyInfo();
        
        // Add event listeners
        depositBtn.addEventListener('click', () => {
            currentTransactionType = 'deposit';
            openModal('Deposit Crypto');
        });
        
        withdrawBtn.addEventListener('click', () => {
            currentTransactionType = 'withdraw';
            openModal('Withdraw Crypto');
        });
        
        closeModal.addEventListener('click', closeModalFunc);
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === transactionModal) {
                closeModalFunc();
            }
        });
        
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                currentTransactionType = tab;
                
                // Update active tab
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update UI
                if (tab === 'deposit') {
                    depositSection.style.display = 'block';
                    withdrawSection.style.display = 'none';
                    modalTitle.textContent = 'Deposit Crypto';
                    amountLabel.textContent = 'Amount to Deposit';
                    submitBtn.querySelector('.btn-text').textContent = 'Proceed to Deposit';
                } else {
                    depositSection.style.display = 'none';
                    withdrawSection.style.display = 'block';
                    modalTitle.textContent = 'Withdraw Crypto';
                    amountLabel.textContent = 'Amount to Withdraw';
                    submitBtn.querySelector('.btn-text').textContent = 'Request Withdrawal';
                    updateWithdrawalInfo();
                }
            });
        });
        
        // Currency change
        currencySelect.addEventListener('change', updateCurrencyInfo);
        
        // Amount percentage buttons
        amountOptions.forEach(option => {
            option.addEventListener('click', () => {
                const percent = parseFloat(option.dataset.percent) / 100;
                const maxAmount = currentTransactionType === 'deposit' ? 10000 : currentUser.balances[currencySelect.value];
                const amount = maxAmount * percent;
                amountInput.value = amount.toFixed(6);
                updateWithdrawalInfo();
            });
        });
        
        // Amount input changes
        amountInput.addEventListener('input', updateWithdrawalInfo);
        
        // Copy address button
        copyAddressBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(depositAddress.textContent)
                .then(() => showNotification('Address copied to clipboard!', 'success'))
                .catch(() => showNotification('Failed to copy address', 'error'));
        });
        
        // Network change
        networkSelect.addEventListener('change', updateWithdrawalInfo);
        
        // Form submission
        transactionForm.addEventListener('submit', handleTransaction);
        
        // Logout button
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Open modal with specific title
    function openModal(title) {
        // Reset form
        transactionForm.reset();
        
        // Update UI based on transaction type
        if (currentTransactionType === 'deposit') {
            tabBtns[0].click();
        } else {
            tabBtns[1].click();
        }
        
        modalTitle.textContent = title;
        transactionModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModalFunc() {
        transactionModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Update currency-related information
    function updateCurrencyInfo() {
        const currency = currencySelect.value;
        
        // Update symbol
        currencySymbol.textContent = currency;
        
        // Update balance display
        currentBalance.textContent = currentUser.balances[currency].toFixed(6);
        
        // Update deposit address
        depositAddress.textContent = depositAddresses[currency];
        
        // Update withdrawal info if needed
        if (currentTransactionType === 'withdraw') {
            updateWithdrawalInfo();
        }
    }
    
    // Update withdrawal information (fee, receive amount)
    function updateWithdrawalInfo() {
        if (currentTransactionType !== 'withdraw') return;
        
        const currency = currencySelect.value;
        const amount = parseFloat(amountInput.value) || 0;
        const fee = networkFees[currency];
        
        // Update network fee
        networkFee.textContent = `${fee} ${currency}`;
        
        // Calculate and update receive amount
        const receive = Math.max(0, amount - fee);
        receiveAmount.textContent = `${receive.toFixed(6)} ${currency}`;
        
        // Validate amount
        if (amount > currentUser.balances[currency]) {
            showNotification('Insufficient balance', 'error');
            submitBtn.disabled = true;
        } else if (amount > 0) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }
    
    // Handle transaction submission
    async function handleTransaction(e) {
        e.preventDefault();
        
        const currency = currencySelect.value;
        const amount = parseFloat(amountInput.value);
        const submitText = submitBtn.querySelector('.btn-text');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Validate inputs
            if (!amount || amount <= 0) {
                throw new Error('Please enter a valid amount');
            }
            
            if (currentTransactionType === 'withdraw') {
                const address = withdrawAddress.value.trim();
                if (!address) {
                    throw new Error('Please enter a valid wallet address');
                }
                
                if (amount > currentUser.balances[currency]) {
                    throw new Error('Insufficient balance');
                }
            }
            
            // Simulate API call (replace with actual fetch)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            const action = currentTransactionType === 'deposit' ? 'deposited' : 'withdrawn';
            showNotification(`Successfully ${action} ${amount} ${currency}`, 'success');
            
            // Update balance (in a real app, this would come from the backend)
            if (currentTransactionType === 'deposit') {
                currentUser.balances[currency] += amount;
            } else {
                currentUser.balances[currency] -= amount;
            }
            
            // Update localStorage
            localStorage.setItem('cryptoUser', JSON.stringify(currentUser));
            
            // Update balance display
            currentBalance.textContent = currentUser.balances[currency].toFixed(6);
            
            // Close modal after delay
            setTimeout(() => {
                closeModalFunc();
                submitBtn.classList.remove('loading');
            }, 1500);
            
        } catch (error) {
            showNotification(error.message, 'error');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    // Handle logout
    function handleLogout() {
        localStorage.removeItem('cryptoUser');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
        
        notificationMessage.textContent = message;
        notification.className = 'notification';
        notification.classList.add(type);
        notification.classList.add('show');
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    
    // Initialize everything
    initDashboard();
    
    // Simulate real-time price updates (replace with actual WebSocket connection)
    setInterval(() => {
        // In a real app, you would update prices from a WebSocket feed
        console.log('Updating prices...');
    }, 30000);
});