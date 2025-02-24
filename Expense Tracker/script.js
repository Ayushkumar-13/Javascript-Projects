const balanceEl = document.getElementById("balance");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const typeEl = document.getElementById("type");
const addBtn = document.getElementById("add");
const resetBtn = document.getElementById("reset");
const transactionList = document.getElementById("transaction-list");
const historyContainer = document.getElementById("history-container");

let transactions = [];
let balance = 0; // Keeps track of balance and does NOT reset

function updateBalance(amount, type) {
    balance += type === "income" ? amount : -amount;
    balanceEl.textContent = `₹${balance}`; // Show updated balance
}

function renderTransactions() {
    transactionList.innerHTML = "";
    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.classList.add(transaction.type);
        li.innerHTML = `
            ${transaction.description} - ₹${transaction.amount}
            <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
        `;
        transactionList.appendChild(li);
    });
}

function addTransaction() {
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);
    const type = typeEl.value;

    if (!description || isNaN(amount) || amount <= 0) {
        alert("Please enter valid details");
        return;
    }

    transactions.push({ description, amount, type });

    updateBalance(amount, type);
    descriptionEl.value = "";
    amountEl.value = "";
    renderTransactions();
}

function deleteTransaction(index) {
    const removedTransaction = transactions[index];
    updateBalance(-removedTransaction.amount, removedTransaction.type);
    transactions.splice(index, 1);
    renderTransactions();
}

function storeToHistory() {
    if (transactions.length === 0) return;

    let day = prompt("Enter the day (e.g., Monday, Friday):").trim();
    if (!day) {
        alert("Day is required!");
        return;
    }

    const historyDiv = document.createElement("div");
    historyDiv.classList.add("history-section");
    historyDiv.innerHTML = `<h3>${day}</h3>`;

    const ul = document.createElement("ul");
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.classList.add(transaction.type);
        li.innerHTML = `
            ${transaction.description} - ₹${transaction.amount}
            <button class="edit-btn" onclick="editTransaction(${index}, this)">✏️</button>
        `;
        ul.appendChild(li);
        
        // Calculate Income & Expense separately
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    historyDiv.appendChild(ul);

    // Calculate balance for the reset section
    let sectionBalance = totalIncome - totalExpense;
    
    // Display total income, expense, and balance in history
    const balanceSummary = document.createElement("p");
    balanceSummary.innerHTML = `<strong>Income: ₹${totalIncome} | Expense: ₹${totalExpense} | Balance: ₹${sectionBalance}</strong>`;
    historyDiv.appendChild(balanceSummary);

    historyContainer.appendChild(historyDiv);

    transactions = [];
    transactionList.innerHTML = ""; // Clear main list but balance remains
}

function editTransaction(index, button) {
    let newDescription = prompt("Edit description:", transactions[index].description);
    let newAmount = parseFloat(prompt("Edit amount:", transactions[index].amount));

    if (!newDescription || isNaN(newAmount) || newAmount <= 0) {
        alert("Invalid input!");
        return;
    }

    // Update balance by reversing old value and adding new value
    updateBalance(-transactions[index].amount, transactions[index].type); // Subtract old value
    transactions[index].description = newDescription;
    transactions[index].amount = newAmount;
    updateBalance(newAmount, transactions[index].type); // Add new value

    // Update history display
    button.parentElement.innerHTML = `
        ${newDescription} - ₹${newAmount}
        <button class="edit-btn" onclick="editTransaction(${index}, this)">✏️</button>
    `;
}

function handleEnterKey(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        if (event.target === descriptionEl) {
            amountEl.focus();
        } else if (event.target === amountEl) {
            typeEl.focus();
        } else if (event.target === typeEl) {
            addTransaction();
        }
    }
}

descriptionEl.addEventListener("keydown", handleEnterKey);
amountEl.addEventListener("keydown", handleEnterKey);
typeEl.addEventListener("keydown", handleEnterKey);
addBtn.addEventListener("click", addTransaction);
resetBtn.addEventListener("click", storeToHistory);

renderTransactions();
