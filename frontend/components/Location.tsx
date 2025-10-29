import React, { useEffect, useState, useRef } from 'react';
import { MapPin, AlertTriangle, Loader } from 'lucide-react';

interface Position {
  lat: number;
  lng: number;
}

const Location: React.FC = () => {
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [myPosition, setMyPosition] = useState<Position | null>(null);
  const [partnerPosition, setPartnerPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state);
        if (result.state === 'granted') {
          startWatching();
        }
        result.onchange = () => {
            setPermissionStatus(result.state);
            if (result.state === 'granted') {
              startWatching();
            } else {
              stopWatching();
            }
        };
    });
    
    return () => {
      stopWatching();
    };
  }, []);

  const startWatching = () => {
    if (watchIdRef.current === null) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setError(null);
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMyPosition(newPos);
          // Simulação da posição do parceiro
          setPartnerPosition({
            lat: newPos.lat + 0.005,
            lng: newPos.lng + 0.005,
          });
        },
        (err) => {
          setError(err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        setPermissionStatus('granted');
        startWatching();
      },
      () => setPermissionStatus('denied')
    );
  };
  
  const renderContent = () => {
    if (permissionStatus === 'denied') {
      return (
         <div className="text-center text-red-400">
            <AlertTriangle size={40} className="mx-auto mb-4"/>
            <h3 className="text-lg font-bold">Permissão Negada</h3>
            <p>Você precisa habilitar a permissão de localização nas configurações do seu navegador para usar esta função.</p>
        </div>
      );
    }
    if (permissionStatus === 'prompt') {
      return (
        <div className="text-center text-gray-400">
            <p className="mb-4">Para compartilhar a localização, precisamos da sua permissão.</p>
            <button onClick={requestLocation} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-500 transition shadow-lg shadow-[0_0_20px_rgba(147,51,234,0.6)]">
                Dar Permissão
            </button>
        </div>
      );
    }
    if (permissionStatus === 'granted') {
      if (error) {
        return (
          <div className="text-center text-red-400">
            <AlertTriangle size={40} className="mx-auto mb-4"/>
            <h3 className="text-lg font-bold">Erro ao obter localização</h3>
            <p className="text-sm">{error}</p>
          </div>
        );
      }
      if (!myPosition || !partnerPosition) {
        return (
          <div className="text-center text-purple-300 flex flex-col items-center">
            <Loader size={40} className="animate-spin mb-4"/>
            <p>Obtendo sua localização...</p>
          </div>
        );
      }
      return (
        <div className="w-full h-[300px] bg-purple-900/30 rounded-lg relative overflow-hidden border border-purple-700">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" title={`Você está em ${myPosition.lat.toFixed(4)}, ${myPosition.lng.toFixed(4)}`}>
            <div className="w-16 h-16 rounded-full bg-pink-500/50 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-pink-400 shadow-md animate-pulse"></div>
            </div>
            <p className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold bg-pink-500 text-white px-2 py-0.5 rounded-full">Você</p>
          </div>
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2" title={`Seu amor está em ${partnerPosition.lat.toFixed(4)}, ${partnerPosition.lng.toFixed(4)}`}>
            <div className="w-16 h-16 rounded-full bg-cyan-500/50 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-md"></div>
            </div>
             <p className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold bg-cyan-500 text-white px-2 py-0.5 rounded-full">Seu Amor</p>
          </div>
           <p className="absolute bottom-2 right-2 text-xs text-gray-500">Localização do parceiro(a) simulada.</p>
        </div>
      );
    }
  };

  return (
    <div className="animate-fade-in text-center">
      <div className="flex items-center justify-center mb-6">
        <MapPin size={32} className="text-purple-400" style={{ filter: 'drop-shadow(0 0 5px #9333ea)' }}/>
        <h1 className="font-display text-4xl font-bold text-gray-100 ml-3" style={{ textShadow: '0 0 10px #9333ea' }}>Localização</h1>
      </div>
      <p className="text-purple-300 mb-8">Veja onde seu amor está em tempo real.</p>
      
      <div className="bg-[#1f1f3a]/70 border border-purple-500/30 rounded-2xl shadow-lg p-6 min-h-[300px] flex flex-col items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default Location;