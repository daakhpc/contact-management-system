
import React, { useState } from 'react';
import { PlusIcon, EditIcon, DatabaseIcon } from './Icons';

interface HeaderProps {
    listName: string;
    onListNameChange: (newName: string) => void;
    onAddContact: () => void;
    onManageLists: () => void;
    contactCount: number;
}

const Header: React.FC<HeaderProps> = ({ listName, onListNameChange, onAddContact, onManageLists, contactCount }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentName, setCurrentName] = useState(listName);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentName(e.target.value);
    };

    const handleSaveName = () => {
        if(currentName.trim()){
            onListNameChange(currentName.trim());
        } else {
           setCurrentName(listName);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveName();
        } else if (e.key === 'Escape') {
            setCurrentName(listName);
            setIsEditing(false);
        }
    };

    return (
        <header className="mb-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Contact Manager Pro</h1>
                <div className="flex items-center gap-2">
                     <button
                        onClick={onManageLists}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                    >
                        <DatabaseIcon className="w-5 h-5" />
                        <span>Manage Lists</span>
                    </button>
                    <button
                        onClick={onAddContact}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Contact</span>
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                {isEditing ? (
                    <input
                        type="text"
                        value={currentName}
                        onChange={handleNameChange}
                        onBlur={handleSaveName}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="text-xl font-semibold bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none border-b-2 border-primary-500 flex-grow"
                    />
                ) : (
                    <div className="flex items-center gap-3 cursor-pointer group flex-grow" onClick={() => setIsEditing(true)}>
                      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {listName}
                      </h2>
                      <EditIcon className="w-4 h-4 text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-opacity opacity-0 group-hover:opacity-100" />
                    </div>
                )}
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    {contactCount} {contactCount === 1 ? 'Contact' : 'Contacts'}
                </span>
            </div>
        </header>
    );
};

export default Header;
