
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Contact, InteractionLog } from '../types';
import { CloseIcon, MicrophoneIcon, PaperClipIcon, StopIcon } from './Icons';

interface LogInteractionModalProps {
    state: {
        isOpen: boolean;
        contact: Contact | null;
        type: InteractionLog['type'] | null;
    };
    onClose: () => void;
    onSave: (logData: Omit<InteractionLog, 'id' | 'timestamp'>) => void;
}

const LogInteractionModal: React.FC<LogInteractionModalProps> = ({ state, onClose, onSave }) => {
    const { isOpen, contact, type } = state;

    const [comment, setComment] = useState('');
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [audioBase64, setAudioBase64] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingError, setRecordingError] = useState<string | null>(null);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (isOpen) {
            setComment('');
            setImageBase64(null);
            setAudioBase64(null);
            setIsRecording(false);
            setRecordingError(null);
            audioChunksRef.current = [];
        }
    }, [isOpen]);

    if (!isOpen || !contact || !type) {
        return null;
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStartRecording = async () => {
        setRecordingError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onload = () => {
                    setAudioBase64(reader.result as string);
                };
                reader.readAsDataURL(audioBlob);
                stream.getTracks().forEach(track => track.stop()); // Stop mic access
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setRecordingError("Microphone access denied. Please enable it in your browser settings.");
        }
    };

    const handleStopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave({
            type,
            comment: comment || undefined,
            imageBase64: imageBase64 || undefined,
            audioBase64: audioBase64 || undefined
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex justify-center items-center z-50 transition-opacity p-4" onClick={onClose} aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Log {type} with {contact.name}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Comment (Optional)</label>
                            <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="Add notes about the interaction..." className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"></textarea>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Record Audio</label>
                            <div className="flex items-center gap-4">
                                {!isRecording ? (
                                    <button type="button" onClick={handleStartRecording} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700">
                                        <MicrophoneIcon className="w-5 h-5"/> Start Recording
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleStopRecording} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 animate-pulse">
                                        <StopIcon className="w-5 h-5"/> Stop Recording
                                    </button>
                                )}
                                {audioBase64 && <p className="text-sm text-green-600">Audio recorded!</p>}
                            </div>
                            {recordingError && <p className="text-red-500 text-sm mt-2">{recordingError}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Attach Image</label>
                            <label htmlFor="image-upload" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer">
                                <PaperClipIcon className="w-5 h-5"/>
                                <span>{imageBase64 ? "Image Selected" : "Choose Image"}</span>
                            </label>
                            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            {imageBase64 && <img src={imageBase64} alt="Preview" className="mt-2 rounded-lg max-h-40" />}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                           Save Log
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogInteractionModal;
