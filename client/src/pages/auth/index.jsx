import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Background from "../../assets/login2.png";
import victory from "../../assets/victory.svg";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

function Auth() {
    const navigate = useNavigate();
    const { userInfo ,setUserInfo } = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validatelogin = () => {
        if (!email.length) {
            toast.error("Email is Required.");
            return false;
        }
        if (!password.length) {
            toast.error("Password is Required.");
            return false;
        }
        return true;
    }

    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is Required.");
            return false;
        }
        if (!password.length) {
            toast.error("Password is Required.");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password should be the same.");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (validatelogin()) {
            try {
                const response = await fetch('http://localhost:1021/api/auth/login', { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: "include",
                });
    
                const data = await response.json(); 
                console.log(data);
    
                if (response.ok) {
                    setUserInfo(data.user);
                    toast.success("Login successful!");

                    if (data.user &&data.user.profileSetup ) {
                            navigate("/chat");
                        } else {
                            navigate("/profile");
                        }
                } else {
                    toast.error(data.message || "Login failed."); 
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An error occurred during login.");
            }
        }
    };
    


    const handleSignup = async () => {
        if (validateSignup()) {
            try {
                const response = await fetch('http://localhost:1021/api/auth/signup', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: "include",
                });
                const data = await response.json(); 
                console.log(data);
    
                if (response.status === 201) {
                    setUserInfo(data.user); 
                    toast.success("Signup successful!");
                    navigate("/profile");
                } else {
                    toast.error(data.message || "Signup failed.");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An error occurred during signup.");
            }
        }
    };
    

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center">
            <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                            <img src={victory} alt="Victory Emoji" className="h-[100px]" />
                        </div>
                        <p className="font-medium text-center">
                            Fill in the Details to get started with the best Chat App
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4" defaultValue="login">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Login</TabsTrigger>
                                <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Signup</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-5" value="login">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-3"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-3"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-5" value="signup">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-3"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-3"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Input
                                    placeholder="Confirm Password"
                                    type="password"
                                    className="rounded-full p-3"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <Button className="rounded-full p-6" onClick={handleSignup}>Signup</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex justify-center items-center">
                    <img src={Background} alt="Background login" className="w-[300px]" />
                </div>
            </div>
        </div>
    );
}

export default Auth; // Updated to use a capitalized component name