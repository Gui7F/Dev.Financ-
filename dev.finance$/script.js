
var modal={ 
        open(){
           //Abrir o modal para isso tenho que 
           //add a class active ao var modal em js
           document.querySelector('.modal-overlay')
           .classList.add('active')
        
    },
        close(){
          //Fechar o modal para isso tenho que remover 
          // a class active do var modal em js 
          document.querySelector('.modal-overlay')
          .classList.remove('active')
    } 
}
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finance:transactions")) ||
        []

    },

    set(transaction){
        localStorage.setItem("dev.finance:transactions",JSON.stringify(transactions))
    }
}


const Transaction =  {
    all: Storage.get()
    ,add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()

    },
    incomes(){
        let income = 0;
        //pegar todas as transações
        //para cada trasação, 
        Transaction.all.forEach( transactions => {
        //se ela for maior que zero
        if(transactions.amount > 0){
        //somar a uma variavel e retornar a variavel
        income = income+ transactions.amount;
        }
        })
        return income;
    },
    expenses(){
        let expense = 0;
        //pegar todas as transações
        //para cada trasação, 
        Transaction.all.forEach( transactions => {
        //se ela for menor que zero
        if(transactions.amount < 0){
        //somar a uma variavel e retornar a variavel
        expense = expense+ transactions.amount;
        }
        })
        return expense;
    },
    total(){
        return Transaction.incomes() + Transaction.expenses(); 
        
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction , index)
        tr.dataset.index=index
        
        DOM.transactionsContainer.appendChild(tr)

    },
    innerHTMLTransaction(transaction, index)
    {   const CSSclass=transaction.amount > 0 ? 'income' : 'expense'

        const amount= Utils.formatCurrency(transaction.amount)

        const html=` 
        <td class="description">${transaction.description}</td>
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
        <img onclick = 'Transaction.remove(${index})' src="./assets/minus.svg" alt="Remover Transação">
        </td>`

        return html
    },
    updateBalance(){
        document
          .getElementById('incomeDisplay')
          .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
          .getElementById('expenseDisplay')
          .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
          .getElementById('totalDisplay')
          .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ''
    }
}

const Utils= {
    formatAmount(value){
        value = Number(value)*100

        return value


    },  
    formatDate(date){
        const splittedDate = date.split("-")

        return `${splittedDate [2]}/${splittedDate[1]}/${splittedDate [0]}`

       
        

    },  
    formatCurrency(value){
        const signal = Number(value) < 0 ? '-': '' 

        value = String (value).replace(/\D/g, "")

        value = Number (value) / 100

        value = value.toLocaleString("pt-BR",{
            style: 'currency',
            currency: 'BRL'
        })



        return signal+value 

    }
}

const Form ={
    description:document.querySelector('input#description'),
    amount:document.querySelector('input#amount'),
    date:document.querySelector('input#date'),
    

    getValues(){
        return{
        description: Form.description.value,
        amount: Form.amount.value,
        date: Form.date.value
    }


    },


    validateField(){
        const {description,amount,date}= Form.getValues()

        if( description.trim()=== "" || 
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Por Favor, preencha todos os campos.")
            }

        
    },
    formatValues(){

        let {description,amount,date}= Form.getValues()
        amount = Utils.formatAmount(amount),
        date = Utils.formatDate (date)

        return {
            description,
            amount,
            date
        }
    },

    saveTransation(transaction){
        Transaction.add(transaction)
    },

    clearFields(){
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },



    submit(event){
        event.preventDefault()

        try {
        //verificar se todas as informações foram preenchidas
        //formatar os dados para salvar 
        const transaction = Form.formatValues()
        //salvar
         Form.saveTransation(transaction)
        //apagar os dados do formulario
        Form.clearFields()
        //modal feche
        modal.close()
        //atualizar a aplicação 



        } 
        
        catch (error){
            alert(error.message)

        }


       
    
    }
}


const App = {
    init(){
        Transaction.all.forEach(function (transaction , index){
            DOM.addTransaction(transaction , index)
        })
        
        DOM.updateBalance()

        Storage.set(transaction.all)


    },

    reload(){
        DOM.clearTransactions()
        App.init()

    },
}

App.init()



