import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

interface Props {
  cedula: string;
  onSuccess: () => void;
}

export const SubirImagenBarbero: React.FC<Props> = ({ cedula, onSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convertir archivo a Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1]; // Remover encabezado data:image/...

      try {
        const response = await fetch('/api/img', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          },
          body: JSON.stringify({ cedula, imagen: base64String }),
        });

        if (response.ok) {
          alert('Imagen actualizada con éxito');
          onSuccess();
        } else {
          alert('Error al subir la imagen');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl text-[11px] font-black shadow-md hover:bg-indigo-600 transition-all"
      >
        <Camera size={14} /> IMAGEN
      </button>
    </>
  );
};