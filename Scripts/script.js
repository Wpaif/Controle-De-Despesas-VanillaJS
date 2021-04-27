const transactionUl = document.querySelector('#transactions')
const balance = document.querySelector('#balance')
const expensesDisplay = document.querySelector('#money-minus')
const revenueDisplay = document.querySelector('#money-plus')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'))
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
  transactions = transactions.filter(({id}) => id !== ID)
  updateLocalStorage()
  init()
}

const transactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? '-' : '+'
  const CSSClass = amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(amount)
  const li = document.createElement('li')

  li.classList.add(CSSClass)
  li.innerHTML =
    `${name} <span><strong>${operator}</strong> 
    R$${amountWithoutOperator}</span>
    <button class="delete-btn" onclick="removeTransaction(${id})")>
      x
    </button>`

  transactionUl.append(li)
}

const total = transactionsAmount =>
  transactionsAmount.reduce((acc, iten) => acc + iten, 0).toFixed(2)

const debts = transactionsAmount => transactionsAmount
  .filter(value => value < 0)
  .map(value => Math.abs(value))
  .reduce((acc, value) => acc + value, 0)
  .toFixed(2)

const profit = transactionsAmount => transactionsAmount
  .filter(value => value > 0)
  .reduce((acc, value) => acc + value, 0)
  .toFixed(2)

const updateBalanceValue = () => {
  const transactionsAmount = transactions.map(({ amount }) => amount)
  balance.textContent = `R$ ${total(transactionsAmount)}`
  expensesDisplay.textContent = `- R$ ${debts(transactionsAmount)}`
  revenueDisplay.textContent = `+ R$ ${profit(transactionsAmount)}`
}

const init = () => {
  transactionUl.innerHTML = ''
  updateBalanceValue()
  transactions.forEach((transaction) => transactionIntoDOM(transaction))

}

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = length => {
  if (!length)
    return 1
  return ++transactions.length
}

const addToTransationsArray = (transactionAmount, transactionName) => {
  const transaction = {
    id: generateID(transactions.length),
    name: transactionName,
    amount: Number(transactionAmount)
  }
  transactions.push(transaction)
}

const clearInputs = () => {
  inputTransactionAmount.value = ''
  inputTransactionName.value = ''
}

const handleFormSubmit = e => {
  e.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const isSomeInputEmpty = !transactionName || !transactionAmount

  if (isSomeInputEmpty) {
    alert('Por favor, preencha tanto o nome quanto o valor da transação.')
    return
  }
  addToTransationsArray(transactionAmount, transactionName)
  init()
  updateLocalStorage()
  clearInputs()
}

form.addEventListener('submit', handleFormSubmit)
addEventListener('DOMContentLoaded', init)

