
import React, { useState, useEffect, FormEvent } from 'react';
import { Contact } from '../types';
import { CloseIcon, UserIcon, PhoneIcon } from './Icons';

interface ContactFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (contact: Omit<Contact, 'id'> & { id?: string }) => void;
    contactToEdit: Contact | null;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({ isOpen, onClose, onSave, contactToEdit }) => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (contactToEdit) {
            setName(contactToEdit.name);
            setMobile(contactToEdit.mobile);
        } else {
            setName('');
            setMobile('');
        }
        setError('');
    }, [contactToEdit, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !mobile.trim()) {
            setError('Name and mobile number are required.');
            return;
        }
        if (!/^\+?[0-9\s-()]+$/.test(mobile.trim())) {
            setError('Please enter a valid mobile number.');
            return;
        }
        onSave({ id: contactToEdit?.id, name, mobile });
    };

    return (
        <div 
          className="fixed inset-0 bg-slate-900 bg-opacity-75 flex justify-center items-center z-50 transition-opacity"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {contactToEdit ? 'Edit Contact' : 'Add New Contact'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <UserIcon className="h-5 w-5 text-slate-400"/>
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Jane Doe"
                                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <PhoneIcon className="h-5 w-5 text-slate-400"/>
                                </div>
                                <input
                                    type="tel"
                                    id="mobile"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="e.g. (123) 456-7890"
                                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                           {contactToEdit ? 'Save Changes' : 'Add Contact'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactFormModal;