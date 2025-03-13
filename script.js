document.addEventListener("DOMContentLoaded", () => {
    loadCurrencies();
});

// Load available currencies from API
function loadCurrencies() {
    fetch("https://api.frankfurter.app/currencies")
        .then(response => response.json())
        .then(data => {
            let baseSelect = document.getElementById("base-currency");
            let targetSelect = document.getElementById("target-currency");

            Object.keys(data).forEach(currency => {
                baseSelect.innerHTML += `<option value="${currency}">${currency}</option>`;
                targetSelect.innerHTML += `<option value="${currency}">${currency}</option>`;
            });
        });
}

// Convert currency
function convertCurrency() {
    let base = document.getElementById("base-currency").value;
    let target = document.getElementById("target-currency").value;
    let amount = document.getElementById("amount").value;

    if (base === target) {
        alert("Base and target currencies cannot be the same.");
        return;
    }

    fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${base}&to=${target}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("result").textContent = data.rates[target] + " " + target;
        });
}

// Fetch historical exchange rates
function fetchHistoricalData() {
    let base = document.getElementById("base-currency").value;
    let target = document.getElementById("target-currency").value;
    let startDate = document.getElementById("start-date").value;
    let endDate = document.getElementById("end-date").value;

    fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${target}`)
        .then(response => response.json())
        .then(data => {
            let historyTable = document.getElementById("history-table").getElementsByTagName('tbody')[0];
            historyTable.innerHTML = "";

            Object.entries(data.rates).forEach(([date, rates]) => {
                let row = historyTable.insertRow();
                row.insertCell(0).textContent = date;
                row.insertCell(1).textContent = rates[target];
            });

            drawChart(data.rates, target);
        });
}

// Draw bar chart using Chart.js
function drawChart(data, currency) {
    let labels = Object.keys(data);
    let values = labels.map(date => data[date][currency]);

    let ctx = document.getElementById("exchangeRateChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: `Exchange Rate (${currency})`,
                data: values,
                backgroundColor: "blue",
            }]
        }
    });
}
