
import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    width = "100%",
    delay = 0,
    direction = "up"
}) => {
    const getInitialProps = () => {
        switch (direction) {
            case "up": return { opacity: 0, y: 50 };
            case "down": return { opacity: 0, y: -50 };
            case "left": return { opacity: 0, x: 50 };
            case "right": return { opacity: 0, x: -50 };
            default: return { opacity: 0, y: 50 };
        }
    };

    return (
        <div style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={{
                    hidden: getInitialProps(),
                    visible: { opacity: 1, y: 0, x: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default ScrollReveal;
