
import React from 'react';
import { Contact } from '../types';
import { EditIcon, TrashIcon, UserIcon, PhoneIcon } from './Icons';

interface ContactItemProps {
    contact: Contact;
    onEdit: (contact: Contact) => void;
    onDelete: (id: string) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full">
                    <UserIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                    <p className="font-semibold text-slate-800 dark:text-white">{contact.name}</p>
                    <div className="flex items-center gap-1.5">
                        <PhoneIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">{contact.mobile}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEdit(contact)}
                    className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label={`Edit ${contact.name}`}
                >
                    <EditIcon />
                </button>
                <button
                    onClick={() => onDelete(contact.id)}
                    className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label={`Delete ${contact.name}`}
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

export default ContactItem;