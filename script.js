function generateInputs() {
    let warehouses = parseInt(document.getElementById("warehouses").value);
    let cities = parseInt(document.getElementById("cities").value);

    let dynamicInputs = document.getElementById("dynamic-inputs");
    dynamicInputs.innerHTML = "";

    // Warehouse capacities
    dynamicInputs.innerHTML += "<h3>Warehouse Capacities</h3>";
    for (let i = 0; i < warehouses; i++) {
        dynamicInputs.innerHTML += `<label>Warehouse ${i+1} Capacity:</label>
            <input type="number" name="supply" required>`;
    }

    // City demands
    dynamicInputs.innerHTML += "<h3>City Demands</h3>";
    for (let j = 0; j < cities; j++) {
        dynamicInputs.innerHTML += `<label>City ${j+1} Demand:</label>
            <input type="number" name="demand" required>`;
    }

    // Cost matrix table
    let costHTML = "<h3>Cost Matrix</h3><table><tr><th>From / To</th>";
    for (let j = 0; j < cities; j++) {
        costHTML += `<th>City ${j+1}</th>`;
    }
    costHTML += "</tr>";

    for (let i = 0; i < warehouses; i++) {
        costHTML += `<tr><th>Warehouse ${i+1}</th>`;
        for (let j = 0; j < cities; j++) {
            costHTML += `<td><input type="number" class="cost-input" name="cost" required></td>`;
        }
        costHTML += "</tr>";
    }
    costHTML += "</table>";

    document.getElementById("cost-matrix-section").innerHTML = costHTML;
    document.getElementById("data-form").style.display = "block";
}

// Least Cost Method Solver
function solveTransportation(warehouses, cities, supply, demand, costMatrix) {
    let supplyLeft = supply.slice();
    let demandLeft = demand.slice();
    let allocation = Array.from({ length: warehouses }, () => Array(cities).fill(0));
    let totalCost = 0;

    while (true) {
        let minCost = Infinity, minI = -1, minJ = -1;
        for (let i = 0; i < warehouses; i++) {
            for (let j = 0; j < cities; j++) {
                if (supplyLeft[i] > 0 && demandLeft[j] > 0 && costMatrix[i][j] < minCost) {
                    minCost = costMatrix[i][j];
                    minI = i;
                    minJ = j;
                }
            }
        }
        if (minI === -1) break;

        let qty = Math.min(supplyLeft[minI], demandLeft[minJ]);
        allocation[minI][minJ] = qty;
        supplyLeft[minI] -= qty;
        demandLeft[minJ] -= qty;
        totalCost += qty * minCost;
    }

    return { allocation, totalCost };
}

function solve() {
    let warehouses = parseInt(document.getElementById("warehouses").value);
    let cities = parseInt(document.getElementById("cities").value);

    let inputs = document.querySelectorAll("#dynamic-inputs input");
    let supply = Array.from(inputs).slice(0, warehouses).map(i => parseInt(i.value));
    let demand = Array.from(inputs).slice(warehouses, warehouses + cities).map(i => parseInt(i.value));

    let costMatrix = [];
    let costInputs = document.querySelectorAll("#cost-matrix-section input");
    for (let i = 0; i < warehouses; i++) {
        let row = [];
        for (let j = 0; j < cities; j++) {
            row.push(parseInt(costInputs[i * cities + j].value));
        }
        costMatrix.push(row);
    }

    let result = solveTransportation(warehouses, cities, supply, demand, costMatrix);

    let outputTable = "<table><tr><th>From / To</th>";
    for (let j = 0; j < cities; j++) outputTable += `<th>City ${j+1}</th>`;
    outputTable += "</tr>";

    for (let i = 0; i < warehouses; i++) {
        outputTable += `<tr><th>Warehouse ${i+1}</th>`;
        for (let j = 0; j < cities; j++) {
            outputTable += `<td>${result.allocation[i][j]}</td>`;
        }
        outputTable += "</tr>";
    }
    outputTable += "</table>";

    document.getElementById("allocation").innerHTML = outputTable;
    document.getElementById("totalCost").textContent = "Minimum Total Transportation Cost: ₹" + result.totalCost;
    document.getElementById("output").style.display = "block";
}
