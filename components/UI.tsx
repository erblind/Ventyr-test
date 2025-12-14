
import React, { useEffect, useState } from 'react';
import { Loader2, X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ToastMessage } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'blue';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', className = '', isLoading, ...props 
}) => {
  // Base: 56px height (py-4), rounded-2xl (14px), font-bold 16px
  const baseStyle = "relative overflow-hidden rounded-[14px] font-bold text-[16px] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed h-[56px]";
  
  const variants = {
    // Gradient: linear-gradient(90deg,#4B6BFF 0%, #7A4BFF 100%)
    // Shadow: 0 12px 32px rgba(75,107,255,0.18)
    primary: "brand-gradient text-white shadow-neon-brand hover:brightness-110 border-none",
    
    // Ghost/Secondary for Maps etc: Blue text on transparent/dim bg
    blue: "bg-[#4B6BFF]/10 text-[#4B6BFF] hover:bg-[#4B6BFF]/20 border border-[#4B6BFF]/20",
    
    // Outline style: border 1px solid rgba(255,255,255,0.06), text #C7CDD2
    secondary: "bg-transparent border border-white/[0.06] text-[#C7CDD2] hover:bg-white/[0.03] hover:text-white",
    
    ghost: "bg-transparent text-text-tertiary hover:text-white hover:bg-white/5",
    
    danger: "bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className} ${isLoading ? 'opacity-80 cursor-wait' : ''}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode; 
    className?: string; 
    hoverEffect?: boolean;
    isActive?: boolean;
    variant?: 'default' | 'solid';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, className = '', hoverEffect = false, isActive = false, variant = 'default', ...props
}) => {
    // Card background: #0F1316 (Obsidian), radius 12px, border 1px solid rgba(255,255,255,0.03)
    const baseClass = variant === 'solid' 
        ? "bg-dark-surface border border-white/[0.03] shadow-card"
        : "glass-panel";

    return (
      <div className={`rounded-[12px] p-[14px] relative transition-all duration-300 
        ${baseClass}
        ${hoverEffect ? 'hover:bg-white/5 hover:-translate-y-1 hover:shadow-neon-brand cursor-pointer' : ''} 
        ${isActive ? 'border-neon-blue shadow-neon-brand bg-neon-blue/10' : ''}
        ${className}`}
        {...props}
        >
        {children}
      </div>
    );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="group relative z-0 w-full mb-6">
    <input
      placeholder=" "
      className={`block py-3 px-4 w-full text-[16px] text-white bg-[#0F1316] rounded-[12px] border border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(75,107,255,0.2)] peer transition-all duration-300 ${className}`}
      {...props}
    />
    {label && (
      <label className="absolute text-sm text-text-tertiary duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent px-2 peer-focus:px-2 peer-focus:text-neon-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 pointer-events-none">
        {label}
      </label>
    )}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'purple' | 'blue' | 'green' | 'red' | 'gray'; className?: string }> = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    purple: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
    blue: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
    green: 'bg-neon-green/10 text-neon-green border-neon-green/20',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    gray: 'bg-white/10 text-text-secondary border-white/10'
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${colors[color]} backdrop-blur-sm ${className}`}>
      {children}
    </span>
  );
};

// --- Toast System ---

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-[1000] flex flex-col gap-3 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto bg-[#0F1316] border border-white/10 shadow-card text-white px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
           {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-neon-green" />}
           {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
           {toast.type === 'info' && <Info className="w-5 h-5 text-neon-blue" />}
           {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-400" />}
           <p className="text-sm font-medium flex-1 text-white">{toast.message}</p>
           <button onClick={() => removeToast(toast.id)} className="text-text-tertiary hover:text-white"><X className="w-4 h-4"/></button>
        </div>
      ))}
    </div>
  );
};

// --- Modal System ---

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; actions?: React.ReactNode }> = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#0F1316] border border-white/10 rounded-[20px] w-full max-w-md overflow-hidden shadow-card animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-[20px] font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-text-tertiary hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {actions && (
          <div className="p-6 pt-0 flex justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
