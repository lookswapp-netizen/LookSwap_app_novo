import React, { useState } from 'react';
import { Icon } from './Icon';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose }) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleDeploy = () => {
    // Simulate deployment
    setIsDeploying(true);
    console.log(`Deploying to project: ${selectedProject}`);
    setTimeout(() => {
      setIsDeploying(false);
      onClose();
    }, 2000); // Simulate a 2-second deployment
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      style={{ animationDuration: '0.2s' }}
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <Icon name="x-mark" className="w-6 h-6" />
        </button>

        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white mb-2">Deploy app on Google Cloud</h2>
          <p className="text-gray-400 mb-6">
            Deploy your app as a Cloud Run Service. The app will be accessible via a public URL. Your API key will not be exposed in the app, but will be used by the application.
          </p>

          <label htmlFor="gcp-project-select" className="text-gray-300 mb-2 font-medium">
            Select a Google Cloud project to proceed:
          </label>
          <div className="relative">
            <select
              id="gcp-project-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="" disabled>Select a Cloud Project</option>
              {/* In a real app, this would be populated dynamically */}
              <option value="project-lookswap-dev">project-lookswap-dev</option>
              <option value="project-lookswap-prod">project-lookswap-prod</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <button
              onClick={handleDeploy}
              disabled={!selectedProject || isDeploying}
              className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-500"
            >
              {isDeploying ? 'Deploying...' : 'Deploy app'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};