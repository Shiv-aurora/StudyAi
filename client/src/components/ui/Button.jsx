const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-6 py-2 rounded-2xl font-semibold transition-all duration-200 transform active:scale-95";

    const variants = {
        primary: "bg-beige-600 text-white hover:bg-beige-700 shadow-md hover:shadow-lg",
        secondary: "bg-white text-beige-700 border-2 border-beige-200 hover:border-beige-400",
        danger: "bg-red-400 text-white hover:bg-red-500",
        ghost: "text-stone-600 hover:text-stone-900 hover:bg-beige-100"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
