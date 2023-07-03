class Product{
    #pid;
    #pname;
    #price;
    #amount;
    constructor(pid,pname,price,amount=1){
        this.#pid = pid;
        this.#pname = pname;
        this.#price = parseFloat(price);
        this.#amount = parseInt(amount);
    }
    total(){
        return parseFloat((this.#price * this.#amount).toFixed(2));
    }
    #toArray(){
        return [this.#pid,this.#pname,this.#price,this.#amount,this.total()];
    }
    toJson(){
        let pDetails = {
            pid:this.#pid,
            pname:this.#pname,
            price:this.#price,
            amount:this.#amount
        }
        return pDetails;
    }
    toTr(){
        let tr = $("<tr class='table-success'></tr>");
        for(let detail of this.#toArray()){
            let td = $("<td></td>");
            td.append(detail);
            tr.append(td);
        }
        return tr;
    }
    get pid(){
        return this.#pid;
    }
    get pname(){
        return this.#pname;
    }
    set pname(newName){
        if(newName==""){
            alert("Product name should have a value.");
        }else{
            this.#pname = newName;
        }
    }
    get price(){
        return this.#price;
    }
    set price(newPrice){
        if(newPrice==""){
            alert("Product price should have a value.");
        }else{
            this.#price = parseFloat(newPrice);
        }
    }
    get amount(){
        return this.#amount;
    }
    set amount(newAmount){
        if(newAmount==""){
            alert("Product amount should have a value.");
        }else{
            this.#amount = parseInt(newAmount);
        }
    }
}
export default Product;