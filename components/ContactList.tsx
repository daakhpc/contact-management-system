
import React from 'react';
import { Contact, InteractionLog } from '../types';
import ContactItem from './ContactItem';
import { UserIcon } from './Icons';

interface ContactListProps {
    contacts: Contact[];
    onEdit: (contact: Contact) => void;
    onDelete: (id: string) => void;
    onLogInteraction: (contact: Contact, type: InteractionLog['type']) => void;
    onViewHistory: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onEdit, onDelete, onLogInteraction, onViewHistory }) => {
    if (contacts.length === 0) {
        return (
            <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <UserIcon className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" />
                <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-slate-200">No Contacts Yet</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Click "Add Contact" to start building your list.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {contacts.map(contact => (
                <ContactItem
                    key={contact.id}
                    contact={contact}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onLogInteraction={onLogInteraction}
                    onViewHistory={onViewHistory}
                />
            ))}
        </div>
    );
};

export default ContactList;