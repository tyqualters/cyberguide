import React from 'react';
import NavBar from "@/app/components/navbar";

type HeaderProps = {
    children?: React.ReactNode;
    className?: string
};

export default async function Header({ children, className }: HeaderProps) {
    return (
        <header className={`flex flex-col items-center justify-center ${className}`}>
            <NavBar />
            {children}
        </header>
    )
}