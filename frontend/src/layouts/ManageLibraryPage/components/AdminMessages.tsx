import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminQuestionRequestModel from "../../../models/AdminQuestionRequestModel";

export const AdminMessages = () => {

    const { authState } = useOktaAuth();

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Messages state
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage, setMessagesPerPage] = useState(5);


    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    //Recall useEffect when currentPage changes
    const [btnSubmit, setBtnSubmit] = useState(false);



    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/messages/search/findByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if (!messagesResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const messagesResponseJson = await messagesResponse.json();

                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [authState, currentPage, btnSubmit]);

    async function submitResponseToQuestion(id: number, responsee: string) {
        const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;
        if (authState && authState.isAuthenticated && id !== null && responsee !== '') {
            const messageAdminRequestModel: AdminQuestionRequestModel = new AdminQuestionRequestModel(id, responsee);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel)
            };

            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            setBtnSubmit(!btnSubmit);
        }
    }

    if (isLoadingMessages) {
        return <SpinnerLoading />
    }

    if (httpError) {
        return <p className='alert alert-danger'>Error: {httpError}</p>
    }

    const paginate = (pageNumber: number) => { setCurrentPage(pageNumber); }

    return (
        <div className='mt-3'>
            {messages.length > 0 ? 
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion = {submitResponseToQuestion} />
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}