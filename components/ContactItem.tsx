
import React from 'react';
import { Contact, InteractionLog } from '../types';
import { EditIcon, TrashIcon, UserIcon, PhoneIcon, SmsIcon, WhatsappIcon, HistoryIcon } from './Icons';

interface ContactItemProps {
    contact: Contact;
    onEdit: (contact: Contact) => void;
    onDelete: (id: string) => void;
    onLogInteraction: (contact: Contact, type: InteractionLog['type']) => void;
    onViewHistory: (contact: Contact) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, onEdit, onDelete, onLogInteraction, onViewHistory }) => {
    const logCount = contact.logs?.length || 0;
    
    // Sanitize phone number for URL usage
    const sanitizedMobile = contact.mobile.replace(/[^0-9+]/g, '');

    const handleActionClick = (type: InteractionLog['type']) => {
        onLogInteraction(contact, type);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4 flex-grow">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full">
                    <UserIcon className="h-7 w-7 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-lg">{contact.name}</p>
                    <div className="flex items-center gap-1.5">
                        <PhoneIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">{contact.mobile}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100 dark:border-slate-700 pt-3 sm:pt-0">
                {/* Action Buttons */}
                <a href={`tel:${sanitizedMobile}`} onClick={() => handleActionClick('Call')} className="p-2 text-slate-500 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label={`Call ${contact.name}`}>
                    <PhoneIcon />
                </a>
                <a href={`sms:${sanitizedMobile}`} onClick={() => handleActionClick('SMS')} className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label={`SMS ${contact.name}`}>
                    <SmsIcon />
                </a>
                <a href={`https://wa.me/${sanitizedMobile}`} target="_blank" rel="noopener noreferrer" onClick={() => handleActionClick('WhatsApp')} className="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label={`WhatsApp ${contact.name}`}>
                    <WhatsappIcon />
                </a>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-600 mx-1"></div>
                {/* Management Buttons */}
                <button onClick={() => onViewHistory(contact)} className="relative p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label={`View history for ${contact.name}`}>
                    <HistoryIcon />
                    {logCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-white text-xs font-bold">
                           {logCount}
                        </span>
                    )}
                </button>
                <button onClick={() => onEdit(contact)} className="p-2 text-slate-500 hover:text-yellow-600 dark:text-slate-400 dark:hover:text-yellow-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label={`Edit ${contact.name}`}>
                    <EditIcon />
                </button>
                <button onClick={() => onDelete(contact.id)} className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label={`Delete ${contact.name}`}>
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

export default ContactItem;