import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import DropDown from '../ui/DropDown/DropDown';
import './Navbar.css'

const Navbar = () => {

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
            active: pathname === `/billboards`,
        },
        {
            href: `/categories`,
            label: 'Categories',
            active: pathname === `/categories`,
        },
        {
            href: `/sizes`,
            label: 'Sizes',
            active: pathname === `/sizes`,
        },
        {
            href: `/colors`,
            label: 'Colors',
            active: pathname === `/colors`,
        },
        {
            href: `/products`,
            label: 'Products',
            active: pathname === `/products`,
        },
        {
            href: `/orders`,
            label: 'Orders',
            active: pathname === `/orders`,
        },
        {
            href: `/settings`,
            label: 'Settings',
            active: pathname === `/settings`,
        },
    ]
    return (
        <>
            <header className="header">
                <div className="header-content">
                    <DropDown />
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
                    <a href="#" className="avatar">
                        <img src="https://i.pinimg.com/564x/88/b6/a6/88b6a65764a0f68a478386e0cea26344.jpg" alt="Profile" />
                    </a>
                    <a href="#" className="button menu">
                        <svg viewBox="0 0 1024 1024"  version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M981.3 170.7H320c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7h661.3c23.6 0 42.7 19.1 42.7 42.7s-19.1 42.7-42.7 42.7zM981.3 938.7H320c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7h661.3c23.6 0 42.7 19.1 42.7 42.7s-19.1 42.7-42.7 42.7zM981.3 554.7H320c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7h661.3c23.6 0 42.7 19.1 42.7 42.7s-19.1 42.7-42.7 42.7z" fill="#000" /><path d="M106.7 128m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#000" /><path d="M106.7 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#000" /><path d="M106.7 896m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#000" /></g></svg>
                    </a>
                </div>
            </header>


        </>
    )
}

export default Navbar
