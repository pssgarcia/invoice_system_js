import Product from "./products.js";
import User from "./user.js";

let productList = new Map();
let user = null;
let pid = 1000;

$("form").eq(1).children().prop("disabled",true);
let closeEdit = ()=>{
    $("#editModal").hide();
};
let loadTable = ()=>{
    $.getJSON("http://127.0.0.1:5502/data/products.json",(result)=>{
    result.forEach((productObj)=>{
        let tr = $("<tr class='table-primary'></tr>");
        for(let key in productObj){ 
            let td = $("<td></td>");
            td.text(productObj[key]);    
            tr.append(td);
        }
        let addBt = $("<button class='btn btn-outline-primary'>Buy</button>");
        addBt.click(()=>buyHandler(productObj));
        let td = $("<td></td>");
        td.append(addBt);
        tr.append(td);
        $("#product tbody").append(tr);
    })
})
}

let buyHandler = (pObj) =>{
    if(productList.has(pObj.id)){
        let pro = productList.get(pObj.id);
        pro.amount = ++pro.amount;
    }else{
        let pro = new Product(pObj.id,pObj.item_name,pObj.price);
        productList.set(pObj.id,pro);
    }
    tablePoper();
}
let save = ()=>{
    let inputBoxes = $("#editModal .modal-body").children();
    let pid = parseInt(inputBoxes.eq(0).text());
    let selectedProduct = productList.get(pid);
    selectedProduct.pname = inputBoxes.eq(1).val();
    selectedProduct.price = inputBoxes.eq(2).val();
    selectedProduct.amount = inputBoxes.eq(3).val();
    tablePoper();
    closeEdit();
};
let saveInvoice = ()=>{
    if(productList.size==0){
        alert("No information to save!");
    }else{
        let productArray = new Array();
        for(let pro of productList.values()){
            productArray.push(pro.toJson());
        }
        user.saveInfo(productArray);
        reset();
    }
}
let reset = ()=>{
    $('form input').val("");
    productList.clear();
    tablePoper();
    user = null;
    $("form").children().prop("disabled",true);
    $("form").eq(0).find("input").prop("disabled",false);
    $("form").eq(0).find("button").eq(0).prop("disabled",false);
    $("#product tbody").empty();
}
$('#editModal .close').click(closeEdit);
$('#editModal .modal-footer').children().eq(1).click(closeEdit);
$('#editModal .modal-footer').children().eq(0).click(save);
$('form').eq(0).find("button").eq(1).click(saveInvoice);

$('form').eq(0).find("input").eq(0).change((e)=>{
    let details = localStorage.getItem($(e.target).val());

    if(details!=null){ 
        details = JSON.parse(details);
        user = new User(details.uid,details.uname);
        for(let item of details.pList){
            let product = new Product(item.pid,item.pname,item.price,item.amount);
            productList.set(item.pid,product);
        }
        $(e.target).next().val(details.uname);
    }
})
$('form').eq(0).submit((e)=>{
    e.preventDefault();
    loadTable();
    if(user!=null){
        tablePoper();
        // customersObj();
    }else{
        let children = $(e.target).children();
        let uid = children.eq(0).val();
        let uname = children.eq(1).val();
        user = new User(uid,uname);
    }
    $(e.target).children().prop("disabled",true);
    $(e.target).find("button").eq(1).prop("disabled",false);
    $('form').eq(1).children().prop("disabled",false);
})
$('form').eq(1).submit((e)=>{
    e.preventDefault();
    let children = $(e.target).children();
    let pname = children.eq(0).val();
    let price = children.eq(1).val();
    let amount = children.eq(2).val();
    pid += productList.size;
    $(e.target).find("input").val("");
    let newProduct = new Product(pid,pname,price,amount);
    productList.set(pid,newProduct);
    tablePoper();
});

let tablePoper = ()=>{
    $("#invoice tbody").empty();
    let sum = 0;
    for(let pro of productList.values()){
        let tr = pro.toTr();
        let td = $("<td></td>");
        let editBtn = $("<button class='btn btn-outline-success'>Edit</button>");
        editBtn.click(()=>edit(pro.pid));
        let deleteBtn = $("<button class='btn btn-outline-danger'>Delete</button>");
        deleteBtn.click(()=>deleteHandler(pro.pid));
        td.append(editBtn,deleteBtn);
        tr.append(td);
        $("#invoice tbody").append(tr);
        sum += pro.total();
    }
    $("#invoice tfoot tr").children().eq(1).text((sum).toFixed(2));
}
let deleteHandler = (pid)=>{
    productList.delete(pid);
    tablePoper();   
}
let edit = (pid)=>{
    let inputBoxes = $("#editModal .modal-body").children();
    let selectedPro = productList.get(pid);
    inputBoxes.eq(0).text(selectedPro.pid);
    inputBoxes.eq(1).val(selectedPro.pname);
    inputBoxes.eq(2).val(selectedPro.price);
    inputBoxes.eq(3).val(selectedPro.amount);
    $("#editModal").show();
}