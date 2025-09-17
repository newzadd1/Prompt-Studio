// Fix: Replaced placeholder content with a functional React component.
// This resolves the errors "Cannot find name 'full'", "Cannot find name 'contents'",
// "Cannot find name 'of'", "Cannot find name 'App'", and the module resolution error in index.tsx.
import React, { useState, useEffect } from 'react';
import { Project, Scene, Mode } from './types';
import { STYLE_PRESETS, CHARACTER_PRESETS } from './constants';
import { enhanceSceneDescription, generateHollywoodPrompt, completeCharacterDescription } from './services/geminiService';
import { SparklesIcon, CopyIcon, SpinnerIcon, PlusIcon, XMarkIcon, SaveIcon, LibraryIcon } from './components/Icons';

const App: React.FC = () => {
  const [project, setProject] = useState<Project>({
    id: '1',
    name: 'My Awesome Project',
    mode: Mode.Image,
    stylePreset: STYLE_PRESETS[0],
    characterSceneCap: 'A lone wanderer in a futuristic city.',
    isNsfw: false,
    scenes: [{
      description: 'The wanderer stands on a rooftop overlooking the neon-lit city at night, rain pouring down.',
      action: 'Looking down at the streets below.',
      mood: 'Melancholic, contemplative',
      cta: '',
      cameraAngle: 'High-angle shot, looking down over the shoulder.'
    }],
    generatedPrompt: '',
  });

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isCompletingChar, setCompletingChar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('');

  const LOCAL_STORAGE_KEY = 'hollywood_prompt_project';

  const loadingMessages = [
    'Consulting with script doctors...',
    'Lighting the set...',
    'Rolling camera...',
    'Crafting the perfect shot...',
    'And... action!'
  ];

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (isLoading) {
      let messageIndex = 0;
      setLoadingText(loadingMessages[messageIndex]);
      intervalId = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[messageIndex]);
      }, 2500);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoading]);

  const handleProjectChange = (field: keyof Omit<Project, 'scenes' | 'id'>, value: any) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };

  const handleSceneChange = (index: number, field: keyof Scene, value: string) => {
    setProject(prev => {
      const newScenes = [...prev.scenes];
      newScenes[index] = { ...newScenes[index], [field]: value };
      return { ...prev, scenes: newScenes };
    });
  };

  const handleAddScene = () => {
    const newScene: Scene = {
      description: '',
      action: '',
      mood: '',
      cta: '',
      cameraAngle: ''
    };
    setProject(prev => {
        const newScenes = [...prev.scenes, newScene];
        setActiveSceneIndex(newScenes.length - 1);
        return { ...prev, scenes: newScenes };
    });
  };

  const handleRemoveScene = (indexToRemove: number) => {
    if (project.scenes.length <= 1) return; // Prevent removing the last scene
    setProject(prev => {
      const newScenes = prev.scenes.filter((_, i) => i !== indexToRemove);
      if (activeSceneIndex >= indexToRemove) {
        setActiveSceneIndex(Math.max(0, activeSceneIndex - 1));
      }
      return { ...prev, scenes: newScenes };
    });
  };

  const activeScene = project.scenes[activeSceneIndex];

  const handleEnhanceDescription = async () => {
    if (!activeScene?.description) return;
    setIsEnhancing(true);
    setError(null);
    try {
      const enhancedDesc = await enhanceSceneDescription(activeScene.description);
      handleSceneChange(activeSceneIndex, 'description', enhancedDesc);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred during enhancement.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCompleteCharacter = async () => {
    if (!project.characterSceneCap) return;
    setCompletingChar(true);
    setError(null);
    try {
        const completion = await completeCharacterDescription(project.characterSceneCap);
        handleProjectChange('characterSceneCap', project.characterSceneCap + completion);
    } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred during character completion.');
    } finally {
        setCompletingChar(false);
    }
  };
  
  const handleGeneratePrompt = async () => {
    if (!activeScene) return;
    setIsLoading(true);
    setError(null);
    try {
      const prompt = await generateHollywoodPrompt(project, activeScene);
      setProject(prev => ({ ...prev, generatedPrompt: prompt }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred during prompt generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (project.generatedPrompt) {
      navigator.clipboard.writeText(project.generatedPrompt);
      // Consider adding a toast notification for user feedback
    }
  };
  
  const handleSaveProject = () => {
    try {
      const projectJson = JSON.stringify(project);
      localStorage.setItem(LOCAL_STORAGE_KEY, projectJson);
      alert('Project saved successfully!');
    } catch (err) {
      console.error("Failed to save project:", err);
      setError("Could not save the project to local storage.");
    }
  };

  const handleLoadProject = () => {
    try {
      const savedProjectJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedProjectJson) {
        const savedProject = JSON.parse(savedProjectJson);
        setProject(savedProject);
        setActiveSceneIndex(0); // Reset to the first scene for consistency
        setError(null);
        alert('Project loaded successfully!');
      } else {
        setError('No saved project found in local storage.');
      }
    } catch (err) {
      console.error("Failed to load project:", err);
      setError("Could not load the project. The saved data might be corrupted.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-purple-400 tracking-tight">Prompt Studio</h1>
          <p className="text-gray-400 mt-2">Craft the perfect prompt for your next masterpiece.</p>
        </header>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="space-y-8">
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
                  <h2 className="text-2xl font-semibold text-purple-300">Project Settings</h2>
                  <div className="flex items-center gap-2">
                      <button onClick={handleSaveProject} className="p-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors" title="Save Project">
                          <SaveIcon className="w-5 h-5" />
                      </button>
                      <button onClick={handleLoadProject} className="p-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors" title="Load Project">
                          <LibraryIcon className="w-5 h-5" />
                      </button>
                  </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                  <input type="text" id="projectName" value={project.name} onChange={(e) => handleProjectChange('name', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mode</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(Mode).map(mode => (
                      <button key={mode} onClick={() => handleProjectChange('mode', mode)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${project.mode === mode ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="stylePreset" className="block text-sm font-medium text-gray-300 mb-1">Style Preset</label>
                  <select id="stylePreset" value={project.stylePreset.name} onChange={(e) => handleProjectChange('stylePreset', STYLE_PRESETS.find(p => p.name === e.target.value) || STYLE_PRESETS[0])} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500">
                    {STYLE_PRESETS.map(preset => (
                      <option key={preset.name} value={preset.name}>{preset.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                    <label htmlFor="charCap" className="block text-sm font-medium text-gray-300 mb-1">Characters & Setting Overview</label>
                    <select 
                        onChange={(e) => {
                            if (e.target.value) {
                                handleProjectChange('characterSceneCap', e.target.value);
                            }
                        }} 
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 mb-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        {CHARACTER_PRESETS.map(preset => (
                            <option key={preset.name} value={preset.description}>{preset.name}</option>
                        ))}
                    </select>
                    <div className="relative">
                        <textarea 
                            id="charCap" 
                            rows={3} 
                            value={project.characterSceneCap} 
                            onChange={(e) => handleProjectChange('characterSceneCap', e.target.value)} 
                            className={`w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 pr-10 transition-shadow ${isCompletingChar ? 'animate-pulse-glow' : ''}`}
                            placeholder="e.g., A grizzled space marine on a desolate alien planet."
                        ></textarea>
                         <button onClick={handleCompleteCharacter} disabled={isCompletingChar || isLoading} className="absolute top-2 right-2 p-1.5 bg-purple-600 hover:bg-purple-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed" title="AI ช่วยคิดต่อ">
                            {isCompletingChar ? <SpinnerIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
              </div>
            </section>
            
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-purple-300 border-b border-gray-700 pb-2">Scene Details</h2>
               <div className="flex items-center border-b border-gray-700 mb-6">
                {project.scenes.map((_, index) => (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => setActiveSceneIndex(index)}
                      className={`px-3 py-3 text-sm font-medium transition-colors focus:outline-none ${
                        activeSceneIndex === index
                          ? 'text-purple-300 border-b-2 border-purple-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      aria-current={activeSceneIndex === index ? 'page' : undefined}
                    >
                      Scene {index + 1}
                    </button>
                    {project.scenes.length > 1 && (
                      <button
                        onClick={() => handleRemoveScene(index)}
                        className="absolute top-1 right-0 p-0.5 bg-gray-700 rounded-full text-gray-400 hover:text-white hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        aria-label={`Remove Scene ${index + 1}`}
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={handleAddScene} className="ml-2 p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors" aria-label="Add new scene">
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>

               <div className="space-y-4">
                  <div>
                      <label htmlFor="sceneDesc" className="block text-sm font-medium text-gray-300 mb-1">Scene Description</label>
                      <div className="relative">
                          <textarea id="sceneDesc" rows={4} value={activeScene?.description || ''} onChange={(e) => handleSceneChange(activeSceneIndex, 'description', e.target.value)} className={`w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 pr-10 transition-shadow ${isEnhancing ? 'animate-pulse-glow' : ''}`} placeholder="A brief idea of the scene."></textarea>
                          <button onClick={handleEnhanceDescription} disabled={isEnhancing || isLoading} className="absolute top-2 right-2 p-1.5 bg-purple-600 hover:bg-purple-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed" title="Enhance with AI">
                              {isEnhancing ? <SpinnerIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                          </button>
                      </div>
                  </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="sceneAction" className="block text-sm font-medium text-gray-300 mb-1">Action</label>
                          <input type="text" id="sceneAction" value={activeScene?.action || ''} onChange={(e) => handleSceneChange(activeSceneIndex, 'action', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" />
                      </div>
                      <div>
                          <label htmlFor="sceneMood" className="block text-sm font-medium text-gray-300 mb-1">Mood</label>
                          <input type="text" id="sceneMood" value={activeScene?.mood || ''} onChange={(e) => handleSceneChange(activeSceneIndex, 'mood', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" />
                      </div>
                      <div>
                          <label htmlFor="sceneCta" className="block text-sm font-medium text-gray-300 mb-1">Call to Action (Theme)</label>
                          <input type="text" id="sceneCta" value={activeScene?.cta || ''} onChange={(e) => handleSceneChange(activeSceneIndex, 'cta', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" />
                      </div>
                       <div>
                          <label htmlFor="sceneCamera" className="block text-sm font-medium text-gray-300 mb-1">Camera Angle</label>
                          <input type="text" id="sceneCamera" value={activeScene?.cameraAngle || ''} onChange={(e) => handleSceneChange(activeSceneIndex, 'cameraAngle', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500" />
                      </div>
                   </div>
                </div>
            </section>
          </div>

          {/* Right Column: Output */}
          <div className="space-y-8">
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
              <h2 className="text-2xl font-semibold mb-4 text-purple-300 border-b border-gray-700 pb-2">Generated Prompt</h2>
              <div className="flex-grow mt-4 relative">
                 <div
                  aria-live="polite"
                  className="w-full h-full bg-gray-900 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 whitespace-pre-wrap overflow-y-auto"
                  style={{ minHeight: '200px' }}
                >
                  {isLoading ? (
                    <span className="text-gray-400 blinking-cursor">{loadingText}</span>
                  ) : (
                    project.generatedPrompt || <span className="text-gray-500">Your generated prompt will appear here...</span>
                  )}
                </div>
                <button
                  onClick={handleCopyToClipboard}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Copy to clipboard"
                  disabled={!project.generatedPrompt || isLoading}
                  aria-label="Copy generated prompt"
                >
                  <CopyIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleGeneratePrompt}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <SpinnerIcon className="w-5 h-5" />
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      Generate Hollywood Prompt
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;