import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: Toast['type']) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
};

const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
    return (
        <div className="fixed bottom-24 md:bottom-8 right-4 z-[300] flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-brand-accent'
    }[toast.type];

    return (
        <div
            className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/20 min-w-[280px] animate-slide-in-right flex items-center gap-3`}
        >
            {toast.type === 'success' && <span className="text-2xl">✓</span>}
            {toast.type === 'error' && <span className="text-2xl">✗</span>}
            {toast.type === 'info' && <span className="text-2xl">ℹ</span>}
            <span className="font-medium">{toast.message}</span>
        </div>
    );
};
