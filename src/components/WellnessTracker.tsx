import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar, Heart, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { day: "Mon", mood: 4 },
  { day: "Tue", mood: 3 },
  { day: "Wed", mood: 5 },
  { day: "Thu", mood: 2 },
  { day: "Fri", mood: 4 },
  { day: "Sat", mood: 5 },
  { day: "Sun", mood: 4 },
];

export function WellnessTracker() {
  const [currentMood, setCurrentMood] = useState([4]);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Excellent"];
  const moodEmojis = ["😔", "😕", "😐", "😊", "😄"];

  const handleCheckIn = () => {
    setHasCheckedIn(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Daily Check-in Card */}
      <Card className="shadow-wellness">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-wellness">
            <Calendar className="h-5 w-5" />
            Daily Wellness Check-In
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasCheckedIn ? (
            <>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  "Take a moment to reflect on how you're feeling today. Your mental health matters."
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {moodEmojis[currentMood[0] - 1]}
                  </div>
                  <p className="font-medium text-lg">
                    {moodLabels[currentMood[0] - 1]}
                  </p>
                </div>

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
                  <span>Excellent</span>
                </div>
              </div>

              <Button 
                onClick={handleCheckIn}
                className="w-full bg-gradient-wellness text-white"
              >
                Complete Check-In
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl">✨</div>
              <div>
                <h3 className="text-lg font-semibold text-wellness">
                  Thank you for checking in!
                </h3>
                <p className="text-muted-foreground">
                  Your mood today: {moodLabels[currentMood[0] - 1]}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setHasCheckedIn(false)}
                className="mt-4"
              >
                Check In Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Trends Chart */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-calm" />
            Weekly Mood Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="hsl(var(--calm))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--calm))", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Track your daily mood to identify patterns and progress
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}