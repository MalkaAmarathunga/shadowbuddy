import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, MessageSquare, Users, BookOpen, Target, Hash, Play, RotateCcw, CheckCircle, XCircle, Clock, Award, TrendingUp } from 'lucide-react';

const InterviewSimulator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    origin: '',
    level: '',
    field: '',
    difficulty: '',
    questionCount: 5
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [isAnswering, setIsAnswering] = useState(false);

  // Sample data
  const origins = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'China', 'Japan', 'Brazil', 'Other'
  ];

  const levels = [
    { value: 'undergraduate', label: 'Undergraduate', icon: '🎓' },
    { value: 'postgraduate', label: 'Postgraduate', icon: '📚' }
  ];

  const fields = [
    'Computer Science', 'Software Engineering', 'Data Science', 'Artificial Intelligence',
    'Cybersecurity', 'Business Administration', 'Finance', 'Marketing', 'Psychology',
    'Mechanical Engineering', 'Electrical Engineering', 'Medicine', 'Law', 'Other'
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-500', description: 'Basic concepts and fundamental questions' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500', description: 'Moderate complexity with practical scenarios' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-500', description: 'Complex problems and expert-level questions' }
  ];

  const questionCounts = [5, 10, 15, 20];

  // Sample questions based on field and difficulty
  const getQuestions = () => {
    const questionBank = {
      'Computer Science': {
        beginner: [
          'What is the difference between a stack and a queue?',
          'Explain what object-oriented programming is.',
          'What is the time complexity of binary search?',
          'Describe the difference between HTTP and HTTPS.',
          'What is a database and why do we use them?'
        ],
        intermediate: [
          'Explain the concept of Big O notation and its importance.',
          'How would you implement a hash table from scratch?',
          'Describe the differences between SQL and NoSQL databases.',
          'What are design patterns and can you give an example?',
          'Explain how garbage collection works in programming languages.'
        ],
        advanced: [
          'Design a distributed system for handling millions of concurrent users.',
          'Explain the CAP theorem and its implications for distributed databases.',
          'How would you optimize a slow database query?',
          'Describe microservices architecture and its trade-offs.',
          'Implement a load balancer algorithm and explain your choice.'
        ]
      },
      'Business Administration': {
        beginner: [
          'What are the four P\'s of marketing?',
          'Explain the difference between leadership and management.',
          'What is SWOT analysis?',
          'Describe the importance of cash flow in business.',
          'What is market segmentation?'
        ],
        intermediate: [
          'How would you analyze a company\'s financial performance?',
          'Explain different business models and their applications.',
          'Describe the process of strategic planning.',
          'What factors would you consider when entering a new market?',
          'How do you measure ROI for marketing campaigns?'
        ],
        advanced: [
          'Design a go-to-market strategy for a new product launch.',
          'How would you restructure a failing business unit?',
          'Analyze the impact of digital transformation on traditional businesses.',
          'Develop a crisis management plan for a multinational corporation.',
          'Evaluate merger and acquisition strategies in your industry.'
        ]
      }
    };

    const fieldQuestions = questionBank[selections.field] || questionBank['Computer Science'];
    const difficultyQuestions = fieldQuestions[selections.difficulty] || fieldQuestions.beginner;
    
    return difficultyQuestions.slice(0, selections.questionCount);
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (isAnswering && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isAnswering) {
      handleNextQuestion();
    }
    return () => clearInterval(timer);
  }, [isAnswering, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStepNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setIsAnswering(true);
    setTimeLeft(300);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers, {
      question: getQuestions()[currentQuestion],
      answer: userAnswer,
      timeSpent: 300 - timeLeft
    }];
    setAnswers(newAnswers);
    setUserAnswer('');
    
    if (currentQuestion + 1 < selections.questionCount) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(300);
    } else {
      setShowResults(true);
      setIsAnswering(false);
    }
  };

  const resetSimulator = () => {
    setCurrentStep(0);
    setCurrentQuestion(0);
    setUserAnswer('');
    setAnswers([]);
    setShowResults(false);
    setInterviewStarted(false);
    setTimeLeft(300);
    setIsAnswering(false);
    setSelections({
      origin: '',
      level: '',
      field: '',
      difficulty: '',
      questionCount: 5
    });
  };

  const generateFeedback = (answer, question) => {
    // Simple AI-like feedback generation
    const wordCount = answer.split(' ').length;
    const hasExamples = answer.toLowerCase().includes('example') || answer.toLowerCase().includes('instance');
    const isDetailed = wordCount > 50;
    
    let score = 0;
    let feedback = [];

    if (wordCount > 20) {
      score += 25;
      feedback.push("✅ Good answer length");
    } else {
      feedback.push("⚠️ Answer could be more detailed");
    }

    if (hasExamples) {
      score += 25;
      feedback.push("✅ Used examples effectively");
    } else {
      feedback.push("💡 Consider adding examples");
    }

    if (isDetailed) {
      score += 25;
      feedback.push("✅ Comprehensive explanation");
    }

    score += 25; // Base score
    
    return { score, feedback };
  };

  const calculateOverallScore = () => {
    if (answers.length === 0) return 0;
    const totalScore = answers.reduce((sum, answer) => {
      const feedback = generateFeedback(answer.answer, answer.question);
      return sum + feedback.score;
    }, 0);
    return Math.round(totalScore / answers.length);
  };

  if (showResults) {
    const overallScore = calculateOverallScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Interview Complete!</h1>
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-indigo-600">{overallScore}%</div>
                <div className="text-lg text-gray-600">Overall Score</div>
              </div>
            </div>

            <div className="space-y-6">
              {answers.map((answer, index) => {
                const feedback = generateFeedback(answer.answer, answer.question);
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-800">Question {index + 1}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{formatTime(answer.timeSpent)} used</span>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          feedback.score >= 80 ? 'bg-green-100 text-green-800' :
                          feedback.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {feedback.score}%
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 font-medium">{answer.question}</p>
                    <div className="bg-gray-50 p-4 rounded-lg mb-3">
                      <p className="text-gray-800">{answer.answer || 'No answer provided'}</p>
                    </div>
                    <div className="space-y-1">
                      {feedback.feedback.map((item, i) => (
                        <p key={i} className="text-sm text-gray-600">{item}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={resetSimulator}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                Start New Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (interviewStarted) {
    const questions = getQuestions();
    const currentQ = questions[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Interview in Progress</h1>
                <p className="text-gray-600">Question {currentQuestion + 1} of {selections.questionCount}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg font-medium ${
                  timeLeft > 60 ? 'bg-green-100 text-green-800' :
                  timeLeft > 30 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <Clock className="w-4 h-4 inline mr-2" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / selections.questionCount) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Question {currentQuestion + 1}</h2>
                <p className="text-gray-700 text-lg">{currentQ}</p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Your Answer:</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{userAnswer.split(' ').length} words</span>
                  <span>Take your time to provide a detailed answer</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={!userAnswer.trim()}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {currentQuestion + 1 === selections.questionCount ? 'Finish Interview' : 'Next Question'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { title: 'Student Origin', icon: Users },
    { title: 'Education Level', icon: BookOpen },
    { title: 'Field of Study', icon: Target },
    { title: 'Difficulty Level', icon: TrendingUp },
    { title: 'Question Count', icon: Hash },
    { title: 'Start Interview', icon: Play }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Shadow Buddy</h1>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Conquer interview anxiety with AI practice.</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Interviews can be stressful, but with the right preparation, you can shine. Our AI-powered interview simulator provides a safe and effective way to practice your interviewing skills, receive personalized feedback, and build the confidence you need to land your dream job.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    index <= currentStep ? 'text-indigo-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          {currentStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Your Origin</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {origins.map((origin) => (
                  <button
                    key={origin}
                    onClick={() => setSelections({...selections, origin})}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selections.origin === origin
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {origin}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Education Level</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {levels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelections({...selections, level: level.value})}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      selections.level === level.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{level.icon}</div>
                    <div className="text-xl font-semibold text-gray-800">{level.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Field of Study</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fields.map((field) => (
                  <button
                    key={field}
                    onClick={() => setSelections({...selections, field})}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selections.field === field
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Difficulty Level</h2>
              <div className="space-y-4">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.value}
                    onClick={() => setSelections({...selections, difficulty: difficulty.value})}
                    className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                      selections.difficulty === difficulty.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${difficulty.color}`}></div>
                      <div>
                        <div className="text-xl font-semibold text-gray-800">{difficulty.label}</div>
                        <div className="text-gray-600">{difficulty.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Number of Questions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {questionCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => setSelections({...selections, questionCount: count})}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      selections.questionCount === count
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl font-bold text-gray-800">{count}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ready to Start?</h2>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Your Interview Configuration:</h3>
                <div className="space-y-2 text-gray-600">
                  <div><strong>Origin:</strong> {selections.origin}</div>
                  <div><strong>Level:</strong> {selections.level}</div>
                  <div><strong>Field:</strong> {selections.field}</div>
                  <div><strong>Difficulty:</strong> {selections.difficulty}</div>
                  <div><strong>Questions:</strong> {selections.questionCount}</div>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={startInterview}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto text-lg"
                >
                  <Play className="w-6 h-6" />
                  Start Interview
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleStepBack}
              disabled={currentStep === 0}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            
            {currentStep < 5 && (
              <button
                onClick={handleStepNext}
                disabled={
                  (currentStep === 0 && !selections.origin) ||
                  (currentStep === 1 && !selections.level) ||
                  (currentStep === 2 && !selections.field) ||
                  (currentStep === 3 && !selections.difficulty)
                }
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;