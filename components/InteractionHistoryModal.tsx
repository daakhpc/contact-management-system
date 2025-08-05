
import React from 'react';
import { Contact, InteractionLog } from '../types';
import { CloseIcon, HistoryIcon, PhoneIcon, SmsIcon, WhatsappIcon, PlayIcon } from './Icons';

interface InteractionHistoryModalProps {
    state: {
        isOpen: boolean;
        contact: Contact | null;
    };
    onClose: () => void;
}

const InteractionHistoryModal: React.FC<InteractionHistoryModalProps> = ({ state, onClose }) => {
    const { isOpen, contact } = state;

    if (!isOpen || !contact) {
        return null;
    }

    const logs = contact.logs || [];

    const LogIcon = ({ type }: { type: InteractionLog['type'] }) => {
        const icons = {
            Call: <PhoneIcon className="w-5 h-5 text-green-500" />,
            SMS: <SmsIcon className="w-5 h-5 text-blue-500" />,
            WhatsApp: <WhatsappIcon className="w-5 h-5 text-emerald-500" />,
        };
        return icons[type];
    };
    
    const playAudio = (audioBase64: string) => {
        const audio = new Audio(audioBase64);
        audio.play().catch(e => console.error("Error playing audio:", e));
    };

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex justify-center items-start z-50 transition-opacity p-4 overflow-y-auto" onClick={onClose} aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl my-8 transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <HistoryIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            History for {contact.name}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {logs.length > 0 ? (
                        logs.map(log => (
                            <div key={log.id} className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                    <LogIcon type={log.type} />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-slate-800 dark:text-white">{log.type}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </p>
                                    {log.comment && (
                                        <p className="text-sm bg-slate-50 dark:bg-slate-700/50 p-3 rounded-md text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{log.comment}</p>
                                    )}
                                    {log.audioBase64 && (
                                        <div className="mt-2">
                                            <button onClick={() => playAudio(log.audioBase64)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-full hover:bg-slate-300 dark:hover:bg-slate-500">
                                                <PlayIcon className="w-4 h-4" /> Play Audio Memo
                                            </button>
                                        </div>
                                    )}
                                    {log.imageBase64 && (
                                        <div className="mt-2">
                                           <a href={log.imageBase64} target="_blank" rel="noopener noreferrer">
                                             <img src={log.imageBase64} alt="Attached" className="rounded-lg max-h-48 w-auto cursor-pointer border border-slate-200 dark:border-slate-700" />
                                           </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-center py-12">No interaction history recorded for this contact.</p>
                    )}
                </div>

                <div className="mt-8 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InteractionHistoryModal;
