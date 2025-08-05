
import React, { useState, useRef } from 'react';
import { Contact } from '../types';
import { UploadIcon } from './Icons';

interface BulkUploadProps {
    onUpload: (contacts: Contact[]) => void;
    setAppError: (message: string | null) => void;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ onUpload, setAppError }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setAppError(null);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                
                if (lines.length === 0) {
                    throw new Error("CSV file is empty or contains no valid data.");
                }

                const newContacts: Contact[] = lines.map((line, index) => {
                    const [name, mobile] = line.split(',');
                    if (!name || !mobile || name.trim() === '' || mobile.trim() === '') {
                        throw new Error(`Invalid data on line ${index + 1}: Each line must contain a name and a mobile number separated by a comma.`);
                    }
                    if (!/^\+?[0-9\s-()]+$/.test(mobile.trim())) {
                        throw new Error(`Invalid mobile number format on line ${index + 1}: '${mobile.trim()}'`);
                    }
                    return {
                        id: `bulk-${Date.now()}-${Math.random()}`,
                        name: name.trim(),
                        mobile: mobile.trim(),
                        logs: []
                    };
                });

                onUpload(newContacts);
            } catch (error) {
                const message = error instanceof Error ? error.message : "An unknown error occurred during CSV parsing.";
                setAppError(message);
            } finally {
                setIsUploading(false);
                // Reset file input to allow uploading the same file again
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };

        reader.onerror = () => {
            setAppError("Failed to read the file.");
            setIsUploading(false);
        };

        reader.readAsText(file);
    };

    return (
        <div className="mb-6">
            <label
                htmlFor="csv-upload"
                className="flex items-center justify-center w-full px-4 py-6 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
                <div className="text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                            Upload a CSV
                        </span>
                        {' '}or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Format: name,mobile (one per line)
                    </p>
                    {isUploading && (
                        <p className="text-xs text-primary-500 mt-2">Uploading...</p>
                    )}
                </div>
                <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    disabled={isUploading}
                />
            </label>
        </div>
    );
};

export default BulkUpload;