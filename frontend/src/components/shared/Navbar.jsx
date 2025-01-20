import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="bg-gray-100">
            <div className="flex items-center justify-between h-16 px-4 mx-auto w-100 sm:px-6 lg:px-8">
                {/* Logo */}
                <div>
                    <Link to={"/"}>
                    <h1 className="text-xl font-bold sm:text-2xl">
                        Hire<span className="text-[#F83002]">Point</span>
                    </h1>
                    </Link>
                </div>

                {/* Hamburger Icon for Small Devices */}
                <div className='flex items-center justify-center gap-3'>
                <div className="sm:hidden">
                    <button onClick={toggleMobileMenu} className="p-2 text-gray-600">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                  
                {/* Links for Desktop */}
                
                <ul className="hidden gap-5 font-medium sm:flex">
                    {user && user.role === 'recruiter' ? (
                        <>
                            <li>
                                <Link to="/admin/companies">Companies</Link>
                            </li>
                            <li>
                                <Link to="/admin/jobs">Jobs</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/jobs">Jobs</Link>
                            </li>
                            <li>
                                <Link to="/browse">Browse</Link>
                            </li>
                        </>
                    )}
                </ul>

                {/* Auth Buttons */}
                {!user ? (
                    <div className="items-center hidden gap-2 sm:flex">
                        <Link to="/login">
                            <Button variant="outline" className="text-sm sm:text-base">
                                Login
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-sm sm:text-base">
                                Signup
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Avatar className="hidden cursor-pointer sm:block">
                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 sm:w-80">
                            <div>
                                <div className="flex gap-2 space-y-2">
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                    </Avatar>
                                    <div>
                                        <h4 className="font-medium">{user?.fullname}</h4>
                                        <p className="text-sm text-muted-foreground">{user?.profile?.bio}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col my-2 text-gray-600">
                                    {user && user.role === 'student' && (
                                        <div className="flex items-center gap-2 cursor-pointer w-fit">
                                            <User2 />
                                            <Button variant="link">
                                                <Link to="/profile">View Profile</Link>
                                            </Button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 cursor-pointer w-fit">
                                        
                                        <Button onClick={logoutHandler} variant="link">
                                        <LogOut />&nbsp; Logout
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="flex flex-col items-center py-4 sm:hidden bg-gray-50">
                    <ul className="flex flex-col gap-3 text-center">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li>
                                    <Link to="/admin/companies">Companies</Link>
                                </li>
                                <li>
                                    <Link to="/admin/jobs">Jobs</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/jobs">Jobs</Link>
                                </li>
                                <li>
                                    <Link to="/browse">Browse</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Mobile Auth Buttons */}
                    {!user ? (
                        <div className="flex flex-col items-center gap-2 mt-4">
                            <Link to="/login">
                                <Button variant="outline" className="w-full">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 mt-4">
                            {user && user.role === 'student' && (
                                <div className="flex items-center gap-2 w-fit">
                                    <User2 />
                                    <Button variant="link">
                                        <Link to="/profile">View Profile</Link>
                                    </Button>
                                </div>
                            )}
                            <div className="flex items-center gap-2 w-fit">
                              
                                <Button onClick={logoutHandler} variant="link">
                                <LogOut />&nbsp; Logout
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;
