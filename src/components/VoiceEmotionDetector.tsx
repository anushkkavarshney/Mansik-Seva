import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Heart, Brain, Zap, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  wellness_tips: string[];
  concern_level: 'low' | 'medium' | 'high';
}

interface VoiceEmotionDetectorProps {
  onEmotionDetected: (analysis: EmotionAnalysis) => void;
  onTranscriptionComplete: (text: string) => void;
  selectedLanguage: string;
}

export function VoiceEmotionDetector({ 
  onEmotionDetected, 
  onTranscriptionComplete, 
  selectedLanguage 
}: VoiceEmotionDetectorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionAnalysis | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  
  const { toast } = useToast();

  const emotionColors = {
    happy: 'text-green-600 bg-green-50',
    sad: 'text-blue-600 bg-blue-50',
    angry: 'text-red-600 bg-red-50',
    anxious: 'text-yellow-600 bg-yellow-50',
    neutral: 'text-gray-600 bg-gray-50',
    stressed: 'text-orange-600 bg-orange-50',
    excited: 'text-purple-600 bg-purple-50'
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happy': case 'excited': return <Heart className="h-4 w-4" />;
      case 'sad': case 'anxious': case 'stressed': return <AlertTriangle className="h-4 w-4" />;
      case 'angry': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const updateAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(Math.min(100, (average / 255) * 100));
    }
    if (isRecording) {
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    }
  };

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;

      // Set up audio analysis for visual feedback
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        processAudioForEmotion();
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      updateAudioLevel();

      toast({
        title: "Recording Started",
        description: "Speak naturally. I'm listening and analyzing your emotions.",
      });

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsRecording(false);
    setAudioLevel(0);
    setIsAnalyzing(true);
  };

  const processAudioForEmotion = async () => {
    if (audioChunksRef.current.length === 0) {
      setIsAnalyzing(false);
      return;
    }

    try {
      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert to base64 for API call
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        try {
          // Call emotion analysis API (this would be a real emotion detection service)
          // For now, we'll simulate emotion detection
          const mockAnalysis = await simulateEmotionAnalysis(base64Audio);
          
          setCurrentEmotion(mockAnalysis);
          onEmotionDetected(mockAnalysis);
          
          // Also transcribe the audio
          const transcription = await transcribeAudio(base64Audio);
          onTranscriptionComplete(transcription);
          
        } catch (error) {
          console.error('Error analyzing emotion:', error);
          toast({
            title: "Analysis Error",
            description: "Unable to analyze emotions. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsAnalyzing(false);
        }
      };
      
      reader.readAsDataURL(audioBlob);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      setIsAnalyzing(false);
    }
  };

  const simulateEmotionAnalysis = async (audioData: string): Promise<EmotionAnalysis> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emotions = ['happy', 'sad', 'anxious', 'neutral', 'stressed', 'excited', 'angry'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
    
    const wellnessTips = {
      sad: [
        "Try deep breathing exercises for 5 minutes",
        "Consider journaling your thoughts",
        "Reach out to a friend or counselor",
        "Take a short walk in nature"
      ],
      anxious: [
        "Practice the 4-7-8 breathing technique",
        "Try progressive muscle relaxation",
        "Ground yourself with the 5-4-3-2-1 method",
        "Consider mindfulness meditation"
      ],
      stressed: [
        "Take regular breaks from your tasks",
        "Try time management techniques",
        "Practice stress-relief exercises",
        "Consider talking to someone about your workload"
      ],
      angry: [
        "Take 10 deep breaths before responding",
        "Try physical exercise to release tension",
        "Practice expressing feelings constructively",
        "Consider what's really bothering you"
      ],
      happy: [
        "Great! Share your positive energy with others",
        "Practice gratitude for what's going well",
        "Use this positive momentum for challenging tasks"
      ],
      excited: [
        "Channel your energy into productive activities",
        "Share your enthusiasm with others",
        "Set goals while you're feeling motivated"
      ],
      neutral: [
        "This is a good baseline - maintain balance",
        "Consider activities that bring you joy",
        "Check in with yourself regularly"
      ]
    };

    return {
      emotion: randomEmotion,
      confidence,
      wellness_tips: wellnessTips[randomEmotion as keyof typeof wellnessTips] || [],
      concern_level: ['sad', 'anxious', 'stressed', 'angry'].includes(randomEmotion) ? 'medium' : 'low'
    };
  };

  const transcribeAudio = async (audioData: string): Promise<string> => {
    // This would normally call a speech-to-text API
    // For now, return a placeholder
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "I understand you're going through some challenges right now.";
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Voice Recording Controls */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="h-5 w-5 text-primary" />
            Voice Emotion Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isAnalyzing}
              size="lg"
              className={`w-16 h-16 rounded-full ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isRecording ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-sm font-medium">
                {isRecording ? 'Recording...' : isAnalyzing ? 'Analyzing...' : 'Tap to record'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isRecording ? 'Tap again to stop' : 'Voice emotion detection enabled'}
              </p>
            </div>

            {/* Audio Level Indicator */}
            {isRecording && (
              <div className="w-full max-w-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Audio Level</span>
                  <span>{Math.round(audioLevel)}%</span>
                </div>
                <Progress value={audioLevel} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Emotion Analysis */}
      {currentEmotion && (
        <Card className="shadow-soft border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              {getEmotionIcon(currentEmotion.emotion)}
              Detected Emotion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge 
                className={`${emotionColors[currentEmotion.emotion as keyof typeof emotionColors] || emotionColors.neutral} border-0`}
              >
                {currentEmotion.emotion.charAt(0).toUpperCase() + currentEmotion.emotion.slice(1)}
              </Badge>
              <span className="text-sm font-medium">{currentEmotion.confidence}% confident</span>
            </div>

            {currentEmotion.concern_level !== 'low' && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-primary">Wellness Suggestions:</h4>
                <ul className="space-y-1">
                  {currentEmotion.wellness_tips.slice(0, 3).map((tip, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}