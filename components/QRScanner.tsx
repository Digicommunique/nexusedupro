
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  isScanning: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, isScanning }) => {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);

  useEffect(() => {
    if (isScanning && !html5QrCodeRef.current) {
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      const startScanner = async () => {
        try {
          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              onScan(decodedText);
            },
            () => {
              // Ignore scan errors
            }
          );
          setIsCameraStarted(true);
          setError(null);
        } catch (err: any) {
          console.error("Failed to start scanner", err);
          setError("Camera access denied or not found. Please ensure camera permissions are granted.");
          setIsCameraStarted(false);
        }
      };

      startScanner();
    }

    return () => {
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().then(() => {
            html5QrCodeRef.current?.clear();
            html5QrCodeRef.current = null;
            setIsCameraStarted(false);
          }).catch(err => console.error("Failed to stop scanner", err));
        } else {
          html5QrCodeRef.current.clear();
          html5QrCodeRef.current = null;
          setIsCameraStarted(false);
        }
      }
    };
  }, [isScanning, onScan]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-3xl border-4 border-slate-900 shadow-2xl bg-slate-100 aspect-square flex items-center justify-center">
        <div id="qr-reader" className="w-full h-full"></div>
        {!isCameraStarted && !error && isScanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Initializing Camera...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-rose-50 p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <svg className="w-12 h-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs font-bold text-rose-600 uppercase tracking-tight">{error}</p>
              <div className="flex flex-col gap-2 w-full">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                >
                  Retry / Reload
                </button>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Try opening the app in a new tab if the issue persists.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
