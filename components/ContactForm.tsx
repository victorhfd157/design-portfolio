import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

const ContactForm: React.FC = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = t.contact_form?.error_name || 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = t.contact_form?.error_email_required || 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = t.contact_form?.error_email_invalid || 'Invalid email address';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = t.contact_form?.error_subject || 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = t.contact_form?.error_message || 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = t.contact_form?.error_message_short || 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // EmailJS Integration
            const emailjs = (await import('@emailjs/browser')).default;

            // Get credentials from environment variables
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            // Debug: Log environment variables
            console.log('EmailJS Config:', {
                serviceId: serviceId ? '✓ Loaded' : '✗ Missing',
                templateId: templateId ? '✓ Loaded' : '✗ Missing',
                publicKey: publicKey ? '✓ Loaded' : '✗ Missing',
                actualServiceId: serviceId,
                actualTemplateId: templateId,
                actualPublicKey: publicKey
            });

            // Check if credentials are configured
            if (!serviceId || !templateId || !publicKey) {
                console.warn('EmailJS not configured. Using mailto fallback.');
                // Fallback to mailto
                const mailtoLink = `mailto:victorhfduarte@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
                window.location.href = mailtoLink;
                setSubmitStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
                return;
            }

            // Send email via EmailJS
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message
            };

            await emailjs.send(
                serviceId,
                templateId,
                templateParams,
                publicKey
            );

            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Email send error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                            {t.contact_form?.label_name || 'Name'} <span className="text-brand-accent">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${errors.name
                                ? 'border-red-500 focus:ring-red-500/50'
                                : 'border-white/10 focus:ring-brand-accent/50 focus:border-brand-accent'
                                }`}
                            placeholder={t.contact_form?.placeholder_name || 'Your name'}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle size={12} /> {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                            {t.contact_form?.label_email || 'Email'} <span className="text-brand-accent">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${errors.email
                                ? 'border-red-500 focus:ring-red-500/50'
                                : 'border-white/10 focus:ring-brand-accent/50 focus:border-brand-accent'
                                }`}
                            placeholder={t.contact_form?.placeholder_email || 'your@email.com'}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle size={12} /> {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Subject */}
                <div>
                    <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                        {t.contact_form?.label_subject || 'Subject'} <span className="text-brand-accent">*</span>
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${errors.subject
                            ? 'border-red-500 focus:ring-red-500/50'
                            : 'border-white/10 focus:ring-brand-accent/50 focus:border-brand-accent'
                            }`}
                        placeholder={t.contact_form?.placeholder_subject || 'Project inquiry'}
                    />
                    {errors.subject && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.subject}
                        </p>
                    )}
                </div>

                {/* Message */}
                <div>
                    <label htmlFor="message" className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                        {t.contact_form?.label_message || 'Message'} <span className="text-brand-accent">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all resize-none ${errors.message
                            ? 'border-red-500 focus:ring-red-500/50'
                            : 'border-white/10 focus:ring-brand-accent/50 focus:border-brand-accent'
                            }`}
                        placeholder={t.contact_form?.placeholder_message || 'Tell me about your project...'}
                    />
                    {errors.message && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full px-8 py-4 bg-brand-accent text-white rounded-full font-bold uppercase tracking-wider text-sm overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-purple-600 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative flex items-center justify-center gap-3">
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                {t.contact_form?.button_sending || 'Sending...'}
                            </>
                        ) : submitStatus === 'success' ? (
                            <>
                                <CheckCircle size={18} />
                                {t.contact_form?.button_sent || 'Sent!'}
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                {t.contact_form?.button_send || 'Send Message'}
                            </>
                        )}
                    </span>
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center gap-2">
                        <CheckCircle size={16} />
                        {t.contact_form?.success_message || 'Message sent successfully! I\'ll get back to you soon.'}
                    </div>
                )}
                {submitStatus === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {t.contact_form?.error_general || 'Something went wrong. Please try again or email me directly.'}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ContactForm;
