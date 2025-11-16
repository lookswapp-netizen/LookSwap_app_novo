import React, { useState, useEffect, useCallback } from 'react';
import { getClothingDescription, generateStyledImage } from '../backend/api';
import { ImageUploader } from './ImageUploader';
import { OptionSelector } from './OptionSelector';
import { LoadingSpinner } from './LoadingSpinner';
import { GeneratedImage } from './GeneratedImage';
import { Icon } from './Icon';
import { normalizeImage } from '../utils';
import { 
    PERSONA_OPTIONS, 
    HAIR_OPTIONS, 
    ENVIRONMENT_OPTIONS, 
    LIGHTING_OPTIONS, 
    PHONE_MODE_OPTIONS,
    ACCESSORY_OPTIONS,
    MIRROR_INTERACTION_OPTIONS,
    POSTURE_OPTIONS,
    ASPECT_RATIO_OPTIONS,
    ENVIRONMENT_LIGHTING_MAP 
} from '../publicConstants';
import type { Step } from '../types';

interface MainAppProps {
  onNavigateToPricing: () => void;
}

export const MainApp: React.FC<MainAppProps> = ({ onNavigateToPricing }) => {
    const [step, setStep] = useState<Step>('UPLOAD');
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [clothingDescription, setClothingDescription] = useState<string>('');
    
    const [selectedPersona, setSelectedPersona] = useState<string>(PERSONA_OPTIONS[0].id);
    const [selectedHair, setSelectedHair] = useState<string>(HAIR_OPTIONS[0].id);
    const [selectedEnvironment, setSelectedEnvironment] = useState<string>(ENVIRONMENT_OPTIONS[0].id);
    const [selectedLighting, setSelectedLighting] = useState<string>(LIGHTING_OPTIONS[0].id);

    // New state for composition details
    const [selectedPhoneMode, setSelectedPhoneMode] = useState<string>(PHONE_MODE_OPTIONS[0].id);
    const [selectedAccessory, setSelectedAccessory] = useState<string[]>([ACCESSORY_OPTIONS[0].id]);
    const [selectedMirrorInteraction, setSelectedMirrorInteraction] = useState<string>(MIRROR_INTERACTION_OPTIONS[0].id);
    const [selectedPosture, setSelectedPosture] = useState<string>(POSTURE_OPTIONS[0].id);
    const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>(ASPECT_RATIO_OPTIONS[0].id);


    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const defaultLightingId = ENVIRONMENT_LIGHTING_MAP[selectedEnvironment] || LIGHTING_OPTIONS[0].id;
        setSelectedLighting(defaultLightingId);
    }, [selectedEnvironment]);

    const handleImageUpload = useCallback(async (file: File) => {
        setUploadedImage(file);
        setImagePreviewUrl(URL.createObjectURL(file));
        setIsProcessing(true);
        setError(null);

        try {
            const description = await getClothingDescription(file);
            setClothingDescription(description);
            setStep('CUSTOMIZE');
        } catch (err) {
            console.error(err);
            setError('Falha ao analisar a roupa. Tente outra imagem.');
            // Reset on error
            setUploadedImage(null);
            setImagePreviewUrl(null);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const handleAccessorySelect = (id: string) => {
        setSelectedAccessory(prev => {
            const noneOptionId = ACCESSORY_OPTIONS[0].id;
            // If "None" is clicked, it becomes the only selection.
            if (id === noneOptionId) {
                return [noneOptionId];
            }

            // Remove "None" if any other accessory is selected.
            let newSelection = prev.filter(item => item !== noneOptionId);

            const isSelected = newSelection.includes(id);
            if (isSelected) {
                // If it's already selected, unselect it.
                newSelection = newSelection.filter(item => item !== id);
            } else {
                // Otherwise, add it to the selection.
                newSelection.push(id);
            }

            // If everything is unselected, default back to "None".
            if (newSelection.length === 0) {
                return [noneOptionId];
            }

            return newSelection;
        });
    };


    const handleGenerateImage = async () => {
        if (!clothingDescription || !uploadedImage) {
            setError('Faltando descrição da roupa ou imagem original.');
            return;
        };
        setIsGenerating(true);
        setError(null);

        try {
            const aspectRatioMode = selectedAspectRatio === 'ar1' ? '9:16' : '16:9';
            const normalizedImageBlob = await normalizeImage(uploadedImage, aspectRatioMode);

            const options = {
                personaId: selectedPersona,
                hairId: selectedHair,
                environmentId: selectedEnvironment,
                lightingId: selectedLighting,
                phoneModeId: selectedPhoneMode,
                accessoryIds: selectedAccessory,
                mirrorInteractionId: selectedMirrorInteraction,
                postureId: selectedPosture,
                clothingDescription,
                aspectRatioId: selectedAspectRatio,
            };

            const imageB64 = await generateStyledImage(options, normalizedImageBlob);
            setGeneratedImage(imageB64);
            setStep('RESULT');
        } catch (err) {
            console.error(err);
            setError('Falha ao gerar a imagem. Por favor, tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${generatedImage}`;
        link.download = 'look_gerado.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setStep('UPLOAD');
        setUploadedImage(null);
        setImagePreviewUrl(null);
        setClothingDescription('');
        setGeneratedImage(null);
        setError(null);
    };

    const renderContent = () => {
        if (isProcessing) {
            return <LoadingSpinner message="Analisando sua roupa..." />;
        }
        if (isGenerating) {
            return <LoadingSpinner message="Gerando seu novo look... Aguarde, isso pode levar um momento." />;
        }
        
        switch (step) {
            case 'UPLOAD':
                return <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={imagePreviewUrl} />;
            case 'CUSTOMIZE':
                return (
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            {imagePreviewUrl && (
                                <>
                                    <h3 className="text-lg font-semibold text-center mb-2 text-gray-300">Sua Imagem</h3>
                                    <img src={imagePreviewUrl} alt="Preview" className="w-full h-auto object-contain rounded-lg shadow-lg mb-4" />
                                    <div className="bg-gray-800 p-3 rounded-lg text-xs text-gray-400">
                                        <p className="font-bold text-gray-300 mb-1">Descrição da Roupa (IA):</p>
                                        <p>{clothingDescription}</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="md:col-span-2">
                             <OptionSelector title="Persona" options={PERSONA_OPTIONS} selectedValue={selectedPersona} onSelect={setSelectedPersona} />
                             <OptionSelector title="Cabelo" options={HAIR_OPTIONS} selectedValue={selectedHair} onSelect={setSelectedHair} isMultiColumn={true} />
                             <OptionSelector title="Ambiente" options={ENVIRONMENT_OPTIONS} selectedValue={selectedEnvironment} onSelect={setSelectedEnvironment} isMultiColumn={true} />
                             <OptionSelector title="Iluminação" options={LIGHTING_OPTIONS} selectedValue={selectedLighting} onSelect={setSelectedLighting} isMultiColumn={true} />
                            
                             <div className='mt-12 pt-8 border-t border-gray-700'>
                                <h2 className='text-2xl font-bold mb-6 text-gray-100 text-center'>Detalhes da Cena</h2>
                                <OptionSelector title="Proporção da Imagem" options={ASPECT_RATIO_OPTIONS} selectedValue={selectedAspectRatio} onSelect={setSelectedAspectRatio} />
                                <OptionSelector title="Interação com o Espelho" options={MIRROR_INTERACTION_OPTIONS} selectedValue={selectedMirrorInteraction} onSelect={setSelectedMirrorInteraction} isMultiColumn={true} />
                                <OptionSelector title="Modo de Telefone" options={PHONE_MODE_OPTIONS} selectedValue={selectedPhoneMode} onSelect={setSelectedPhoneMode} isMultiColumn={true} />
                                <OptionSelector title="Postura" options={POSTURE_OPTIONS} selectedValue={selectedPosture} onSelect={setSelectedPosture} isMultiColumn={true} />
                                <OptionSelector title="Acessórios" options={ACCESSORY_OPTIONS} selectedValue={selectedAccessory} onSelect={handleAccessorySelect} isMultiColumn={true} />
                             </div>

                             <button onClick={handleGenerateImage} className="w-full flex items-center justify-center gap-2 mt-8 bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                                <Icon name="sparkles" className="w-6 h-6" />
                                Gerar Look
                             </button>
                        </div>
                    </div>
                );
            case 'RESULT':
                return generatedImage && <GeneratedImage imageData={generatedImage} onDownload={handleDownload} onReset={handleReset} />;
            default:
                return null;
        }
    }

    return (
        <div className="w-full flex flex-col items-center animate-fade-in">
            <header className="text-center mb-8 md:mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
                    LookSwap
                </h1>
                <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                    Transforme seus looks! Envie uma foto, personalize o cenário e a modelo, e deixe a nossa IA criar imagens incríveis.
                </p>
            </header>
            
            <main className="w-full max-w-6xl mx-auto bg-gray-800/50 rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-700">
                {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-6 text-center">{error}</div>}
                {renderContent()}
            </main>

             <footer className="text-center mt-8 text-gray-500 text-sm">
                <p>LookSwap MM Studio® • AI Fashion Engine</p>
                <button onClick={onNavigateToPricing} className="text-gray-400 hover:text-brand-blue hover:underline mt-2 transition-colors">
                    Ver Preços
                </button>
            </footer>
        </div>
    );
};