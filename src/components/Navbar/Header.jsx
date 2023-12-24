import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import DropDown from '../ui/DropDown/DropDown';
import './Header.css'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Avatar } from "@nextui-org/react";
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";
import { useSelector } from 'react-redux';

const Header = () => {
    const { user } = useSelector((state) => state.users);


    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const location = useLocation();

    // Access the pathname from the location object
    const pathname = location.pathname;

    const routes = [
        {
            href: `/`,
            label: 'Overview',
            active: pathname === '/',
        },
        {
            href: `/billboards`,
            label: 'Billboards',
            active: pathname.includes('billboards'),
        },
        // {
        //     href: `/categories`,
        //     label: 'Categories',
        //     active: pathname.includes('categories'),
        // },
        {
            href: `/products`,
            label: 'Products',
            active: pathname.includes('products'),
        },
        {
            href: `/orders`,
            label: 'Orders',
            active: pathname.includes('orders'),
        },
        {
            href: `/settings`,
            label: 'Settings',
            active: pathname.includes('settings'),
        },
    ]
    return (
        <>
            <header className="header ">
                <div className="header-content">
                    <Link to={'/'} className="hidden md:block">
                        <DropDown name={user?.username} />
                    </Link>
                    <div className="header-navigation">
                        <nav className="header-navigation-links">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    to={route.href}
                                    className={route.active ? 'active' : ''}
                                >
                                    {route.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <button onClick={() => onOpen()} className="font-sans font-semibold w-[150px] h-9 flex items-center justify-start gap-2.5 bg-[#000] text-[white] relative cursor-pointer duration-[0.2s] px-[15px] py-0 rounded-[10px] border-[none] hover:bg-[rgb(77,77,77)] hover:duration-[0.2s] text-[0.8rem] ">
                        <svg className="w-[13px]" viewBox="0 0 448 512"><path className='fill-purple-400' d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" /></svg>
                        Notifications
                        <div className="absolute w-[30px] h-full text-lg flex items-center justify-center right-0">›</div>
                    </button>

                    <Navbar
                        isMenuOpen={isMenuOpen}
                        onMenuOpenChange={setIsMenuOpen}
                        className="header-p sm:hidden w-[max-content] bg-[#fff]"
                    >
                        <NavbarContent className="sm:hidden" justify="start" >
                            <svg onClick={() => setIsMenuOpen(prv => !prv)} className="w-[40px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=fill"> <g id="menu-strawberry"> <path id="Subtract" fillRule="evenodd" clipRule="evenodd" d={`${!isMenuOpen ? ('M7.25 1.25C3.93629 1.25 1.25 3.93629 1.25 7.25V16.75C1.25 20.0637 3.93629 22.75 7.25 22.75H16.75C20.0637 22.75 22.75 20.0637 22.75 16.75V7.25C22.75 3.93629 20.0637 1.25 16.75 1.25H7.25ZM4.84615 7C4.51691 7 4.25 7.33579 4.25 7.75C4.25 8.16421 4.51691 8.5 4.84615 8.5H19.1538C19.4831 8.5 19.75 8.16421 19.75 7.75C19.75 7.33579 19.4831 7 19.1538 7H4.84615ZM6.25 12.25C6.25 11.8358 6.58579 11.5 7 11.5H17C17.4142 11.5 17.75 11.8358 17.75 12.25C17.75 12.6642 17.4142 13 17 13H7C6.58579 13 6.25 12.6642 6.25 12.25ZM9 16C8.58579 16 8.25 16.3358 8.25 16.75C8.25 17.1642 8.58579 17.5 9 17.5H15C15.4142 17.5 15.75 17.1642 15.75 16.75C15.75 16.3358 15.4142 16 15 16H9Z') : ('M1.25 7.25C1.25 3.93629 3.93629 1.25 7.25 1.25L16.75 1.25C20.0637 1.25 22.75 3.93629 22.75 7.25L22.75 16.75C22.75 20.0637 20.0637 22.75 16.75 22.75L7.25 22.75C3.93629 22.75 1.25 20.0637 1.25 16.75L1.25 7.25ZM7.18298 7.18298C7.42696 6.939 7.82253 6.939 8.06651 7.18298L12 11.1165L15.9335 7.18298C16.1775 6.939 16.573 6.93901 16.817 7.18299C17.061 7.42697 17.061 7.82254 16.817 8.06652L12.8835 12L16.817 15.9335C17.061 16.1775 17.061 16.573 16.817 16.817C16.573 17.061 16.1775 17.061 15.9335 16.817L12 12.8835L8.0665 16.817C7.82252 17.061 7.42695 17.061 7.18298 16.817C6.939 16.573 6.93901 16.1775 7.18299 15.9335L11.1165 12L7.18298 8.06651C6.93901 7.82253 6.93901 7.42696 7.18298 7.18298Z')}`} fill="#000000"></path> </g> </g> </g></svg>
                        </NavbarContent>
                        <NavbarMenu className='font-2 font-normal' >
                            <Link to={'/'} onClick={() => setIsMenuOpen(prv => !prv)}>
                                <Avatar size='lg' src={user?.avatar} />
                            </Link>
                            {routes.map((item, index) => (
                                <NavbarMenuItem key={`${item}-${index}`} className='mt-2'>
                                    <Link
                                        className={item.active ? 'active' : 'w-full text-[1.2rem] !text-[#8b8b8b]'}
                                        to={item.href}
                                        onClick={() => setIsMenuOpen(prv => !prv)}
                                    >
                                        {item.label}
                                    </Link>
                                </NavbarMenuItem>
                            ))}
                        </NavbarMenu>
                    </Navbar>
                    <Link to={'/settings'} className="avatar !hidden md:!flex">
                        <img src={user?.avatar}  alt="Profile" />
                    </Link>
                </div>
            </header>

            {/* Notification Model */}
            <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size={'3xl'}>
                <ModalContent >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Notification Area</ModalHeader>
                            <ModalBody>
                                <Card >
                                    <CardBody>
                                        <p>Make beautiful websites regardless of your design experience.</p>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <p>Make beautiful websites regardless of your design experience.</p>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <p>Make beautiful websites regardless of your design experience.</p>
                                    </CardBody>
                                </Card>
                            </ModalBody>
                            <ModalFooter>
                                <Button className='bg-[#000] text-[#fff]' onPress={onClose}>
                                    Read All
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default Header
