import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Star, 
  MessageCircle, 
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Search,
  Filter
} from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  department: string;
  year: string;
  specialties: string[];
  rating: number;
  totalSessions: number;
  matchPercentage: number;
  bio: string;
  isAvailable: boolean;
}

interface Session {
  id: string;
  mentorName: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "pending";
  type: string;
}

export default function PeerMentorship() {
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [connectionRequests, setConnectionRequests] = useState<string[]>([]);

  const availableMentors: Mentor[] = [
    {
      id: "1",
      name: "Priya Sharma",
      department: "Psychology",
      year: "Final Year",
      specialties: ["Academic Stress", "Social Anxiety", "Time Management"],
      rating: 4.8,
      totalSessions: 45,
      matchPercentage: 92,
      bio: "Psychology final year student with experience in peer counseling and meditation practices. I'm passionate about helping fellow students navigate academic challenges in Indian educational system.",
      isAvailable: true
    },
    {
      id: "2", 
      name: "Rahul Kumar",
      department: "Computer Science",
      year: "M.Tech 2nd Year",
      specialties: ["Imposter Syndrome", "Career Anxiety", "Work-Life Balance"],
      rating: 4.9,
      totalSessions: 67,
      matchPercentage: 87,
      bio: "M.Tech student in Computer Science who understands the unique pressures of engineering studies in India. Here to support your academic and personal growth through cultural understanding.",
      isAvailable: true
    },
    {
      id: "3",
      name: "Sneha Patel",
      department: "English Literature",
      year: "3rd Year",
      specialties: ["Depression Support", "Creative Expression", "Self-Esteem"],
      rating: 4.7,
      totalSessions: 32,
      matchPercentage: 84,
      bio: "English Literature student with training in active listening and emotional support. I believe in the healing power of Indian cultural arts and creative expression.",
      isAvailable: false
    },
    {
      id: "4",
      name: "Vikram Singh",
      department: "Management Studies",
      year: "Final Year", 
      specialties: ["Performance Pressure", "Family Expectations", "Goal Setting"],
      rating: 4.6,
      totalSessions: 28,
      matchPercentage: 79,
      bio: "Management student focused on handling Indian family expectations and career pressure. Let's work together to achieve your goals while maintaining mental wellness.",
      isAvailable: true
    }
  ];

  const mySessions: Session[] = [
    {
      id: "1",
      mentorName: "Priya Sharma",
      date: "2024-09-20",
      time: "3:00 PM",
      status: "upcoming",
      type: "Academic Support"
    },
    {
      id: "2",
      mentorName: "Rahul Kumar", 
      date: "2024-09-18",
      time: "2:00 PM",
      status: "completed",
      type: "Career Discussion"
    },
    {
      id: "3",
      mentorName: "Priya Sharma",
      date: "2024-09-15",
      time: "4:00 PM", 
      status: "completed",
      type: "Stress Management"
    }
  ];

  const handleRequestConnection = (mentorId: string) => {
    setConnectionRequests([...connectionRequests, mentorId]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-primary text-white";
      case "completed": return "bg-wellness text-white";
      case "pending": return "bg-yellow-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Users className="h-8 w-8 text-accent" />
          Peer Mentorship
        </h1>
        <p className="text-muted-foreground">
          Connect with trained peer mentors for support, guidance, and shared experiences
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-accent">3</div>
            <div className="text-sm text-muted-foreground">Active Mentors</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-wellness" />
            <div className="text-2xl font-bold text-wellness">4.8</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-calm" />
            <div className="text-2xl font-bold text-calm">24h</div>
            <div className="text-sm text-muted-foreground">Avg Response</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="connections">My Connections</TabsTrigger>
        </TabsList>

        {/* Browse Mentors Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter by Specialty
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Search className="h-4 w-4" />
                  Department
                </Button>
                <Badge variant="secondary" className="ml-auto">
                  {availableMentors.filter(m => m.isAvailable).length} Available Now
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Mentor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableMentors.map((mentor) => (
              <Card key={mentor.id} className="shadow-soft hover:shadow-wellness transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{mentor.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {mentor.matchPercentage}% match
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {mentor.department} • {mentor.year}
                      </p>
                      
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{mentor.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({mentor.totalSessions} sessions)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={mentor.isAvailable ? "default" : "secondary"}>
                        {mentor.isAvailable ? "Available" : "Busy"}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {mentor.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mentor.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    onClick={() => handleRequestConnection(mentor.id)}
                    disabled={!mentor.isAvailable || connectionRequests.includes(mentor.id)}
                    className="w-full"
                  >
                    {connectionRequests.includes(mentor.id) ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Request Sent
                      </>
                    ) : (
                      <>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Request Connection
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Session History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mySessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {session.mentorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="font-medium">{session.mentorName}</div>
                        <div className="text-sm text-muted-foreground">{session.type}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()} at {session.time}
                        </div>
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(session.status)}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Connections Tab */}
        <TabsContent value="connections" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-wellness" />
                Active Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableMentors.slice(0, 3).map((mentor) => (
                  <Card key={mentor.id} className="border-primary/20">
                    <CardContent className="p-4 text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold text-lg">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="font-semibold mb-1">{mentor.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{mentor.department}</p>
                      
                      <div className="flex justify-center gap-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {availableMentors.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active connections yet</p>
                  <p className="text-sm">Start by browsing and requesting connections with mentors</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}