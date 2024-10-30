import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react"
import { FaPlus } from "react-icons/fa"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";


function NewDM() {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [OpenNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setsearchedContacts] = useState([]);
    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await fetch('http://localhost:1021/api/contacts/search', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ searchTerm }), // Wrap searchTerm in an object
                    credentials: "include"
                });

                const data = await response.json();
                if (response.status === 200 && data.contacts) {
                    setsearchedContacts(data.contacts);
                } else {
                    setsearchedContacts([]);
                }
            }
            else {
                setsearchedContacts([]); // Clear contacts when search term is empty
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setsearchedContacts([]);
    }
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all"
                            onClick={() => setOpenNewContactModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent
                        className="bg-[#1c1b1e] border-none md-2 p-3 text-white"
                    >
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={OpenNewContactModal} onOpenChange={setOpenNewContactModal}>

                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please Select a contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Search Contacts" className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => { searchContacts(e.target.value) }}
                        />
                    </div>
                    {
                        searchedContacts.length > 0 && (
                            <ScrollArea className="h-[250px]">
                                <div className="flex flex-col gap-5">
                                    {
                                        searchedContacts.map((contacts) => (
                                            <div key={contacts._id} className="flex gap-3 items-center cursor-pointer"
                                                onClick={() => selectNewContact(contacts)}>
                                                <div className="w-12 h-12 relative">
                                                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                                        {contacts.image ? (
                                                            <AvatarImage src={`http://localhost:1021/${contacts.image}`} alt="profile" className="object-cover w-full h-full bg-black" />
                                                        ) : (
                                                            <div className={`uppercase md:h-48 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contacts.selectedColor)}`}>
                                                                {contacts.firstName ? contacts.firstName[0] : contacts.email[0]}
                                                            </div>
                                                        )}
                                                    </Avatar>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>
                                                        {contacts.firstname && contacts.lastName ? `${contacts.firstname} ${contacts.lastName}` : contacts.email}
                                                    </span>
                                                    <span className="text-xs">{contacts.email}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </ScrollArea>
                        )}

                    {searchedContacts.length <= 0 &&
                        <div>
                            <div className='flex-1 md:bg-[#181920] md:flex  mt-5 flex-col justify-center items-center duration-1000 transition-all'>
                                <Lottie
                                    isClickToPauseDisabled={true}
                                    height={100}
                                    width={100}
                                    options={animationDefaultOptions}
                                />
                                <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center '>
                                    <h3 className='poppins-medium'>
                                        Hi<span className='text-purple-500'>!</span> Search new
                                        <span className='text-purple-500'> Contact</span>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    }
                </DialogContent>
            </Dialog>


        </>
    )
}

export default NewDM