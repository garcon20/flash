// Admin Dashboard Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tab functionality
    initTabs();
    
    // Load data based on current page
    const path = window.location.pathname;
    if (path.includes('admin.html')) {
        loadAdminDashboard();
    } else if (path.includes('users.html')) {
        loadUsers();
    } else if (path.includes('transactions.html')) {
        loadAdminTransactions();
    } else if (path.includes('settings.html')) {
        initSettings();
    }
    
    // Logout functionality
    document.getElementById('adminLogoutBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        // In a real app, you would call your backend logout endpoint
        sessionStorage.removeItem('cryptoFlashAdminToken');
        window.location.href = '../login.html';
    });
});

// Initialize tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Load admin dashboard data
function loadAdminDashboard() {
    // Simulated admin data
    const adminData = {
        totalUsers: 142,
        newUsersThisWeek: 18,
        totalDeposits: 35420.75,
        depositChangePercent: 7.2,
        pendingWithdrawals: 12450.30,
        pendingRequests: 9,
        recentActivity: [
            {
                id: 'txn_001',
                date: new Date(),
                user: 'john.doe@example.com',
                activity: 'Withdrawal Request',
                amount: 1250.00,
                status: 'Pending'
            },
            {
                id: 'txn_002',
                date: new Date(Date.now() - 3600000),
                user: 'jane.smith@example.com',
                activity: 'Deposit',
                amount: 2500.00,
                status: 'Completed'
            },
            {
                id: 'txn_003',
                date: new Date(Date.now() - 86400000),
                user: 'mike.johnson@example.com',
                activity: 'Withdrawal Request',
                amount: 750.00,
                status: 'Pending'
            },
            {
                id: 'txn_004',
                date: new Date(Date.now() - 172800000),
                user: 'sarah.williams@example.com',
                activity: 'Deposit',
                amount: 1800.00,
                status: 'Completed'
            },
            {
                id: 'txn_005',
                date: new Date(Date.now() - 259200000),
                user: 'david.brown@example.com',
                activity: 'Withdrawal Request',
                amount: 950.00,
                status: 'Pending'
            }
        ]
    };

    // Update stats
    document.getElementById('totalUsers').textContent = adminData.totalUsers;
    document.querySelector('.card:nth-child(1) .card-body p span').textContent = 
        `+${adminData.newUsersThisWeek}`;
    
    document.getElementById('totalDeposits').textContent = `$${adminData.totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.querySelector('.card:nth-child(2) .card-body p span').textContent = 
        `+${adminData.depositChangePercent}%`;
    
    document.getElementById('pendingWithdrawals').textContent = `$${adminData.pendingWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.querySelector('.card:nth-child(3) .card-body p span').textContent = 
        `+${adminData.pendingRequests}`;

    // Update activity table
    const activityTable = document.getElementById('adminActivityTable');
    if (adminData.recentActivity.length === 0) {
        activityTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No recent activity</td>
            </tr>
        `;
    } else {
        activityTable.innerHTML = adminData.recentActivity.map(activity => `
            <tr data-id="${activity.id}">
                <td>${new Date(activity.date).toLocaleString()}</td>
                <td>${activity.user}</td>
                <td>${activity.activity}</td>
                <td>$${activity.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>
                    <span class="status status-${activity.status.toLowerCase()}">
                        ${activity.status}
                    </span>
                </td>
                <td class="action-buttons">
                    ${activity.status === 'Pending' ? `
                        <button class="btn-approve" data-id="${activity.id}">Approve</button>
                        <button class="btn-reject" data-id="${activity.id}">Reject</button>
                    ` : 'N/A'}
                </td>
            </tr>
        `).join('');

        // Add event listeners to action buttons
        document.querySelectorAll('.btn-approve').forEach(btn => {
            btn.addEventListener('click', function() {
                const txnId = this.getAttribute('data-id');
                const row = document.querySelector(`tr[data-id="${txnId}"]`);
                
                if (row) {
                    row.querySelector('td:nth-child(5) span').textContent = 'Approved';
                    row.querySelector('td:nth-child(5) span').className = 'status status-success';
                    row.querySelector('td:nth-child(6)').textContent = 'Completed';
                    
                    // In a real app, you would send an API request to update the transaction status
                    showAlert('Withdrawal approved successfully', 'success');
                }
            });
        });

        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', function() {
                const txnId = this.getAttribute('data-id');
                const row = document.querySelector(`tr[data-id="${txnId}"]`);
                
                if (row) {
                    row.querySelector('td:nth-child(5) span').textContent = 'Rejected';
                    row.querySelector('td:nth-child(5) span').className = 'status status-failed';
                    row.querySelector('td:nth-child(6)').textContent = 'Completed';
                    
                    // In a real app, you would send an API request to update the transaction status
                    showAlert('Withdrawal rejected', 'error');
                }
            });
        });
    }
}

// Load users data
function loadUsers() {
    // Simulated users data
    const usersData = [
        {
            id: 'user_001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            joined: new Date(Date.now() - 86400000 * 7),
            status: 'active',
            balance: 1250.50,
            role: 'user'
        },
        {
            id: 'user_002',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            joined: new Date(Date.now() - 86400000 * 14),
            status: 'active',
            balance: 3250.75,
            role: 'user'
        },
        {
            id: 'user_003',
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            joined: new Date(Date.now() - 86400000 * 30),
            status: 'pending',
            balance: 500.00,
            role: 'user'
        },
        {
            id: 'user_004',
            name: 'Sarah Williams',
            email: 'sarah.williams@example.com',
            joined: new Date(Date.now() - 86400000 * 45),
            status: 'suspended',
            balance: 0.00,
            role: 'user'
        },
        {
            id: 'user_005',
            name: 'Admin User',
            email: 'admin@cryptoflash.com',
            joined: new Date(Date.now() - 86400000 * 60),
            status: 'active',
            balance: 0.00,
            role: 'admin'
        }
    ];

    const usersTable = document.getElementById('usersTable');
    if (usersData.length === 0) {
        usersTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No users found</td>
            </tr>
        `;
    } else {
        usersTable.innerHTML = usersData.map(user => `
            <tr data-id="${user.id}">
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.joined.toLocaleDateString()}</td>
                <td>
                    <span class="status status-${user.status}">
                        ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                </td>
                <td>$${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td class="action-buttons">
                    <button class="btn-view" data-id="${user.id}">View</button>
                    <button class="btn-approve" data-id="${user.id}">Edit</button>
                    ${user.role !== 'admin' ? `
                        <button class="btn-reject" data-id="${user.id}">${user.status === 'suspended' ? 'Activate' : 'Suspend'}</button>
                    ` : ''}
                </td>
            </tr>
        `).join('');

        // Add event listeners to action buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                // In a real app, you would navigate to user details page
                showAlert(`Viewing user ${userId}`, 'success');
            });
        });

        document.querySelectorAll('.btn-approve').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                openEditUserModal(userId);
            });
        });

        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                const row = document.querySelector(`tr[data-id="${userId}"]`);
                if (row) {
                    const statusCell = row.querySelector('td:nth-child(5) span');
                    if (statusCell.textContent.toLowerCase() === 'suspended') {
                        statusCell.textContent = 'Active';
                        statusCell.className = 'status status-active';
                        this.textContent = 'Suspend';
                        showAlert('User activated successfully', 'success');
                    } else {
                        statusCell.textContent = 'Suspended';
                        statusCell.className = 'status status-suspended';
                        this.textContent = 'Activate';
                        showAlert('User suspended successfully', 'warning');
                    }
                }
            });
        });
    }

    // Add user button
    document.getElementById('addUserBtn')?.addEventListener('click', function() {
        document.getElementById('addUserModal').style.display = 'flex';
    });

    // Close modals
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Add user form submission
    document.getElementById('addUserForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, you would send an API request to create a new user
        showAlert('User created successfully', 'success');
        this.reset();
        document.getElementById('addUserModal').style.display = 'none';
    });

    // Search functionality
    document.getElementById('userSearch')?.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#usersTable tr[data-id]');
        
        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || email.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Open edit user modal
