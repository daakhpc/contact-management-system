
import React, { useState, useEffect, useCallback } from 'react';
import { Contact, ContactManagerData, SavedList, InteractionLog } from './types';
import Header from './components/Header';
import ContactList from './components/ContactList';
import ContactFormModal from './components/ContactFormModal';
import BulkUpload from './components/BulkUpload';
import ManageListsModal from './components/ManageListsModal';
import LogInteractionModal from './components/LogInteractionModal';
import InteractionHistoryModal from './components/InteractionHistoryModal';
import { DatabaseIcon } from './components/Icons';

const App: React.FC = () => {
    const [data, setData] = useState<ContactManagerData | null>(null);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [logModalState, setLogModalState] = useState<{isOpen: boolean; contact: Contact | null; type: InteractionLog['type'] | null}>({isOpen: false, contact: null, type: null});
    const [historyModalState, setHistoryModalState] = useState<{isOpen: boolean, contact: Contact | null}>({isOpen: false, contact: null});
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    // --- Data Initialization and Persistence ---

    useEffect(() => {
        try {
            const storedData = localStorage.getItem('contactManagerData');
            if (storedData) {
                const parsedData: ContactManagerData = JSON.parse(storedData);
                if (!parsedData.activeListId && parsedData.savedLists.length > 0) {
                    parsedData.activeListId = parsedData.savedLists[0].id;
                }
                setData(parsedData);
            } else {
                const defaultListId = `list-${Date.now()}`;
                setData({
                    activeListId: defaultListId,
                    savedLists: [{
                        id: defaultListId,
                        name: 'My First List',
                        contacts: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }]
                });
            }
        } catch (err) {
            console.error("Failed to load data from localStorage", err);
            setError("Could not load saved data. Starting fresh.");
        }
    }, []);

    useEffect(() => {
        if (data) {
            try {
                localStorage.setItem('contactManagerData', JSON.stringify(data));
            } catch (err) {
                console.error("Failed to save data to localStorage", err);
                setError("Could not save changes. Your data may not persist.");
            }
        }
    }, [data]);
    
    // --- Derived State ---
    const activeList = data?.savedLists.find(list => list.id === data.activeListId);
    const contacts = activeList?.contacts ?? [];
    const listName = activeList?.name ?? 'No List Selected';


    // --- UI Effects ---
    useEffect(() => {
        if (notification || error) {
            const timer = setTimeout(() => {
                setNotification(null);
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification, error]);


    // --- Modal Handlers ---
    const handleOpenContactModal = useCallback((contact: Contact | null = null) => {
        setEditingContact(contact);
        setIsContactModalOpen(true);
    }, []);

    const handleCloseContactModal = useCallback(() => {
        setIsContactModalOpen(false);
        setEditingContact(null);
    }, []);

    const handleOpenLogModal = useCallback((contact: Contact, type: InteractionLog['type']) => {
        setLogModalState({ isOpen: true, contact, type });
    }, []);
    
    const handleCloseLogModal = useCallback(() => {
        setLogModalState({ isOpen: false, contact: null, type: null });
    }, []);
    
    const handleOpenHistoryModal = useCallback((contact: Contact) => {
        setHistoryModalState({ isOpen: true, contact });
    }, []);

    const handleCloseHistoryModal = useCallback(() => {
        setHistoryModalState({ isOpen: false, contact: null });
    }, []);
    
    // --- Core Data Handlers ---
    const updateActiveList = (updater: (list: SavedList) => SavedList) => {
        setData(prevData => {
            if (!prevData?.activeListId) return prevData;
            return {
                ...prevData,
                savedLists: prevData.savedLists.map(list => 
                    list.id === prevData.activeListId ? updater(list) : list
                )
            };
        });
    };

    const handleSaveContact = useCallback((contactData: Omit<Contact, 'id' | 'logs'> & { id?: string }) => {
        let action = 'added';
        updateActiveList(list => {
            let newContacts: Contact[];
            if (contactData.id) { // Editing
                action = 'updated';
                newContacts = list.contacts.map(c => c.id === contactData.id ? { ...c, name: contactData.name, mobile: contactData.mobile } : c)
            } else { // Adding
                const newContact: Contact = { id: `contact-${Date.now()}`, name: contactData.name, mobile: contactData.mobile, logs: [] };
                newContacts = [newContact, ...list.contacts];
            }
            return { ...list, contacts: newContacts, updatedAt: new Date().toISOString() };
        });
        setNotification(`Contact "${contactData.name}" ${action} successfully.`);
        handleCloseContactModal();
    }, [handleCloseContactModal]);

    const handleSaveLog = useCallback((logData: Omit<InteractionLog, 'id' | 'timestamp'>) => {
        if (!logModalState.contact) return;
        
        const newLog: InteractionLog = {
            ...logData,
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
        };

        updateActiveList(list => {
            const updatedContacts = list.contacts.map(c => {
                if (c.id === logModalState.contact?.id) {
                    return { ...c, logs: [newLog, ...(c.logs || [])] };
                }
                return c;
            });
            return { ...list, contacts: updatedContacts, updatedAt: new Date().toISOString() };
        });

        setNotification(`Interaction for "${logModalState.contact.name}" logged.`);
        handleCloseLogModal();
    }, [logModalState.contact, handleCloseLogModal]);

    const handleDeleteContact = useCallback((id: string) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            const contactToDelete = contacts.find(c => c.id === id);
            updateActiveList(list => ({
                ...list,
                contacts: list.contacts.filter(c => c.id !== id),
                updatedAt: new Date().toISOString()
            }));
            if (contactToDelete) {
                setNotification(`Contact "${contactToDelete.name}" deleted.`);
            }
        }
    }, [contacts]);

    const handleBulkUpload = useCallback((newContacts: Contact[]) => {
        updateActiveList(list => ({
            ...list,
            contacts: [...newContacts, ...list.contacts],
            updatedAt: new Date().toISOString()
        }));
        setNotification(`${newContacts.length} contacts uploaded successfully.`);
    }, []);
    
    const handleListNameChange = useCallback((newName: string) => {
        updateActiveList(list => ({ ...list, name: newName, updatedAt: new Date().toISOString() }));
        setNotification(`List name changed to "${newName}".`);
    }, []);

    // --- List Management Handlers ---
    const handleSaveNewList = (name: string) => {
        if (!name.trim()) {
            setError("List name cannot be empty.");
            return;
        }
        setData(prev => {
            if (!prev) return prev;
            const newListId = `list-${Date.now()}`;
            const newList: SavedList = {
                id: newListId,
                name: name.trim(),
                contacts: activeList?.contacts ?? [], // copy contacts from current list
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            return {
                ...prev,
                savedLists: [...prev.savedLists, newList]
            };
        });
        setNotification(`List "${name.trim()}" saved.`);
    };

    const handleLoadList = (listId: string) => {
        setData(prev => prev ? ({ ...prev, activeListId: listId }) : null);
        const listToLoad = data?.savedLists.find(l => l.id === listId);
        setNotification(`Loaded list "${listToLoad?.name}".`);
        setIsManageModalOpen(false);
    };
    
    const handleDeleteList = (listId: string) => {
        setData(prev => {
            if (!prev) return prev;
            const listToDelete = prev.savedLists.find(l => l.id === listId);
            if (!listToDelete || !window.confirm(`Are you sure you want to delete the list "${listToDelete.name}"?`)) {
                return prev;
            }

            const remainingLists = prev.savedLists.filter(l => l.id !== listId);
            let newActiveListId = prev.activeListId;

            if (prev.activeListId === listId) {
                newActiveListId = remainingLists.length > 0 ? remainingLists[0].id : null;
            }

            setNotification(`List "${listToDelete.name}" deleted.`);
            return { savedLists: remainingLists, activeListId: newActiveListId };
        });
    };

    const handleRenameList = (listId: string, newName: string) => {
        if (!newName.trim()) {
            setError("List name cannot be empty.");
            return;
        }
        setData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                savedLists: prev.savedLists.map(l => l.id === listId ? { ...l, name: newName.trim(), updatedAt: new Date().toISOString() } : l)
            }
        });
        setNotification(`List renamed to "${newName.trim()}".`);
    };

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <p className="text-slate-500 dark:text-slate-400 animate-pulse">Loading Contact Manager...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans">
            <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                <Header 
                    listName={listName} 
                    onListNameChange={handleListNameChange}
                    onAddContact={() => handleOpenContactModal(null)}
                    onManageLists={() => setIsManageModalOpen(true)}
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
                    {data.activeListId ? (
                        <>
                            <BulkUpload onUpload={handleBulkUpload} setAppError={setError} />
                            <ContactList 
                                contacts={contacts} 
                                onEdit={handleOpenContactModal} 
                                onDelete={handleDeleteContact}
                                onLogInteraction={handleOpenLogModal}
                                onViewHistory={handleOpenHistoryModal}
                            />
                        </>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                             <DatabaseIcon className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" />
                             <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-slate-200">No List Selected</h3>
                             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create or load a list from the list manager.</p>
                             <button onClick={() => setIsManageModalOpen(true)} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg">
                                Open List Manager
                             </button>
                        </div>
                    )}
                </main>
            </div>
            <ContactFormModal
                isOpen={isContactModalOpen}
                onClose={handleCloseContactModal}
                onSave={handleSaveContact}
                contactToEdit={editingContact}
            />
            <ManageListsModal
                isOpen={isManageModalOpen}
                onClose={() => setIsManageModalOpen(false)}
                data={data}
                onSaveNewList={handleSaveNewList}
                onLoadList={handleLoadList}
                onDeleteList={handleDeleteList}
                onRenameList={handleRenameList}
            />
            <LogInteractionModal
                state={logModalState}
                onClose={handleCloseLogModal}
                onSave={handleSaveLog}
            />
            <InteractionHistoryModal
                state={historyModalState}
                onClose={handleCloseHistoryModal}
            />
        </div>
    );
};

export default App;