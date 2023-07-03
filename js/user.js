class User {
    #userId;
    #userName;
    constructor(userId,userName){
        this.#userId = userId;
        this.#userName = userName;
    }
    saveInfo(products){
        let userDetails = {
            uid:this.#userId,
            uname:this.#userName,
            pList:products
        }
        localStorage.setItem(this.#userId,JSON.stringify(userDetails));
    }
    get userId() {
        return this.#userId;
    }
    set userId(newUserId) {
        this.#userId = newUserId;
    }

    get userName() {
        return this.#userName;
    }
    set userName(newUserName) {
        this.#userName = newUserName;
    }

}
export default User;