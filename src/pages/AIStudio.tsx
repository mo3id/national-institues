
import React, { useState, useRef } from 'react';
import { Sparkles, Image as ImageIcon, Video, Search, BrainCircuit, Mic, Wand2, FileSearch, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { AspectRatio, ImageSize } from '@/types';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';

const AIStudio: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'edit' | 'generate' | 'video' | 'search' | 'analyze' | 'think'>('think');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Settings for Image Gen
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setSelectedFile(readerEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async () => {
    if (!prompt && !selectedFile) return;
    setLoading(true);
    setResult(null);
    setAudioUrl(null);

    try {
      let response: string | null = null;
      const base64Data = selectedFile?.split(',')[1] || '';

      switch (activeTool) {
        case 'edit':
          response = await geminiService.editImage(base64Data, prompt);
          break;
        case 'generate':
          response = await geminiService.generatePremiumImage(prompt, aspectRatio, imageSize);
          break;
        case 'video':
          // Need to handle video generation process
          response = await geminiService.generateVideoFromImage(base64Data, prompt, aspectRatio.includes('9:16') ? '9:16' : '16:9');
          break;
        case 'search':
          const searchData = await geminiService.searchEducationalInfo(prompt);
          response = searchData.text;
          break;
        case 'analyze':
          response = await geminiService.analyzeDocument(base64Data, prompt);
          break;
        case 'think':
          response = await geminiService.thinkComplexly(prompt);
          break;
      }

      setResult(response);
    } catch (error) {
      console.error(error);
      alert("An error occurred during AI processing.");
    } finally {
      setLoading(false);
    }
  };

  const playTTS = async (text: string) => {
    const audioBase64 = await geminiService.textToSpeech(text);
    if (audioBase64) {
      const binaryString = atob(audioBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(bytes.buffer);
      const frameCount = dataInt16.length;
      const buffer = audioCtx.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-12 text-center">
          <ScrollReveal direction="down">
            <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-2 mb-4 inline-flex">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Gemini 3.1 & Veo</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-black">NIS AI Studio</h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-500 mt-4 max-w-2xl text-lg font-medium">
              Advanced tools for parents, teachers, and staff to enhance productivity and content creation.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tool Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'think', label: 'Deep Thinking', icon: BrainCircuit, color: 'purple' },
              { id: 'search', label: 'Grounding Search', icon: Search, color: 'blue' },
              { id: 'generate', label: 'Premium Image', icon: ImageIcon, color: 'indigo' },
              { id: 'video', label: 'Animate Image (Veo)', icon: Video, color: 'rose' },
              { id: 'analyze', label: 'Doc Analysis', icon: FileSearch, color: 'emerald' },
              { id: 'edit', label: 'AI Photo Editor', icon: Wand2, color: 'orange' },
            ].map((tool, i) => (
              <ScrollReveal direction="right" delay={i * 0.05} key={tool.id}>
                <button
                  onClick={() => {
                    setActiveTool(tool.id as any);
                    setResult(null);
                    setPrompt('');
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTool === tool.id
                      ? `bg-${tool.color}-600 text-white shadow-lg scale-[1.02]`
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-100 shadow-sm'
                    }`}
                >
                  <tool.icon className={`h-5 w-5 ${activeTool === tool.id ? 'text-white' : `text-${tool.color}-600`}`} />
                  <span className="font-bold">{tool.label}</span>
                </button>
              </ScrollReveal>
            ))}
          </div>

          {/* Input/Output Area */}
          <div className="lg:col-span-3 space-y-6">
            <ScrollReveal direction="up" delay={0.3}>
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="space-y-6">
                  {/* Contextual Settings */}
                  {activeTool === 'generate' && (
                    <div className="flex flex-wrap gap-4 p-4 bg-indigo-50 rounded-2xl animate-fade-in">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-indigo-700 uppercase">Aspect Ratio</label>
                        <select
                          value={aspectRatio}
                          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                          className="bg-white border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-bold"
                        >
                          <option value="1:1">1:1 (Square)</option>
                          <option value="16:9">16:9 (Landscape)</option>
                          <option value="9:16">9:16 (Portrait)</option>
                          <option value="21:9">21:9 (Ultrawide)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-indigo-700 uppercase">Quality</label>
                        <select
                          value={imageSize}
                          onChange={(e) => setImageSize(e.target.value as ImageSize)}
                          className="bg-white border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-bold"
                        >
                          <option value="1K">Standard (1K)</option>
                          <option value="2K">High (2K)</option>
                          <option value="4K">Ultra (4K)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {['edit', 'video', 'analyze'].includes(activeTool) && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center hover:border-blue-400 cursor-pointer transition-all bg-gray-50/50 group animate-fade-in"
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                      {selectedFile ? (
                        <div className="relative inline-block group">
                          <img src={selectedFile} alt="Preview" className="max-h-48 rounded-xl shadow-md transition-transform group-hover:scale-[1.02]" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl text-white transition-opacity font-bold uppercase text-xs">
                            Change Image
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ImageIcon className="h-8 w-8 text-blue-600" />
                          </div>
                          <p className="text-gray-700 font-bold uppercase tracking-widest text-xs">Click to upload or drag & drop</p>
                          <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest">Support: PNG, JPG, WEBP (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={
                        activeTool === 'think' ? "Explain the benefits of the NIS curriculum compared to national standards..." :
                          activeTool === 'search' ? "What are the latest changes to the Thanaweya Amma system for 2025?" :
                            activeTool === 'edit' ? "Remove the blurry person from the background..." :
                              "Describe what you want to achieve..."
                      }
                      className="w-full h-32 bg-gray-50 border border-gray-200 rounded-2xl p-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none font-medium"
                    />
                  </div>

                  <button
                    onClick={handleAction}
                    disabled={loading}
                    className={`w-full py-5 rounded-2xl text-white font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]'
                      }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Processing with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        <span>Run AI Task</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Output Display */}
            {(result || loading) && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fade-up">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">AI Studio Output</span>
                  {result && !result.startsWith('data:') && !result.startsWith('blob:') && (
                    <button onClick={() => playTTS(result)} className="text-blue-600 hover:text-blue-700 flex items-center space-x-2 transition-colors">
                      <Mic className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Listen Audio</span>
                    </button>
                  )}
                </div>
                <div className="p-8">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-600 animate-pulse" />
                      </div>
                      <p className="text-blue-900 font-black uppercase tracking-[0.2em] text-xs">Generating Perfection...</p>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      {result?.startsWith('data:image') ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-100 p-2 rounded-3xl shadow-inner mb-6">
                            <img src={result} alt="AI Generated" className="max-w-full rounded-2xl shadow-lg border border-white" />
                          </div>
                          <a href={result} download="nis-ai-image.png" className="bg-blue-900 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-blue-800 transition-all shadow-lg active:scale-95">Download High Resolution</a>
                        </div>
                      ) : result?.startsWith('blob:') ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-100 p-2 rounded-3xl shadow-inner mb-6">
                            <video src={result} controls className="max-w-full rounded-2xl shadow-lg border border-white" />
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Video generated with Veo 3.1 Neural Engine</p>
                        </div>
                      ) : (
                        <div className="prose prose-blue max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed font-serif text-lg">
                          {result}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AIStudio;
