class HistoryModel {
    id: number;
    userEmail: string;
    checkoutDate: string;
    returnedDate: string;
    title: string;
    author: string
    img: string;
    description: string;

    constructor(id: number, userEmail: string, checkoutDate: string,
        returnedDate: string, title: string, author: string, img: string, description: string) {
        this.id = id;
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnedDate;
        this.title = title;
        this.author = author;
        this.img = img;
        this.description = description;
    }
}

export default HistoryModel;