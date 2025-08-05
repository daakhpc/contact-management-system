
import React, { useState, useEffect, useCallback } from 'react';
import { Contact } from './types';
import Header from './components/Header';
import ContactList from './components/ContactList';
import ContactFormModal from './components/ContactFormModal';
import BulkUpload from './components/BulkUpload';

const App: React.FC = () => {
    const [listName, setListName] = useState<string>('My Contacts');
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    // Load from localStorage on initial render
    useEffect(() => {
        try {
            const storedContacts = localStorage.getItem('contacts');
            const storedListName = localStorage.getItem('listName');
            if (storedContacts) {
                setContacts(JSON.parse(storedContacts));
            }
            if (storedListName) {
                setListName(JSON.parse(storedListName));
            }
        } catch (err) {
            console.error("Failed to load data from localStorage", err);
            setError("Could not load saved data. Starting fresh.");
        }
    }, []);

    // Save to localStorage whenever contacts or listName change
    useEffect(() => {
        try {
            localStorage.setItem('contacts', JSON.stringify(contacts));
            localStorage.setItem('listName', JSON.stringify(listName));
        } catch (err) {
            console.error("Failed to save data to localStorage", err);
            setError("Could not save changes. Your data may not persist.");
        }
    }, [contacts, listName]);

    // Effect to clear notifications after a delay
    useEffect(() => {
        if (notification || error) {
            const timer = setTimeout(() => {
                setNotification(null);
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification, error]);

    const handleOpenModal = useCallback((contact: Contact | null = null) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingContact(null);
    }, []);

    const handleSaveContact = useCallback((contactData: Omit<Contact, 'id'> & { id?: string }) => {
        if (contactData.id) { // Editing existing contact
            setContacts(prev =>
                prev.map(c => c.id === contactData.id ? { ...c, name: contactData.name, mobile: contactData.mobile } : c)
            );
            setNotification(`Contact "${contactData.name}" updated successfully.`);
        } else { // Adding new contact
            const newContact: Contact = {
                id: `contact-${Date.now()}`,
                ...contactData,
            };
            setContacts(prev => [newContact, ...prev]);
            setNotification(`Contact "${contactData.name}" added successfully.`);
        }
        handleCloseModal();
    }, [handleCloseModal]);

    const handleDeleteContact = useCallback((id: string) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            const contactToDelete = contacts.find(c => c.id === id);
            setContacts(prev => prev.filter(c => c.id !== id));
            if (contactToDelete) {
                setNotification(`Contact "${contactToDelete.name}" deleted.`);
            }
        }
    }, [contacts]);

    const handleBulkUpload = useCallback((newContacts: Contact[]) => {
        setContacts(prev => [...newContacts, ...prev]);
        setNotification(`${newContacts.length} contacts uploaded successfully.`);
    }, []);
    
    const handleListNameChange = useCallback((newName: string) => {
        setListName(newName);
        setNotification(`List name changed to "${newName}".`);
    }, []);

    return (
        <div className="min-h-screen font-sans">
            <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                <Header 
                    listName={listName} 
                    onListNameChange={handleListNameChange}
                    onAddContact={() => handleOpenModal(null)}
                    contactCount={contacts.length}
                />
                <main>
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-r-lg" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {notification && (
                         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-r-lg" role="alert">
                            <p className="font-bold">Success</p>
                            <p>{notification}</p>
                        </div>
                    )}
                    <BulkUpload onUpload={handleBulkUpload} setAppError={setError} />
                    <ContactList 
                        contacts={contacts} 
                        onEdit={handleOpenModal} 
                        onDelete={handleDeleteContact} 
                    />
                </main>
            </div>
            <ContactFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveContact}
                contactToEdit={editingContact}
            />
        </div>
    );
};

export default App;