import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, EditAgent } from '../types';
import { UserIcon, AssistantIcon, SendIcon, ChevronDownIcon, ChevronUpIcon, XCircleIcon, ExpandIcon, DownloadIcon, WatermarkIcon } from './icons';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';
import { ScrollArea } from './ui/ScrollArea';
import { EDIT_AGENTS } from '../constants';

const EditPresets: React.FC<{ onPresetSelect: (agent: EditAgent) => void, isDisabled: boolean }> = ({ onPresetSelect, isDisabled }) => {
    const interiorAgents = EDIT_AGENTS.filter(a => a.category === 'Interior');
    const exteriorAgents = EDIT_AGENTS.filter(a => a.category === 'Exterior');

    return (
        <div className="mb-4 space-y-4">
            <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 px-1">Interior</h4>
                <div className="grid grid-cols-2 gap-2">
                    {interiorAgents.map(agent => (
                        <Button
                            key={agent.id}
                            onClick={() => onPresetSelect(agent)}
                            variant="ghost"
                            className="flex flex-col items-center justify-center h-20 w-full p-2 text-center group"
                            title={agent.description}
                            disabled={isDisabled}
                        >
                            <agent.icon className="w-6 h-6 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                            <span className="text-xs mt-2 text-gray-400 group-hover:text-white transition-colors leading-tight">{agent.name}</span>
                        </Button>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 px-1">Exterior</h4>
                <div className="grid grid-cols-2 gap-2">
                    {exteriorAgents.map(agent => (
                        <Button
                            key={agent.id}
                            onClick={() => onPresetSelect(agent)}
                            variant="ghost"
                            className="flex flex-col items-center justify-center h-20 w-full p-2 text-center group"
                            title={agent.description}
                            disabled={isDisabled}
                        >
                            <agent.icon className="w-6 h-6 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                            <span className="text-xs mt-2 text-gray-400 group-hover:text-white transition-colors leading-tight">{agent.name}</span>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

const ImageActions: React.FC<{onDownload: () => void, onViewFullScreen: () => void, onAddWatermark?: () => void}> = ({ onDownload, onViewFullScreen, onAddWatermark }) => (
    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {onAddWatermark && (
            <Button onClick={onAddWatermark} variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50" title="Add Watermark">
                <WatermarkIcon className="w-4 h-4 text-white" />
            </Button>
        )}
        <Button onClick={onViewFullScreen} variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50" title="Full Screen">
            <ExpandIcon className="w-4 h-4 text-white" />
        </Button>
        <Button onClick={onDownload} variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50" title="Download Image">
            <DownloadIcon className="w-4 h-4 text-white" />
        </Button>
    </div>
);

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onPresetSubmit: (prompt: string, userMessage: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
  style?: React.CSSProperties;
  onViewFullScreen: (imageUrl: string) => void;
  onDownloadImage: (imageUrl: string, filename: string) => void;
  onAddWatermark: (versionId: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
    messages, onSendMessage, onPresetSubmit, isLoading, isDisabled, style, 
    onViewFullScreen, onDownloadImage, onAddWatermark
}) => {
  const [input, setInput] = useState('');
  const [presetsVisible, setPresetsVisible] = useState(true);
  const [stagedPreset, setStagedPreset] = useState<EditAgent | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePresetSelect = (agent: EditAgent) => {
    setStagedPreset(agent);
    setInput('');
  };

  const handleClearStagedPreset = () => {
    setStagedPreset(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isDisabled) return;

    if (stagedPreset) {
      if (stagedPreset.requiresInput && !input.trim()) return;
      
      const finalPrompt = stagedPreset.prompt.replace('{userInput}', input.trim());
      const userMessage = `${stagedPreset.name}${input.trim() ? `: ${input.trim()}` : ''}`;
      
      onPresetSubmit(finalPrompt, userMessage);
      setStagedPreset(null);
      setInput('');
    } else if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const placeholder = stagedPreset 
    ? stagedPreset.inputPlaceholder 
    : (isDisabled ? "Upload an image first" : "Describe your edit...");

  const isSendDisabled = isLoading || isDisabled || 
    (stagedPreset ? (stagedPreset.requiresInput && !input.trim()) : !input.trim());


  return (
    <aside style={style} className="flex flex-col bg-gray-800/50 border-r border-gray-700 flex-shrink-0">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Conversational Edit</h2>
      </div>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && <Avatar><AssistantIcon className="w-6 h-6" /></Avatar>}
              <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                <p className="text-sm break-words">{message.content}</p>
                {message.image && (
                  <div className="mt-3 relative group">
                    <img src={message.image} alt="Generated edit" className="rounded-lg border border-gray-600" />
                    <ImageActions 
                        onViewFullScreen={() => onViewFullScreen(message.image!)}
                        onDownload={() => onDownloadImage(message.image!, `chat-image-${message.id.slice(-6)}.png`)}
                        onAddWatermark={message.versionId ? () => onAddWatermark(message.versionId!) : undefined}
                    />
                  </div>
                )}
              </div>
              {message.role === 'user' && <Avatar><UserIcon className="w-6 h-6" /></Avatar>}
            </div>
          ))}
           {isLoading && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex items-start gap-3">
                <Avatar><AssistantIcon className="w-6 h-6" /></Avatar>
                <div className="max-w-xs md:max-w-sm rounded-2xl px-4 py-3 bg-gray-700 text-gray-200 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
           )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        {presetsVisible && <EditPresets onPresetSelect={handlePresetSelect} isDisabled={isDisabled} />}
        
        {stagedPreset && (
          <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-md mb-2 text-sm">
            <stagedPreset.icon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <span className="font-medium flex-grow truncate">Editing: {stagedPreset.name}</span>
            <Button onClick={handleClearStagedPreset} variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
              <XCircleIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="flex items-center gap-3">
            <form onSubmit={handleSubmit} className="flex-grow flex items-center gap-3">
                <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    disabled={isLoading || isDisabled}
                    className="flex-grow"
                />
                <Button type="submit" disabled={isSendDisabled}>
                    <SendIcon className="w-5 h-5" />
                </Button>
            </form>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setPresetsVisible(!presetsVisible)}
                title={presetsVisible ? 'Hide Presets' : 'Show Presets'}
            >
                {presetsVisible ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
            </Button>
        </div>
      </div>
    </aside>
  );
};
