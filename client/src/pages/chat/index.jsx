import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container";
import EmptyChatConatiner from "./components/empty-chat-container";
import ContactsContainer from "./components/contacts-container";

function Chat() {
    const {userInfo, selectedChatType} = useAppStore();
    const navigate = useNavigate();
    useEffect(()=>{
        if(!userInfo.profileSetup){
            toast('Please setup profile to continue..');
            navigate('/profile');
        }
    } ,[userInfo,navigator]);
    return (
        <div className="flex h-[100vh] text-white ">
            <ContactsContainer/>
            {
                selectedChatType === undefined?<EmptyChatConatiner/>:<ChatContainer/>
            }
            {/* <EmptyChatConatiner/>
            <ChatContainer/> */}
        </div>
    )
}
export default Chat;