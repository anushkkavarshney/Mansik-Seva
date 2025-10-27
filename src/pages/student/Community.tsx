import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  PenTool, 
  Heart, 
  MessageCircle, 
  Share2, 
  BookOpen, 
  Sparkles, 
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  User,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
    id: string;
  };
  likes: number;
  comments: number;
  tags: string[];
  created_at: string;
  is_ai_assisted: boolean;
  read_time: number;
}

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  created_at: string;
  likes: number;
}

export default function CommunityPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Create Post Form State
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    use_ai_assistance: false
  });
  
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);

  const popularTags = [
    "Mental Health", "Anxiety", "Depression", "Self Care", "Motivation", 
    "Study Tips", "Relationships", "Stress Management", "Personal Growth", "Mindfulness"
  ];

  // Mock data for demonstration
  const mockPosts: BlogPost[] = [
    {
      id: "1",
      title: "My Journey Through Anxiety: Finding Light in Dark Moments",
      content: "When I first started experiencing anxiety attacks during my sophomore year, I felt completely alone. The racing heart, sweating palms, and that overwhelming feeling of dread became my constant companions...",
      excerpt: "A personal story about overcoming anxiety and finding healthy coping mechanisms during college.",
      author: {
        name: "Sarah M.",
        avatar: "",
        id: "user1"
      },
      likes: 47,
      comments: 12,
      tags: ["Anxiety", "Personal Growth", "Mental Health"],
      created_at: "2024-01-15",
      is_ai_assisted: false,
      read_time: 5
    },
    {
      id: "2", 
      title: "5 Mindfulness Techniques That Actually Work for Busy Students",
      content: "As a pre-med student juggling multiple responsibilities, I discovered these practical mindfulness techniques that fit into even the busiest schedules...",
      excerpt: "Practical mindfulness strategies for students with packed schedules, written with AI assistance.",
      author: {
        name: "Alex K.",
        avatar: "",
        id: "user2"
      },
      likes: 89,
      comments: 23,
      tags: ["Mindfulness", "Study Tips", "Stress Management"],
      created_at: "2024-01-12",
      is_ai_assisted: true,
      read_time: 7
    },
    {
      id: "3",
      title: "The Power of Peer Support: How This Community Changed My Life",
      content: "I never thought sharing my struggles online would lead to such meaningful connections. This community has taught me that vulnerability is strength...",
      excerpt: "Reflecting on the transformative power of peer support and community connection.",
      author: {
        name: "Jordan P.",
        avatar: "",
        id: "user3"
      },
      likes: 156,
      comments: 34,
      tags: ["Relationships", "Personal Growth", "Mental Health"],
      created_at: "2024-01-10",
      is_ai_assisted: false,
      read_time: 6
    }
  ];

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const generateWithAI = async () => {
    if (!newPost.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your blog post before using AI assistance.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingWithAI(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-content', {
        body: { 
          title: newPost.title,
          existing_content: newPost.content,
          style: "personal_journey",
          tone: "supportive"
        }
      });

      if (error) throw error;

      const generatedContent = data?.content || `Based on your title "${newPost.title}", here's some AI-generated content to help you get started:

This journey hasn't been easy, but I want to share what I've learned along the way. Sometimes the smallest steps forward can make the biggest difference in our mental health journey.

I've discovered that being open about our struggles not only helps us heal but also creates space for others to share their own experiences. Every story matters, and every voice in this community contributes to our collective healing.

Through the challenges I've faced, I've learned the importance of:
- Taking things one day at a time
- Celebrating small victories
- Reaching out for support when needed
- Practicing self-compassion

I hope my experience can offer some comfort or insight to anyone going through similar challenges. Remember, you're not alone in this journey.`;

      setNewPost(prev => ({
        ...prev,
        content: prev.content + "\n\n" + generatedContent,
        use_ai_assistance: true
      }));

      toast({
        title: "AI Content Generated",
        description: "AI has added content to help enhance your blog post. Feel free to edit and personalize it.",
      });

    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "AI Generation Failed",
        description: "Unable to generate content. Please try again or continue writing manually.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  const publishPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Incomplete Post",
        description: "Please add both a title and content to publish your post.",
        variant: "destructive",
      });
      return;
    }

    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      excerpt: newPost.content.substring(0, 150) + "...",
      author: {
        name: "You",
        avatar: "",
        id: "current_user"
      },
      likes: 0,
      comments: 0,
      tags: newPost.tags,
      created_at: new Date().toISOString().split('T')[0],
      is_ai_assisted: newPost.use_ai_assistance,
      read_time: Math.ceil(newPost.content.split(' ').length / 200)
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: "", content: "", tags: [], use_ai_assistance: false });
    setIsCreating(false);

    toast({
      title: "Post Published!",
      description: "Your blog post has been shared with the community.",
    });
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const addComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      author: { name: "You", avatar: "" },
      created_at: new Date().toISOString(),
      likes: 0
    };
    
    setComments(prev => [...prev, newComment]);
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => post.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setIsCreating(false)}
            className="mb-4"
          >
            ← Back to Community
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <PenTool className="h-8 w-8 text-primary" />
            Share Your Journey
          </h1>
          <p className="text-muted-foreground">
            Write about your mental health journey and connect with others who understand
          </p>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Create Blog Post
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Post Title</label>
              <Input
                placeholder="Share your story title..."
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Content</label>
                <Button
                  onClick={generateWithAI}
                  disabled={isGeneratingWithAI}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGeneratingWithAI ? "Generating..." : "AI Assist"}
                </Button>
              </div>
              <Textarea
                placeholder="Share your mental health journey, insights, or experiences..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[300px] resize-y"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Estimated read time: {Math.ceil(newPost.content.split(' ').length / 200)} minutes
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {popularTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={newPost.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setNewPost(prev => ({
                        ...prev,
                        tags: prev.tags.includes(tag)
                          ? prev.tags.filter(t => t !== tag)
                          : [...prev.tags, tag]
                      }));
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                {newPost.use_ai_assistance && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI Assisted
                  </Badge>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={publishPost}
                  className="bg-gradient-primary text-white"
                >
                  Publish Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Community Blog
        </h1>
        <p className="text-muted-foreground">
          Share your mental health journey and connect with others who understand
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-gradient-primary text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Share Your Story
        </Button>
      </div>

      {/* Filter Tags */}
      <Card className="mb-6 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4" />
            Filter by Topic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedTags(prev => 
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
              >
                {tag}
              </Badge>
            ))}
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="h-6 px-2 text-xs"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {filteredPosts.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedTags.length > 0 
                    ? "Try adjusting your search or filters"
                    : "Be the first to share your story with the community"}
                </p>
                <Button 
                  onClick={() => setIsCreating(true)}
                  className="bg-gradient-primary text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="shadow-soft hover:shadow-wellness transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{post.author.name}</span>
                        {post.is_ai_assisted && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            AI Assisted
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.created_at} • {post.read_time} min read
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight">{post.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{post.excerpt}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likePost(post.id)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                      >
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Posts</span>
                  <span className="font-semibold">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Members</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-semibold">18 new posts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm">Trending Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTags.slice(0, 6).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card className="shadow-soft border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm text-primary">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• Be respectful and supportive</li>
                <li>• Share your authentic experiences</li>
                <li>• Respect others' privacy</li>
                <li>• No professional medical advice</li>
                <li>• Report harmful content</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}