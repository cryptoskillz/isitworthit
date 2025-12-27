import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, CameraOff } from 'lucide-react';

interface ScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: any) => void;
    onClose: () => void;
}

const Scanner = ({ onScanSuccess, onClose }: ScannerProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scannerRef = useRef<any | null>(null);
    const [permissionError, setPermissionError] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const startScanner = async () => {
        try {
            setPermissionError('');
            const html5QrCode = new Html5Qrcode("scanner-view");
            scannerRef.current = html5QrCode;

            const devices = await Html5Qrcode.getCameras();
            let cameraId = null;

            if (devices && devices.length) {
                const backCamera = devices.find(device =>
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('environment')
                );
                cameraId = backCamera ? backCamera.id : devices[0].id;
            }

            const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
            const cameraConfig = cameraId ? { deviceId: { exact: cameraId } } : { facingMode: "environment" };

            await html5QrCode.start(
                cameraConfig,
                config,
                (decodedText) => {
                    if (html5QrCode.isScanning) {
                        html5QrCode.stop().then(() => {
                            onScanSuccess(decodedText);
                        }).catch(err => console.error("Failed to stop scanner", err));
                    }
                },
                (_errorMessage) => {
                    // ignore
                }
            );
            setIsScanning(true);
        } catch (err: any) {
            console.error("Error starting scanner:", err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setPermissionError("Camera access denied. Please allow camera permissions.");
            } else {
                setPermissionError("Camera failed to start.");
            }
            setIsScanning(false);
        }
    };

    useEffect(() => {
        // Try auto-start on mount
        startScanner();

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch((err: any) => console.error("Failed to stop scanner cleanup", err));
            }
        };
    }, []);

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

            <div className="w-full max-w-sm px-6 relative z-10 flex flex-col items-center">
                <h2 className="text-white text-center mb-6 text-sm leading-relaxed drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                    ALIGN BARCODE
                </h2>

                {permissionError ? (
                    <div className="bg-red-500 border-4 border-black p-4 text-white text-[10px] text-center shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex flex-col items-center gap-4">
                        <CameraOff size={32} />
                        <p>{permissionError}</p>
                        <button
                            onClick={startScanner}
                            className="bg-white text-black border-2 border-black px-4 py-2 mt-2 text-[10px] uppercase hover:bg-gray-200"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="relative p-2 bg-black/10 border-4 border-black rounded-lg shadow-[8px_8px_0_rgba(0,0,0,0.5)] w-full aspect-square flex items-center justify-center">
                        {!isScanning && (
                            <button
                                onClick={startScanner}
                                className="absolute z-20 bg-[#4ade80] border-4 border-black px-6 py-4 text-xs font-bold shadow-[4px_4px_0_rgba(0,0,0,1)] hover:scale-105 active:translate-y-[2px] active:shadow-none transition-all uppercase"
                            >
                                Start Camera
                            </button>
                        )}

                        {/* Reader Container - Hidden until active to prevent "Request permissions" text */}
                        <div
                            id="scanner-view"
                            className={`w-full h-full bg-black border-4 border-white/20 overflow-hidden rounded-sm ${!isScanning ? 'opacity-0' : 'opacity-100'}`}
                        ></div>

                        {/* Retro Viewfinder Overlay */}
                        {isScanning && (
                            <div className="absolute inset-0 pointer-events-none border-[6px] border-transparent z-10">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-[#3b82f6]"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-[#3b82f6]"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-[#3b82f6]"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-[#3b82f6]"></div>
                            </div>
                        )}
                    </div>
                )}

                <p className="text-white text-center mt-6 text-[10px] leading-relaxed drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    POINT CAMERA AT FOOD LABEL
                </p>
            </div>
        </div>
    );
};

export default Scanner;
