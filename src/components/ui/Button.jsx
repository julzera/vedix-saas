import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm";
  
  const variants = {
    primary: "bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-95",
    outline: "border border-border text-text-primary hover:border-primary hover:text-primary bg-transparent",
    ghost: "text-text-secondary hover:bg-primary-light hover:text-primary",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;