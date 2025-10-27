import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award,
  ArrowUp,
  ArrowDown,
  Minus,
  Lightbulb,
  BarChart3
} from "lucide-react";

interface MoodEntry {
  date: string;
  mood: number;
  notes?: string;
}

interface WeeklyStats {
  average: number;
  trend: "up" | "down" | "stable";
  streakDays: number;
}

export default function WellnessTracker() {
  const [currentMood, setCurrentMood] = useState([4]);
  
  // Mock data for demonstration
  const moodHistory: MoodEntry[] = [
    { date: "2024-09-16", mood: 4, notes: "Good day overall" },
    { date: "2024-09-15", mood: 3, notes: "Stressed about assignment" },
    { date: "2024-09-14", mood: 5, notes: "Excellent mood!" },
    { date: "2024-09-13", mood: 2, notes: "Feeling down" },
    { date: "2024-09-12", mood: 4, notes: "Normal day" },
    { date: "2024-09-11", mood: 4, notes: "Productive" },
    { date: "2024-09-10", mood: 3, notes: "Tired" },
  ];

  const weeklyStats: WeeklyStats = {
    average: 3.6,
    trend: "up",
    streakDays: 7
  };

  const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Excellent"];
  const moodEmojis = ["😔", "😕", "😐", "😊", "😄"];
  const moodColors = ["text-crisis", "text-orange-500", "text-yellow-500", "text-wellness", "text-emerald-500"];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUp className="h-4 w-4 text-wellness" />;
      case "down": return <ArrowDown className="h-4 w-4 text-crisis" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const insights = [
    {
      title: "Weekly Improvement",
      description: "Your mood has improved by 15% this week compared to last week.",
      type: "positive" as const
    },
    {
      title: "Consistency Pattern", 
      description: "You tend to feel better on weekends. Consider what makes weekends different.",
      type: "neutral" as const
    },
    {
      title: "Sleep Connection",
      description: "Days with lower mood often correlate with less than 7 hours of sleep.",
      type: "tip" as const
    }
  ];

  const goals = [
    { title: "Daily Check-ins", progress: 7, target: 7, completed: true },
    { title: "Average Mood 4+", progress: 3.6, target: 4, completed: false },
    { title: "Mindful Minutes", progress: 45, target: 60, completed: false }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-wellness" />
          Wellness Tracker
        </h1>
        <p className="text-muted-foreground">
          Monitor your mental health journey with insights and progress tracking
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-wellness mb-1">{weeklyStats.streakDays}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl font-bold text-primary">{weeklyStats.average}</span>
              {getTrendIcon(weeklyStats.trend)}
            </div>
            <div className="text-sm text-muted-foreground">Weekly Average</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">{moodHistory.length}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-calm mb-1">
              {Math.round((goals.filter(g => g.completed).length / goals.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Goals Met</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Mood</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        {/* Current Mood Tab */}
        <TabsContent value="current" className="space-y-6">
          <Card className="shadow-wellness">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-wellness">
                <Calendar className="h-5 w-5" />
                How are you feeling right now?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">
                  {moodEmojis[currentMood[0] - 1]}
                </div>
                <h3 className={`text-xl font-semibold ${moodColors[currentMood[0] - 1]}`}>
                  {moodLabels[currentMood[0] - 1]}
                </h3>
              </div>

              <div className="space-y-4">
                <Slider
                  value={currentMood}
                  onValueChange={setCurrentMood}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Neutral</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>

              <Button className="w-full bg-gradient-wellness text-white">
                Log Current Mood
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Mood History (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moodHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{moodEmojis[entry.mood - 1]}</div>
                      <div>
                        <div className="font-medium">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        {entry.notes && (
                          <div className="text-sm text-muted-foreground">{entry.notes}</div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className={moodColors[entry.mood - 1]}>
                      {moodLabels[entry.mood - 1]}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Lightbulb className={`h-5 w-5 mt-0.5 ${
                      insight.type === 'positive' ? 'text-wellness' :
                      insight.type === 'tip' ? 'text-accent' : 'text-primary'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Weekly Wellness Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {goal.completed ? (
                        <Award className="h-4 w-4 text-wellness" />
                      ) : (
                        <Target className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{goal.title}</span>
                    </div>
                    <Badge variant={goal.completed ? "default" : "outline"}>
                      {goal.progress}/{goal.target}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        goal.completed ? 'bg-wellness' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}