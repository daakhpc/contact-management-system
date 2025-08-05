
import React, { useState, FormEvent } from 'react';
import { ContactManagerData, SavedList } from '../types';
import { CloseIcon, DatabaseIcon, EditIcon, TrashIcon, ArrowDownTrayIcon, PlusIcon } from './Icons';

interface ManageListsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ContactManagerData | null;
    onSaveNewList: (name: string) => void;
    onLoadList: (listId: string) => void;
    onDeleteList: (listId: string) => void;
    onRenameList: (listId: string, newName: string) => void;
}

const ManageListsModal: React.FC<ManageListsModalProps> = ({ isOpen, onClose, data, onSaveNewList, onLoadList, onDeleteList, onRenameList }) => {
    const [newListName, setNewListName] = useState('');
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renamingText, setRenamingText] = useState('');
    
    if (!isOpen) return null;

    const handleSaveAsSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSaveNewList(newListName);
        setNewListName('');
    };

    const handleRenameSubmit = (e: FormEvent, listId: string) => {
        e.preventDefault();
        onRenameList(listId, renamingText);
        setRenamingId(null);
        setRenamingText('');
    };
    
    const startRename = (list: SavedList) => {
        setRenamingId(list.id);
        setRenamingText(list.name);
    }
    
    const ListItem = ({ list }: { list: SavedList }) => (
      <div key={list.id} className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {renamingId === list.id ? (
              <form onSubmit={(e) => handleRenameSubmit(e, list.id)} className="flex-grow flex gap-2">
                  <input
                      type="text"
                      value={renamingText}
                      onChange={(e) => setRenamingText(e.target.value)}
                      className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      autoFocus
                  />
                  <button type="submit" className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm font-semibold">Save</button>
                  <button type="button" onClick={() => setRenamingId(null)} className="px-3 py-1 bg-slate-500 text-white rounded-md text-sm">Cancel</button>
              </form>
          ) : (
              <>
                  <div className="flex-grow">
                      <p className={`font-semibold text-slate-800 dark:text-white ${list.id === data?.activeListId ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                          {list.name}
                          {list.id === data?.activeListId && <span className="text-xs ml-2 font-normal">(Active)</span>}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                          {list.contacts.length} contacts, last updated {new Date(list.updatedAt).toLocaleDateString()}
                      </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                          onClick={() => onLoadList(list.id)}
                          disabled={list.id === data?.activeListId}
                          className="p-2 text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed transition-colors rounded-full"
                          aria-label={`Load ${list.name}`}
                      >
                          <ArrowDownTrayIcon />
                      </button>
                      <button onClick={() => startRename(list)} className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors rounded-full" aria-label={`Rename ${list.name}`}>
                          <EditIcon />
                      </button>
                      <button onClick={() => onDeleteList(list.id)} disabled={data?.savedLists.length === 1} className="p-2 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-500 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed transition-colors rounded-full" aria-label={`Delete ${list.name}`}>
                          <TrashIcon />
                      </button>
                  </div>
              </>
          )}
      </div>
  );

    return (
        <div 
          className="fixed inset-0 bg-slate-900 bg-opacity-75 flex justify-center items-start z-50 transition-opacity p-4 overflow-y-auto"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl my-8 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <DatabaseIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Manage Contact Lists
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200">Save Current List As...</h3>
                    <form onSubmit={handleSaveAsSubmit} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder={`Copy of "${data?.savedLists.find(l => l.id === data.activeListId)?.name}"`}
                            className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            required
                        />
                        <button type="submit" className="flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            <PlusIcon className="w-4 h-4"/>
                            <span>Save as New List</span>
                        </button>
                    </form>
                </div>
                
                <div>
                     <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200">Your Saved Lists</h3>
                     <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                        {data?.savedLists && data.savedLists.length > 0 ? (
                           data.savedLists.map(list => <ListItem key={list.id} list={list} />)
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No lists saved yet.</p>
                        )}
                     </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageListsModal;
