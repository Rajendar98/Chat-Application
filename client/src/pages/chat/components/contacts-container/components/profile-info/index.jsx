import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppStore } from "@/store"
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from 'react-icons/io5'
import { getColor } from "@/lib/utils";


const ProfileInfo = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();
    const logout = async () => {
        try {
            const response = await fetch('http://localhost:1021/api/auth/logout', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}), // Ensure the body is correct
                credentials: "include",
            });
            if (response.status === 200) {
                setUserInfo(null);
                navigate("/auth");
            }

        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred during signup.");
        }
    }
    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
            <div className="flex gap-3 items-center justify-center">
                <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                        {userInfo.image ? (
                            <AvatarImage src={`http://localhost:1021/${userInfo.image}`} alt="profile" className="object-cover w-full h-full bg-black" />
                        ) : (
                            <div className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                                {userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift()}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {userInfo.firstname && userInfo.lastName ? `${userInfo.firstname} ${userInfo.lastName}` : ""}
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className="text-purple-500 text-xl font-medium"
                                onClick={() => navigate("/profile")} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            Edit profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className="text-red-500 text-xl font-medium"
                                onClick={logout} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default ProfileInfo