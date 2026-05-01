import { X, Maximize2, Minimize2, Video, VideoOff, Mic, MicOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
  roomName: string;
  onClose: () => void;
}

export default function JitsiMeet({ roomName, onClose }: Props) {
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [permissionState, setPermissionState] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  // Extract the room ID from the full URL if necessary
  const roomId = roomName.includes('meet.jit.si/') 
    ? roomName.split('meet.jit.si/')[1] 
    : roomName;

  // Professional Jitsi Configuration
  const jitsiUrl = `https://meet.jit.si/${roomId}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","profile","chat","recording","livestream","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","invite","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","security"]&config.defaultLanguage="en"&config.prejoinPageEnabled=false`;

  useEffect(() => {
    async function requestPermissions() {
      try {
        setPermissionState('pending');
        // Explicitly request camera and microphone permissions
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // Stop the tracks immediately after permission is granted as Jitsi will handle its own stream
        stream.getTracks().forEach(track => track.stop());
        setPermissionState('granted');
      } catch (err: any) {
        console.error('Permission denied:', err);
        setPermissionState('denied');
        setErrorMessage(err.message || 'Camera and Microphone access was denied.');
      }
    }
    requestPermissions();
  }, []);

  return (
    <div className={`fixed inset-0 z-[200] bg-slate-900 flex flex-col ${isFullScreen ? '' : 'p-4 md:p-8 transition-all duration-300'}`}>
      {/* Header / Toolbar */}
      <div className="bg-slate-800 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold">V</span>
          </div>
          <div>
            <h2 className="font-semibold text-sm">Video Consultation</h2>
            <p className="text-[10px] text-slate-400">Florence Hospital Secure Line</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {permissionState === 'granted' && (
            <button 
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
              title={isFullScreen ? "Minimize" : "Full Screen"}
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-2 hover:bg-rose-600 rounded-full transition-colors text-white"
            title="End Session"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 relative bg-black ${isFullScreen ? '' : 'rounded-b-2xl overflow-hidden shadow-2xl'}`}>
        {permissionState === 'pending' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900 p-6 text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
            <h3 className="text-xl font-bold mb-2">Connecting to Secure Line...</h3>
            <p className="text-slate-400 max-w-xs">Please allow camera and microphone access when prompted by your device.</p>
            <div className="flex gap-4 mt-8">
              <div className="flex flex-col items-center gap-2 opacity-50">
                <Video className="w-6 h-6" />
                <span className="text-[10px]">Video</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-50">
                <Mic className="w-6 h-6" />
                <span className="text-[10px]">Audio</span>
              </div>
            </div>
          </div>
        )}

        {permissionState === 'denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900 p-8 text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-rose-400">Permissions Required</h3>
            <p className="text-slate-400 max-w-sm mb-8">
              To start your consultation, you must allow access to your camera and microphone.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white py-3 px-6 font-medium text-sm transition-colors"
              >
                Go Back
              </button>
            </div>
            <p className="mt-8 text-[10px] text-slate-500">Error: {errorMessage}</p>
          </div>
        )}

        {permissionState === 'granted' && (
          <iframe
            src={jitsiUrl}
            allow="camera; microphone; display-capture; autoplay; clipboard-write"
            className="absolute inset-0 w-full h-full border-0"
            title="Jitsi Meeting"
          />
        )}
      </div>

      {!isFullScreen && permissionState === 'granted' && (
        <div className="mt-4 text-center">
          <p className="text-slate-500 text-sm font-medium">Session in progress...</p>
        </div>
      )}
    </div>
  );
}
