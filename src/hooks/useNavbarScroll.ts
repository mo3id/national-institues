import { useState, useEffect } from 'react';

export const useNavbarScroll = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isPastHero, setIsPastHero] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 50);
            setIsPastHero(scrollY > window.innerHeight - 150);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { scrolled, isPastHero };
};
