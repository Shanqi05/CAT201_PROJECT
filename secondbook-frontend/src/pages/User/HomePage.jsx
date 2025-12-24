// secondbook-frontend/src/pages/User/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../../components/Common/BookCard';
import { Star, BookOpen, ShoppingBag, Info, ChevronDown } from 'lucide-react';
import mockBooks from '../../api/mockBooks.json';
import PROMO_BANNER_PATH from '../../assets/images/promo_banner.png';

const mockReviews = [
    {
        name: 'Seaw Kim Tan',
        initials: 'SK',
        date: 'September 27, 2025',
        rating: 5,
        review: 'Books were securely wrapped and arrived in excellent condition. Very satisfied with the packaging and care taken. Condition is good.',
    },
    {
        name: 'Lee Fui San',
        initials: 'LF',
        date: 'September 28, 2025',
        rating: 4,
        review: 'The book\'s parcel packaging was well pack. Received on time. Good!',
    },
    {
        name: 'Rose',
        initials: 'RO',
        date: 'October 8, 2025',
        rating: 5,
        review: 'Wonderful! I just received my copy of a Christmas album I thought was lost. The album seems to be in great condition. Accompanied by a lovely note from the business owner.',
    },
];

const HomePage = () => {
    const [scrollIndex, setScrollIndex] = useState(0);
    const heroRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!heroRef.current) return;
            const { top, height } = heroRef.current.getBoundingClientRect();
            const sectionHeight = height / 3;
            const index = Math.min(2, Math.max(0, Math.floor(-top / sectionHeight)));
            setScrollIndex(index);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const heroContent = [
        {
            title: "SecondBook",
            subtitle: "PRELOVED BOOKS",
            desc: "Discover 40,000+ preloved treasures.",
            link: "/books",
            label: "BOOKS",
            icon: <BookOpen className="w-10 h-10" />,
            img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000"
        },
        {
            title: "Essentials",
            subtitle: "ACCESSORIES",
            desc: "The perfect companions for your reading journey.",
            link: "/accessories",
            label: "ACCESSORIES",
            icon: <ShoppingBag className="w-10 h-10" />,
            img: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=2000"
        },
        {
            title: "Our Story",
            subtitle: "ABOUT US",
            desc: "Promoting literacy and sustainability since 2025.",
            link: "/about",
            label: "ABOUT US",
            icon: <Info className="w-10 h-10" />,
            img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=2000"
        }
    ];

    const newArrivals = mockBooks.slice(0, 5);
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        return (
            <div className="flex space-x-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < fullStars ? 'fill-green-500 text-green-500' : 'text-gray-300'}`} />
                ))}
            </div>
        );
    };

    return (
        <div className="w-full bg-white">
            {/* 1. STICKY HERO SECTION (3张全屏图切换) */}
            <section ref={heroRef} className="relative h-[300vh] bg-black">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {heroContent.map((item, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${scrollIndex === index ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                    ))}

                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6">
                        <div className="text-center space-y-6 max-w-4xl transform transition-all duration-700">
                            <p className="uppercase tracking-[0.4em] text-yellow-400 text-sm font-bold animate-pulse">
                                {heroContent[scrollIndex].subtitle}
                            </p>
                            <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic drop-shadow-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {heroContent[scrollIndex].title}
                            </h1>
                            <p className="text-lg md:text-2xl text-gray-100 font-light max-w-xl mx-auto drop-shadow-lg">
                                {heroContent[scrollIndex].desc}
                            </p>
                            
                            <div className="pt-8">
                                <Link to={heroContent[scrollIndex].link} className="inline-flex flex-col items-center group">
                                    <div className="bg-white/20 backdrop-blur-xl border border-white/40 p-6 rounded-2xl group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-2xl">
                                        {heroContent[scrollIndex].icon}
                                    </div>
                                    <span className="mt-4 font-black tracking-widest text-xs uppercase group-hover:text-yellow-400 transition-colors">
                                        Enter {heroContent[scrollIndex].label}
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <div className="absolute bottom-10 animate-bounce flex flex-col items-center opacity-70">
                            <span className="text-[10px] tracking-[0.4em] mb-2 uppercase">Scroll Down</span>
                            <ChevronDown size={20} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 内容区域 - 紧贴下方 */}
            <div className="relative z-20 bg-white space-y-24">
                <div className="max-w-7xl mx-auto px-6 pt-20 pb-20 space-y-24">
                    
                    {/* 2. PROMO BANNER (升级版图文排版) */}
                    <section className="relative h-[450px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-2xl group transition-all duration-500">
                        <Link to="/books">
                            {/* 背景与遮罩 */}
                            <div className="absolute inset-0">
                                <img 
                                    src={PROMO_BANNER_PATH} 
                                    alt="Promo" 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                />
                                {/* 渐变层，从左边深色到右边透明，方便放文字 */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                            </div>

                            {/* 内容 */}
                            <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-20 text-white max-w-3xl space-y-6">
                                <span className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-black tracking-widest w-fit transform -translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700">
                                    NEW YEAR SPECIAL
                                </span>
                                <h2 className="text-4xl md:text-7xl font-black leading-tight drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    Your Next <br />
                                    <span className="text-yellow-300 italic">Favorite Book</span> <br />
                                    Is Waiting.
                                </h2>
                                <p className="text-lg md:text-xl text-gray-200 font-light max-w-md">
                                    Unlock exclusive deals on preloved classics. Join 10,000+ readers who choose sustainability.
                                </p>
                                <div className="flex items-center gap-4 text-sm font-bold tracking-widest pt-4 group">
                                    <span className="border-b-2 border-yellow-300 pb-1 group-hover:pr-4 transition-all duration-300">
                                        BROWSE THE SALE
                                    </span>
                                    <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                        →
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </section>

                    {/* 3. New Arrivals */}
                    <section className="bg-gray-50 p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900" style={{fontFamily: 'Playfair Display, serif'}}>NEW ARRIVALS</h2>
                                <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-2"></div>
                            </div>
                            <Link to="/books" className="text-sm font-bold text-purple-600 hover:text-pink-600 flex items-center gap-1 transition-colors">
                                EXPLORE ALL <ChevronDown className="-rotate-90" size={16}/>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                            {newArrivals.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </section>

                    {/* 4. Customer Reviews */}
                    <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 p-12 rounded-[3rem] shadow-xl">
                        <h2 className="text-4xl font-black text-center mb-12 text-gray-900" style={{fontFamily: 'Playfair Display, serif'}}>✨ HAPPY READERS ✨</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {mockReviews.map((review, index) => (
                                <div key={index} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold mr-4 shadow-md">
                                            {review.initials}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 leading-none mb-1">{review.name}</p>
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic mb-6 line-clamp-4 leading-relaxed">"{review.review}"</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.date}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HomePage;