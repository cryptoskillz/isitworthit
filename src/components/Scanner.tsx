import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

interface ScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: any) => void;
    onClose: () => void;
}

const Scanner = ({ onScanSuccess, onClose }: ScannerProps) => {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Initialize scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear().then(() => {
                    onScanSuccess(decodedText);
                });
            },
            (errorMessage) => {
                // scan failure is very common (every frame no code is found)
                // so we don't spam errors
                console.debug(errorMessage);
            }
        );

        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
            }
        };
    }, [onScanSuccess]);

    return (
        <div className="fixed inset-0 z-50 bg-sky-400 font-['Press_Start_2P'] flex flex-col items-center justify-center">
            {/* Retro Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

            <button
                onClick={onClose}
                className="absolute top-6 right-6 bg-[#ff5f5f] border-4 border-black p-3 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:scale-105 active:scale-95 active:shadow-none active:translate-y-[4px] transition-all z-50"
            >
                <X size={24} className="text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]" />
            </button>

            <div className="w-full max-w-sm px-6 relative z-10">
                <h2 className="text-white text-center mb-6 text-sm leading-relaxed drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                    ALIGN BARCODE
                </h2>

                <div className="relative p-2 bg-black/10 border-4 border-black rounded-lg shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                    {/* Reader Container */}
                    <div id="reader" className="w-full bg-black border-4 border-white/20"></div>

                    {/* Retro Viewfinder Overlay */}
                    <div className="absolute inset-0 pointer-events-none border-[6px] border-transparent">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-[#3b82f6]"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-[#3b82f6]"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-[#3b82f6]"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-[#3b82f6]"></div>
                    </div>
                </div>

                <p className="text-white text-center mt-6 text-[10px] leading-relaxed drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    POINT CAMERA AT FOOD LABEL
                </p>
            </div>
        </div>
    );
};

export default Scanner;
