let chartInstance = null;

function formatCurrency(value) {
    return '₹ ' + value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculate() {
    const investmentFrequency = document.getElementById('investment-frequency').value;
    const investmentAmount = parseFloat(document.getElementById('sip-investment').value);
    const incrementPercentage = parseFloat(document.getElementById('sip-yearly-increment').value) / 100;
    const expectedReturn = parseFloat(document.getElementById('sip-expected-return').value) / 100;
    const timePeriod = parseFloat(document.getElementById('sip-time-period').value);

    if (isNaN(investmentAmount) || isNaN(incrementPercentage) || isNaN(expectedReturn) || isNaN(timePeriod) ||
        investmentAmount <= 0 || incrementPercentage < 0 || expectedReturn < 0 || timePeriod <= 0) {
        document.getElementById('sip-result').innerHTML = 'Please enter valid input values.';
        return;
    }

    const monthlyReturn = expectedReturn / 12;
    const totalMonths = timePeriod * 12;

    let totalInvestment = 0;
    let futureValue = 0;
    let investment = investmentAmount;

    const incrementMultiplier = 1 + incrementPercentage; // Default to yearly increments

    if (investmentFrequency === 'monthly') {
        for (let i = 0; i < totalMonths; i++) {
            totalInvestment += investment;
            futureValue += investment * Math.pow(1 + monthlyReturn, totalMonths - i);
            if ((i + 1) % 12 === 0) {
                investment *= incrementMultiplier; // Apply yearly increment
            }
        }
    } else if (investmentFrequency === 'yearly') {
        const yearlyReturn = expectedReturn;
        const totalYears = timePeriod;

        for (let i = 0; i < totalYears; i++) {
            totalInvestment += investment;
            futureValue += investment * Math.pow(1 + yearlyReturn, totalYears - i);
            investment *= incrementMultiplier; // Apply yearly increment
        }
    } else if (investmentFrequency === 'daily') {
        const dailyReturn = expectedReturn / 365;
        const totalDays = timePeriod * 365;

        for (let i = 0; i < totalDays; i++) {
            totalInvestment += investment;
            futureValue += investment * Math.pow(1 + dailyReturn, totalDays - i);
            if ((i + 1) % 365 === 0) {
                investment *= incrementMultiplier; // Apply yearly increment
            }
        }
    } else if (investmentFrequency === 'weekly') {
        const weeklyReturn = expectedReturn / 52;
        const totalWeeks = timePeriod * 52;

        for (let i = 0; i < totalWeeks; i++) {
            totalInvestment += investment;
            futureValue += investment * Math.pow(1 + weeklyReturn, totalWeeks - i);
            if ((i + 1) % 52 === 0) {
                investment *= incrementMultiplier; // Apply yearly increment
            }
        }
    } else if (investmentFrequency === 'quarterly') {
        const quarterlyReturn = expectedReturn / 4;
        const totalQuarters = timePeriod * 4;

        for (let i = 0; i < totalQuarters; i++) {
            totalInvestment += investment;
            futureValue += investment * Math.pow(1 + quarterlyReturn, totalQuarters - i);
            if ((i + 1) % 4 === 0) {
                investment *= incrementMultiplier; // Apply yearly increment
            }
        }
    }

    const totalReturn = futureValue - totalInvestment;

    document.getElementById('sip-result').innerHTML = `
        <div><strong>Amount Invested:</strong> ${formatCurrency(totalInvestment)}</div>
        <div><strong>Wealth Gain (ROI):</strong> ${formatCurrency(totalReturn)}</div>
        <div><strong>Maturity Amount:</strong> ${formatCurrency(totalInvestment + totalReturn)}</div>
    `;

    // Show result and chart
    document.querySelector('.result').style.display = 'block';
    document.querySelector('.chart-container').style.display = 'block';

    showPieChart(totalInvestment, totalReturn, totalInvestment + totalReturn);
}

function showPieChart(amountInvested, wealthGain, maturityAmount) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    // Destroy existing chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    // Create a new chart instance
    chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Amount Invested', 'Wealth Gain (ROI)'],
            datasets: [{
                data: [amountInvested, wealthGain],
                backgroundColor: ['#ff9800', '#4caf50'], // Orange, Green
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const label = tooltipItem.label || '';
                            const value = tooltipItem.raw;
                            return `${label}: ${formatCurrency(value)}`;
                        }
                    }
                },
                legend: {
                    display: true, // Display legend
                    position: 'top' // Position of the legend
                }
            }
        }
    });
}