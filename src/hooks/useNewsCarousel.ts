import { useState, useEffect } from 'react';

export const useNewsCarousel = (totalItems: number) => {
    const [index, setIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setItemsPerPage(1);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else setItemsPerPage(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, totalItems - itemsPerPage);

    const next = () => setIndex(prev => Math.min(prev + 1, maxIndex));
    const prev = () => setIndex(prev => Math.max(prev - 1, 0));
    const goTo = (i: number) => setIndex(i);

    return {
        index,
        itemsPerPage,
        maxIndex,
        next,
        prev,
        goTo
    };
};
