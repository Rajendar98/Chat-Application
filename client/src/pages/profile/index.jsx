import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


function Profile() {
    const navigate = useNavigate();
    const { userInfo ,setUserInfo } = useAppStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);
    const fileinputref = useRef(null);

    useEffect(()=>{
        if(userInfo.profileSetup){
            setFirstName(userInfo.firstname);
            setLastName(userInfo.lastName);
            setSelectedColor(userInfo.color);
        }
        console.log(userInfo.image); 
        if (userInfo.image) {
            const imageUrl = `http://localhost:1021/${userInfo.image}`;
            console.log("Image URL:", imageUrl);
            setImage(imageUrl);
        }
    },[userInfo])
    const validateProfile=()=>{
        if(!firstName){
            toast.error("FirstName is required");
            return false;
        }
        if(!lastName){
            toast.error("LastName is required");
            return false;
        }
        return true;
    }
    const handleNavigate = ()=>{
        if(userInfo.profileSetup){
            navigate('/chat');
        }else{
            toast.error("Please setup profile.")
        }
    }
    const handlefileInputClick = ()=>{
        fileinputref.current.click();
    }
    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("profile-image", file); 
    
            const response = await fetch('http://localhost:1021/api/auth/add-profile-image', {
                method: "POST",
                body: formData,
                credentials: "include",
            });
    
            const data = await response.json();
            if (response.ok && data.image) {
                setUserInfo({ ...userInfo, image: data.image });
                toast.success("Image Updated Successfully!!");
            } else {
                toast.error(data.message || "Image update failed.");
            }
        }
    };

    const handleDeleteImage = async () => {
        try {
            const response = await fetch('http://localhost:1021/api/auth/remove-profile-image', {
                method: "DELETE",
                credentials: "include",
            });
    
            // const data = await response.json();
            // console.log(data); 
            if(response.status===200){
                setUserInfo({...userInfo,image:null});
                toast.success("Image removed successfully");
                setImage(null);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while deleting the image.");
        }
    };
    

    const saveChanges = async () => {
        if (validateProfile()) {
            try {
                const response = await fetch('http://localhost:1021/api/auth/update-profile', {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ firstName,lastName,color:selectedColor }), // Ensure the body is correct
                    credentials: "include",
                });
                const data = await response.json(); // Parse JSON data
                console.log(data);
                if (response.ok) {
                    if(response.status === 200){
                        setUserInfo(data);
                        toast.success("Profile Updated successful!");
                        navigate("/chat");
                    }
                    
                } else {
                    toast.error(data.message || "Updated failed.");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An error occurred during signup.");
            }
        }
    };

    return (
        <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
            <div className="flex flex-col gap-10 w-[80vw] md:w-max">
                <div onClick={handleNavigate}>
                    <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
                </div>
                <div className="grid grid-cols-2">
                    <div className="h-full w-32 md:w-48 relative flex items-center justify-center"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                            {image ? (
                                <AvatarImage src={image} alt="profile" className="object-cover w-full h-full bg-black" />
                            ) : (
                                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                                    {firstName ? firstName.split("").shift() : userInfo.email.split("").shift()}
                                </div>
                            )}
                        </Avatar>
                        {
                            hovered && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer"
                                 onClick={image ? handleDeleteImage : handlefileInputClick}>
                                    {image ? <FaTrash className="text-white text-3xl cursor-pointer" /> : <FaPlus className="text-white text-3xl cursor-pointer" />}
                                </div>
                            )
                        }
                        <input type="file" ref={fileinputref} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .svg, .webp"/>
                    </div>
                    <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center ">
                        <div className="w-full">
                            <Input placeholder="Email" type="email" disabled value={userInfo.email} className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
                        </div>
                        <div className="w-full">
                            <Input placeholder="FirstName" type="text" onChange={e=>setFirstName(e.target.value)}  value={firstName} className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
                        </div>
                        <div className="w-full">
                            <Input placeholder="LastName" type="text" onChange={e=>setLastName(e.target.value)} value={lastName} className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
                        </div>
                        <div className="w-full flex gap-5">
                            {colors.map((color,index)=>
                                <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                                ${
                                    selectedColor===index?"outline outline-white/50 outline-1":""
                                }`} key={index}
                                onClick={()=>setSelectedColor(index)}
                                ></div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
