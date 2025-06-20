// Initialize Market Chart
function initMarketChart() {
    const ctx = document.getElementById('marketChart').getContext('2d');
    
    // Simulated market data
    const labels = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
        labels.push(time.getHours() + ':00');
    }
    
    const data = [];
    let currentValue = 50000;
    for (let i = 0; i < 24; i++) {
        // Random fluctuation
        const change = (Math.random() - 0.5) * 1000;
        currentValue += change;
        data.push(currentValue);
    }
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'BTC/USD',
                data: data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return 'BTC/USD: $' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
    
    // Simulate real-time updates
    setInterval(() => {
        const lastValue = data[data.length - 1];
        const change = (Math.random() - 0.5) * 100;
        const newValue = lastValue + change;
        
        // Remove first element and add new one
        data.shift();
        data.push(newValue);
        
        // Update chart
        chart.update();
    }, 5000);
}

// Time filter buttons
document.querySelectorAll('.time-filter').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.time-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // In a real app, this would fetch new data for the selected time period
    });
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMarketChart);