import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockExams } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Exam, Question } from '@/types';
import { BookOpen, Clock, Play, CheckCircle, AlertTriangle, Award, Timer, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Learning: React.FC = () => {
  const { currentTenant, user } = useAuth();
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [circuitBreakerTripped, setCircuitBreakerTripped] = useState(false);

  const filteredExams = mockExams.filter(exam => exam.tenant === currentTenant);

  useEffect(() => {
    if (activeExam && timeRemaining > 0 && !examSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeExam, timeRemaining, examSubmitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = async (exam: Exam) => {
    setActiveExam(exam);
    setTimeRemaining(exam.duration * 60);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setExamSubmitted(false);
    setExamDialogOpen(true);

    // Simulate Circuit Breaker for notification
    toast({ title: '📝 Exam Started', description: 'Sending notification...' });
    
    // Simulate notification service with circuit breaker
    try {
      await new Promise((resolve, reject) => {
        // Simulate 30% chance of failure to demonstrate circuit breaker
        if (Math.random() < 0.3 && !circuitBreakerTripped) {
          reject(new Error('Notification service unavailable'));
        } else {
          resolve(true);
        }
      });
      toast({ title: '✅ Notification sent', description: 'Your instructor has been notified.' });
    } catch {
      setCircuitBreakerTripped(true);
      toast({ 
        title: '⚠️ Circuit Breaker Active', 
        description: 'Notification service is temporarily unavailable. Exam continues normally.',
        variant: 'destructive',
      });
      // Auto-reset circuit breaker after 10 seconds
      setTimeout(() => setCircuitBreakerTripped(false), 10000);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitExam = () => {
    const score = calculateScore();
    setExamSubmitted(true);
    toast({
      title: '🎉 Exam Submitted!',
      description: `Your score: ${score}/${getTotalPoints()} points`,
    });
  };

  const calculateScore = () => {
    if (!activeExam) return 0;
    return activeExam.questions.reduce((total, question) => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer || userAnswer === question.correctAnswer.toString()) {
        return total + question.points;
      }
      return total;
    }, 0);
  };

  const getTotalPoints = () => {
    if (!activeExam) return 0;
    return activeExam.questions.reduce((total, q) => total + q.points, 0);
  };

  const getExamStatus = (exam: Exam) => {
    switch (exam.status) {
      case 'active':
        return { label: 'In Progress', className: 'badge-success' };
      case 'scheduled':
        return { label: 'Upcoming', className: 'badge-info' };
      case 'completed':
        return { label: 'Completed', className: 'badge-warning' };
      default:
        return { label: 'Draft', className: '' };
    }
  };

  const currentQuestion = activeExam?.questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">E-Learning & Exams</h2>
          <p className="text-muted-foreground">Access your courses and take online examinations</p>
        </div>
        {circuitBreakerTripped && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Notification Service: Circuit Breaker Active
          </Badge>
        )}
      </div>

      <Tabs defaultValue="exams" className="space-y-6">
        <TabsList>
          <TabsTrigger value="exams">Available Exams</TabsTrigger>
          <TabsTrigger value="results">My Results</TabsTrigger>
        </TabsList>

        <TabsContent value="exams">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam, index) => {
              const status = getExamStatus(exam);
              return (
                <Card
                  key={exam.id}
                  className="glass-card hover-lift animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-sidebar-primary/10 p-2.5">
                          <BookOpen className="h-5 w-5 text-sidebar-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{exam.title}</CardTitle>
                          <CardDescription>{exam.courseId}</CardDescription>
                        </div>
                      </div>
                      <Badge className={status.className}>{status.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{exam.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="h-4 w-4" />
                        <span>{exam.questions.reduce((t, q) => t + q.points, 0)} points</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Scheduled: {format(new Date(exam.startTime), 'PPP p')}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => startExam(exam)}
                      disabled={exam.status === 'completed' || exam.status === 'draft'}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {exam.status === 'completed' ? 'View Results' : 'Start Exam'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="results">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Your Exam Results</CardTitle>
              <CardDescription>View your performance across all completed exams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No completed exams yet</p>
                <p className="text-sm">Your results will appear here after completing exams</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Exam Dialog */}
      <Dialog open={examDialogOpen} onOpenChange={setExamDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {activeExam && !examSubmitted && currentQuestion && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{activeExam.title}</DialogTitle>
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {formatTime(timeRemaining)}
                  </Badge>
                </div>
                <DialogDescription>
                  Question {currentQuestionIndex + 1} of {activeExam.questions.length}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <Progress value={((currentQuestionIndex + 1) / activeExam.questions.length) * 100} />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{currentQuestion.text}</span>
                      <Badge variant="secondary">{currentQuestion.points} pts</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                      <RadioGroup
                        value={answers[currentQuestion.id]?.toString() || ''}
                        onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
                      >
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    {currentQuestion.type === 'true-false' && (
                      <RadioGroup
                        value={answers[currentQuestion.id]?.toString() || ''}
                        onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                      >
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="true" className="cursor-pointer">True</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="false" className="cursor-pointer">False</Label>
                        </div>
                      </RadioGroup>
                    )}
                  </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentQuestionIndex === activeExam.questions.length - 1 ? (
                    <Button variant="accent" onClick={handleSubmitExam}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Exam
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(activeExam.questions.length - 1, prev + 1))}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {examSubmitted && activeExam && (
            <div className="text-center py-8 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Exam Submitted!</h3>
                <p className="text-muted-foreground mt-2">
                  Your answers have been recorded successfully.
                </p>
              </div>
              <div className="p-6 bg-muted/50 rounded-xl">
                <p className="text-4xl font-bold text-foreground">
                  {calculateScore()} / {getTotalPoints()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Points Earned</p>
              </div>
              <Button onClick={() => setExamDialogOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Learning;
