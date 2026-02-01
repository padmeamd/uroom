import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, GripVertical, Type, ListChecks, CircleDot } from 'lucide-react';
import { QuizQuestion, QuestionType } from '@/types/quiz';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizBuilderProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

const questionTypeIcons: Record<QuestionType, React.ReactNode> = {
  'text': <Type size={16} />,
  'multiple-choice': <ListChecks size={16} />,
  'single-choice': <CircleDot size={16} />,
};

const questionTypeLabels: Record<QuestionType, string> = {
  'text': 'Text Answer',
  'multiple-choice': 'Multiple Choice',
  'single-choice': 'Single Choice',
};

export const QuizBuilder = ({ questions, onChange }: QuizBuilderProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: crypto.randomUUID(),
      type: 'text',
      question: '',
      required: true,
    };
    onChange([...questions, newQuestion]);
    setExpandedId(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    onChange(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    onChange(questions.filter(q => q.id !== id));
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const options = question.options || [];
      updateQuestion(questionId, { options: [...options, ''] });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question?.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const deleteOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question?.options) {
      updateQuestion(questionId, { 
        options: question.options.filter((_, i) => i !== optionIndex) 
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Application Questions</Label>
        <span className="text-xs text-muted-foreground">{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
      </div>

      <AnimatePresence mode="popLayout">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border border-border rounded-xl p-4 space-y-3"
          >
            <div className="flex items-start gap-2">
              <GripVertical size={16} className="text-muted-foreground mt-2.5 cursor-grab" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Q{index + 1}</span>
                  <Input
                    placeholder="Enter your question..."
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                    className="flex-1 input-focus"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteQuestion(question.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* Question Type Selector */}
                <div className="flex gap-2">
                  {(Object.keys(questionTypeLabels) as QuestionType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const updates: Partial<QuizQuestion> = { type };
                        if (type !== 'text' && !question.options) {
                          updates.options = ['', ''];
                        }
                        updateQuestion(question.id, updates);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        question.type === type
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {questionTypeIcons[type]}
                      {questionTypeLabels[type]}
                    </button>
                  ))}
                </div>

                {/* Options for choice questions */}
                {(question.type === 'multiple-choice' || question.type === 'single-choice') && (
                  <div className="pl-4 space-y-2">
                    {question.options?.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        {question.type === 'multiple-choice' ? (
                          <Checkbox disabled className="pointer-events-none" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-primary" />
                        )}
                        <Input
                          placeholder={`Option ${optIndex + 1}`}
                          value={option}
                          onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                          className="flex-1 h-8 text-sm"
                        />
                        {(question.options?.length || 0) > 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deleteOption(question.id, optIndex)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addOption(question.id)}
                      className="text-xs text-muted-foreground"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Option
                    </Button>
                  </div>
                )}

                {/* Required toggle */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`required-${question.id}`}
                    checked={question.required}
                    onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
                  />
                  <Label htmlFor={`required-${question.id}`} className="text-xs text-muted-foreground cursor-pointer">
                    Required
                  </Label>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        variant="outline"
        onClick={addQuestion}
        className="w-full border-dashed"
      >
        <Plus size={16} className="mr-2" />
        Add Question
      </Button>

      {questions.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Add questions that applicants must answer to join your project.
        </p>
      )}
    </div>
  );
};