function openEditUserModal(userId) {
    // In a real app, you would fetch user data from API
    const userData = {
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'user',
        status: 'active',
        balance: 1250.50
    };

    // Fill form with user data
    document.getElementById('editUserId').value = userData.id;
    document.getElementById('editUserName').value = userData.name;
    document.getElementById('editUserEmail').value = userData.email;
    document.getElementById('editUserRole').value = userData.role;
    document.getElementById('editUserStatus').value = userData.status;
    document.getElementById('editUserBalance').value = userData.balance.toFixed(2);

    // Show modal
    document.getElementById('editUserModal').style.display = 'flex';

    // Edit user form submission
    document.getElementById('editUserForm').onsubmit = function(e) {
        e.preventDefault();
        // In a real app, you would send an API request to update the user
        showAlert('User updated successfully', 'success');
        document.getElementById('editUserModal').style.display = 'none';
        
        // Update the table row
        const row = document.querySelector(`tr[data-id="${userId}"]`);
        if (row) {
            row.querySelector('td:nth-child(2)').textContent = this.editUserName.value;
            row.querySelector('td:nth-child(3)').textContent = this.editUserEmail.value;
            
            const statusCell = row.querySelector('td:nth-child(5) span');
            statusCell.textContent = this.editUserStatus.value.charAt(0).toUpperCase() + this.editUserStatus.value.slice(1);
            statusCell.className = `status status-${this.editUserStatus.value}`;
            
            row.querySelector('td:nth-child(6)').textContent = `$${parseFloat(this.editUserBalance.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };
}

// Load admin transactions
function loadAdminTransactions() {
    // Simulated transactions data
    const transactionsData = [
        {
            id: 'txn_001',
            date: new Date(),
            user: 'john.doe@example.com',
            type: 'Withdrawal',
            amount: 1250.00,
            status: 'Pending'
        },
        {
            id: 'txn_002',
            date: new Date(Date.now() - 3600000),
            user: 'jane.smith@example.com',
            type: 'Deposit',
            amount: 2500.00,
            status: 'Completed'
        },
        {
            id: 'txn_003',
            date: new Date(Date.now() - 86400000),
            user: 'mike.johnson@example.com',
            type: 'Trade',
            amount: 500.00,
            status: 'Completed'
        },
        {
            id: 'txn_004',
            date: new Date(Date.now() - 172800000),
            user: 'sarah.williams@example.com',
            type: 'Withdrawal',
            amount: 750.00,
            status: 'Failed'
        },
        {
            id: 'txn_005',
            date: new Date(Date.now() - 259200000),
            user: 'david.brown@example.com',
            type: 'Deposit',
            amount: 1800.00,
            status: 'Completed'
        }
    ];

    const transactionsTable = document.getElementById('adminTransactionsTable');
    if (transactionsData.length === 0) {
        transactionsTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No transactions found</td>
            </tr>
        `;
    } else {
        transactionsTable.innerHTML = transactionsData.map(txn => `
            <tr data-id="${txn.id}">
                <td>${txn.id}</td>
                <td>${txn.date.toLocaleString()}</td>
                <td>${txn.user}</td>
                <td>${txn.type}</td>
                <td>$${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>
                    <span class="status status-${txn.status.toLowerCase()}">
                        ${txn.status}
                    </span>
                </td>
                <td class="action-buttons">
                    <button class="btn-view" data-id="${txn.id}">Details</button>
                    ${txn.status === 'Pending' ? `
                        <button class="btn-approve" data-id="${txn.id}">Approve</button>
                        <button class="btn-reject" data-id="${txn.id}">Reject</button>
                    ` : ''}
                </td>
            </tr>
        `).join('');

        // Add event listeners to action buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const txnId = this.getAttribute('data-id');
                showTransactionDetails(txnId);
            });
        });

        document.querySelectorAll('.btn-approve').forEach(btn => {
            btn.addEventListener('click', function() {
                const txnId = this.getAttribute('data-id');
                const row = document.querySelector(`tr[data-id="${txnId}"]`);
                
                if (row) {
                    row.querySelector('td:nth-child(6) span').textContent = 'Completed';
                    row.querySelector('td:nth-child(6) span').className = 'status status-completed';
                    row.querySelector('td:nth-child(7)').innerHTML = '<button class="btn-view" data-id="${txnId}">Details</button>';
                    showAlert('Transaction approved successfully', 'success');
                }
            });
        });

        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', function() {
                const txnId = this.getAttribute('data-id');
                const row = document.querySelector(`tr[data-id="${txnId}"]`);
                
                if (row) {
                    row.querySelector('td:nth-child(6) span').textContent = 'Failed';
                    row.querySelector('td:nth-child(6) span').className = 'status status-failed';
                    row.querySelector('td:nth-child(7)').innerHTML = '<button class="btn-view" data-id="${txnId}">Details</button>';
                    showAlert('Transaction rejected', 'warning');
                }
            });
        });
    }

    // Filter functionality
    document.getElementById('adminTypeFilter')?.addEventListener('change', filterTransactions);
    document.getElementById('adminStatusFilter')?.addEventListener('change', filterTransactions);
    document.getElementById('adminDateFilter')?.addEventListener('change', filterTransactions);
    document.getElementById('adminUserFilter')?.addEventListener('change', filterTransactions);

    // Search functionality
    document.getElementById('userSearch')?.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#adminTransactionsTable tr[data-id]');
        
        rows.forEach(row => {
            const user = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const type = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            
            if (user.includes(searchTerm) || type.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Filter transactions
function filterTransactions() {
    const typeFilter = document.getElementById('adminTypeFilter').value;
    const statusFilter = document.getElementById('adminStatusFilter').value;
    const dateFilter = document.getElementById('adminDateFilter').value;
    const userFilter = document.getElementById('adminUserFilter').value;
    
    const rows = document.querySelectorAll('#adminTransactionsTable tr[data-id]');
    const now = new Date();
    
    rows.forEach(row => {
        const type = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        const status = row.querySelector('td:nth-child(6) span').textContent.toLowerCase();
        const dateText = row.querySelector('td:nth-child(2)').textContent;
        const date = new Date(dateText);
        const user = row.querySelector('td:nth-child(3)').textContent;
        
        let typeMatch = typeFilter === 'all' || type === typeFilter.toLowerCase();
        let statusMatch = statusFilter === 'all' || status === statusFilter.toLowerCase();
        let userMatch = userFilter === 'all' || user === userFilter;
        
        let dateMatch = true;
        if (dateFilter === 'today') {
            dateMatch = date.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateMatch = date >= weekAgo;
        } else if (dateFilter === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateMatch = date >= monthAgo;
        }
        
        if (typeMatch && statusMatch && dateMatch && userMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Show transaction details
function showTransactionDetails(txnId) {
    // In a real app, you would fetch transaction details from API
    const txnDetails = {
        id: txnId,
        date: new Date().toLocaleString(),
        user: 'john.doe@example.com',
        type: 'Withdrawal',
        amount: 1250.00,
        status: 'Pending',
        method: 'Bank Transfer',
        details: 'Account ending in 1234',
        fee: 12.50,
        netAmount: 1237.50
    };

    const detailsContent = document.getElementById('transactionDetailsContent');
    detailsContent.innerHTML = `
        <div class="transaction-details">
            <div class="detail-row">
                <span class="detail-label">Transaction ID:</span>
                <span class="detail-value">${txnDetails.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${txnDetails.date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">User:</span>
                <span class="detail-value">${txnDetails.user}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Type:</span>
                <span class="detail-value">${txnDetails.type}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Amount:</span>
                <span class="detail-value">${txnDetails.amount}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">${txnDetails.status}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Method:</span>
                <span class="detail-value">${txnDetails.method}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Details:</span>
                <span class="detail-value">${txnDetails.details}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Fee:</span>
                <span class="detail-value">${txnDetails.fee}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Net Amount:</span>
                <span class="detail-value">${txnDetails.netAmount}</span>
            </div>
        </div>
    `;

    const detailsModal = document.getElementById('transactionDetailsModal');
    detailsModal.style.display = 'block';
}