import React from 'react';
import ScrollReveal from './ScrollReveal';

interface HeroSectionProps {
    title: string;
    subtitle?: string;
    backgroundType?: 'color' | 'image';
    backgroundColor?: string;
    backgroundImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    title,
    subtitle,
    backgroundType = 'color',
    backgroundColor = '#0f172a',
    backgroundImage
}) => {
    const bgStyle: React.CSSProperties = backgroundType === 'image' && backgroundImage
        ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }
        : {
            backgroundColor: backgroundColor
        };

    return (
        <section 
            className="m-[10px] rounded-[20px] relative min-h-[50vh] flex items-center justify-center overflow-hidden"
            style={bgStyle}
        >
            {/* Gradient overlays - only show for color mode */}
            {backgroundType === 'color' && (
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#991b1b]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                </div>
            )}
            
            {/* Dark overlay for image mode */}
            {backgroundType === 'image' && backgroundImage && (
                <div className="absolute inset-0 bg-black/40 z-0" />
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
                <ScrollReveal direction="down">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-tight drop-shadow-lg">
                        {title}
                    </h1>
                </ScrollReveal>
                {subtitle && (
                    <ScrollReveal delay={0.1}>
                        <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                            {subtitle}
                        </p>
                    </ScrollReveal>
                )}
            </div>
        </section>
    );
};

export default HeroSection;
