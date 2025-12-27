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
        // Initialize scanner with library UI
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                // Attempt to default to environment (back) camera
                videoConstraints: {
                    facingMode: "environment"
                }
            },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear().then(() => {
                    onScanSuccess(decodedText);
                });
            },
            (_errorMessage) => {
                // console.debug(errorMessage);
            }
        );

        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Failed to default clear scanner", err));
            }
        };
    }, [onScanSuccess]);

    return (
        <div className="fixed inset-0 z-50 bg-sky-400 font-['Press_Start_2P'] flex flex-col items-center justify-center">
            {/* Retro Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

            {/* Custom Styles for the Library UI */}
            <style>{`
                #reader {
                    border: none !important;
                }
                #reader__scan_region {
                    background: rgba(0,0,0,0.1);
                    border: 4px solid white !important;
                    border-radius: 8px;
                }
                #reader__dashboard_section_csr button {
                    font-family: 'Press Start 2P', system-ui !important;
                    background-color: #4ade80 !important;
                    color: black !important;
                    border: 4px solid black !important;
                    padding: 10px 20px !important;
                    font-size: 10px !important;
                    text-transform: uppercase !important;
                    box-shadow: 4px 4px 0 rgba(0,0,0,1) !important;
                    cursor: pointer !important;
                    margin-bottom: 10px !important;
                }
                #reader__dashboard_section_csr button:active {
                    transform: translateY(2px) !important;
                    box-shadow: none !important;
                }
                #reader__dashboard_section_swaplink {
                    text-decoration: none !important;
                    color: white !important;
                    border: 2px solid black !important;
                    background: #3b82f6 !important;
                    padding: 5px 10px !important;
                    font-size: 8px !important;
                    box-shadow: 2px 2px 0 rgba(0,0,0,1) !important;
                    display: inline-block !important;
                    margin-top: 10px !important;
                }
                #reader__camera_selection {
                    font-family: 'Press Start 2P', system-ui !important;
                    font-size: 8px !important;
                    padding: 5px !important;
                    border: 4px solid black !important;
                    margin-bottom: 10px !important;
                }
                span {
                    color: white !important;
                    text-shadow: 2px 2px 0 #000 !important;
                }
            `}</style>

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
                    <div id="reader" className="w-full bg-transparent"></div>
                </div>

                <p className="text-white text-center mt-6 text-[10px] leading-relaxed drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    POINT CAMERA AT FOOD LABEL
                </p>
            </div>
        </div>
    );
};

export default Scanner;
