import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import DropDown from '../ui/DropDown/DropDown';
import './Navbar.css'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const location = useLocation();

    // Access the pathname from the location object
    const pathname = location.pathname;

    const routes = [
        {
            href: `/`,
            label: 'Overview',
            active: pathname === `/`,
        },
        {
            href: `/billboards`,
            label: 'Billboards',
            active: pathname.includes('billboards'),
        },
        {
            href: `/categories`,
            label: 'Categories',
            active: pathname.includes('categories'),
        },
        {
            href: `/sizes`,
            label: 'Sizes',
            active: pathname.includes('sizes'),
        },
        {
            href: `/colors`,
            label: 'Colors',
            active: pathname.includes('colors'),
        },
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
            <header className="header">
                <div className="header-content">
                    <Link to={'/'} className="hidden md:block">
                        <DropDown />
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

                    <a href="#" className="button menu !block md:!hidden">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <g id="style=fill"> <g id="menu-fries"> <path id="Subtract" fillRule="evenodd" clipRule="evenodd" d="M7.25 1.25C3.93629 1.25 1.25 3.93629 1.25 7.25V16.75C1.25 20.0637 3.93629 22.75 7.25 22.75H16.75C20.0637 22.75 22.75 20.0637 22.75 16.75V7.25C22.75 3.93629 20.0637 1.25 16.75 1.25H7.25ZM4.84615 7C4.51691 7 4.25 7.33579 4.25 7.75C4.25 8.16421 4.51691 8.5 4.84615 8.5H19.1538C19.4831 8.5 19.75 8.16421 19.75 7.75C19.75 7.33579 19.4831 7 19.1538 7H4.84615ZM4.25 16.75C4.25 16.3358 4.51691 16 4.84615 16H19.1538C19.4831 16 19.75 16.3358 19.75 16.75C19.75 17.1642 19.4831 17.5 19.1538 17.5H4.84615C4.51691 17.5 4.25 17.1642 4.25 16.75ZM10 11.5C9.58579 11.5 9.25 11.8358 9.25 12.25C9.25 12.6642 9.58579 13 10 13L19 13C19.4142 13 19.75 12.6642 19.75 12.25C19.75 11.8358 19.4142 11.5 19 11.5L10 11.5Z" fill="#000000" /> </g> </g> </g></svg>
                    </a>
                    <Link to={'/settings'} className="avatar !hidden md:!flex">
                        <img src="https://i.pinimg.com/564x/88/b6/a6/88b6a65764a0f68a478386e0cea26344.jpg" alt="Profile" />
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

export default Navbar
