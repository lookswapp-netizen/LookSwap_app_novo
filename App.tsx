import React, { useState } from 'react';
import { WizardStep, ImageState, SceneData, WizardData, AspectRatio, PersonaState } from './types';
import { StepUpload } from './components/StepUpload';
import { StepCrop } from './components/StepCrop';
import { StepPersona } from './components/StepPersona';
import { StepStyle } from './components/StepStyle';
import { StepGenerate } from './components/StepGenerate';
import { StepName } from './components/StepName';
import { StepSpeech } from './components/StepSpeech';
import { StepInstructions } from './components/StepInstructions';
import { StepResult } from './components/StepResult';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.UPLOAD);
  const [images, setImages] = useState<ImageState>({
    original: null,
    cropped: null,
    generated: null
  });
  const [sceneData, setSceneData] = useState<SceneData | null>(null);
  const [personaData, setPersonaData] = useState<PersonaState | null>(null);
  const [wizardData, setWizardData] = useState<WizardData>({
    aspectRatio: '9:16', // Valor padrão
    pieceName: '',
    speechQuantity: 3
  });

  const handleImageUpload = (base64: string, ratio: AspectRatio) => {
    setImages(prev => ({ ...prev, original: base64 }));
    setWizardData(prev => ({ ...prev, aspectRatio: ratio }));
    setCurrentStep(WizardStep.CROP);
  };

  const handleCropComplete = (croppedBase64: string) => {
    setImages(prev => ({ ...prev, cropped: croppedBase64 }));
    setCurrentStep(WizardStep.PERSONA);
  };

  const handlePersonaComplete = (data: PersonaState) => {
    setPersonaData(data);
    setCurrentStep(WizardStep.STYLE);
  };

  const handleStyleComplete = (data: SceneData) => {
    setSceneData(data);
    setCurrentStep(WizardStep.GENERATE);
  };

  const handleGenerateSuccess = (generatedImageUrl: string) => {
    setImages(prev => ({ ...prev, generated: generatedImageUrl }));
    setCurrentStep(WizardStep.NAME_PIECE);
  };

  const handleNameComplete = (name: string) => {
    setWizardData(prev => ({ ...prev, pieceName: name }));
    setCurrentStep(WizardStep.SPEECH_CONFIG);
  };

  const handleSpeechComplete = (quantity: number) => {
    setWizardData(prev => ({ ...prev, speechQuantity: quantity }));
    setCurrentStep(WizardStep.GENERATE_INSTRUCTIONS);
  };

  const handleInstructionsComplete = (instructions: string) => {
    setWizardData(prev => ({ ...prev, instructions }));
    setCurrentStep(WizardStep.FINAL_RESULT);
  };

  const handleRestart = () => {
    setImages({ original: null, cropped: null, generated: null });
    setSceneData(null);
    setPersonaData(null);
    setWizardData({ aspectRatio: '9:16', pieceName: '', speechQuantity: 3 });
    setCurrentStep(WizardStep.UPLOAD);
  };

  const goBack = () => {
    switch (currentStep) {
      case WizardStep.CROP: setCurrentStep(WizardStep.UPLOAD); break;
      case WizardStep.PERSONA: setCurrentStep(WizardStep.CROP); break;
      case WizardStep.STYLE: setCurrentStep(WizardStep.PERSONA); break;
      case WizardStep.GENERATE: setCurrentStep(WizardStep.STYLE); break;
      case WizardStep.NAME_PIECE: setCurrentStep(WizardStep.GENERATE); break;
      case WizardStep.SPEECH_CONFIG: setCurrentStep(WizardStep.NAME_PIECE); break;
      case WizardStep.GENERATE_INSTRUCTIONS: setCurrentStep(WizardStep.SPEECH_CONFIG); break;
      case WizardStep.FINAL_RESULT: setCurrentStep(WizardStep.GENERATE_INSTRUCTIONS); break;
      default: break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleRestart}>
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">LookSwap</h1>
          </div>
          <div className="hidden md:flex items-center gap-1">
             {[
               WizardStep.UPLOAD, WizardStep.CROP, WizardStep.PERSONA, WizardStep.STYLE, WizardStep.GENERATE, 
               WizardStep.NAME_PIECE, WizardStep.SPEECH_CONFIG, WizardStep.GENERATE_INSTRUCTIONS, WizardStep.FINAL_RESULT
             ].map((step, idx, arr) => {
                 const isActive = step === currentStep;
                 return (
                    <div key={step} className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-brand-500 w-4' : 'bg-slate-800'} ${idx < arr.length - 1 ? 'mr-1' : ''}`}></div>
                 )
             })}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none"></div>

        <div className="w-full h-full z-10 flex flex-col items-center justify-center py-4 md:py-8">
          {currentStep === WizardStep.UPLOAD && <StepUpload onImageUpload={handleImageUpload} />}
          {currentStep === WizardStep.CROP && images.original && (
            <StepCrop 
                imageSrc={images.original} 
                aspectRatio={wizardData.aspectRatio}
                onCropComplete={handleCropComplete} 
                onBack={goBack} 
            />
          )}
          {currentStep === WizardStep.PERSONA && (
            <StepPersona
                onNext={handlePersonaComplete}
                onBack={goBack}
            />
          )}
          {currentStep === WizardStep.STYLE && <StepStyle onNext={handleStyleComplete} onBack={goBack} />}
          {currentStep === WizardStep.GENERATE && images.cropped && (
              <StepGenerate 
                  croppedImage={images.cropped} 
                  sceneData={sceneData} 
                  personaData={personaData}
                  aspectRatio={wizardData.aspectRatio}
                  onGenerateSuccess={handleGenerateSuccess} 
                  onBack={goBack} 
                  onRestart={handleRestart} 
              />
          )}
          {currentStep === WizardStep.NAME_PIECE && <StepName onNext={handleNameComplete} />}
          {currentStep === WizardStep.SPEECH_CONFIG && <StepSpeech onNext={handleSpeechComplete} onBack={goBack} />}
          {currentStep === WizardStep.GENERATE_INSTRUCTIONS && sceneData && images.generated && (
            <StepInstructions 
                sceneData={sceneData} 
                pieceName={wizardData.pieceName} 
                speechQuantity={wizardData.speechQuantity}
                finalImageUrl={images.generated}
                onNext={handleInstructionsComplete} 
                onBack={goBack} 
            />
          )}
          {currentStep === WizardStep.FINAL_RESULT && images.generated && wizardData.instructions && <StepResult generatedImage={images.generated} instructions={wizardData.instructions} pieceName={wizardData.pieceName} onRestart={handleRestart} />}
        </div>
      </main>
    </div>
  );
};

export default App;
