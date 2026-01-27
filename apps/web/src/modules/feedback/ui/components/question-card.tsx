'use client';

import { useState } from 'react';
import { GripVertical, Trash2Icon } from 'lucide-react';
import { humanizeEnum } from '@/lib/formatters';
import { SortableItemHandle } from '@/components/sortable';
import { Input } from '@workspace/ui/components/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@workspace/ui/components/select';
import { Switch } from '@workspace/ui/components/switch';
import { QUESTIONS, QuestionType } from '../../constants';
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Button } from '@workspace/ui/components/button';

interface Question {
    id: string;
    questionText: string;
    questionType: QuestionType;
    isRequired: boolean;
    order: number;
}

interface QuestionCardProps {
    question: Question;
    onUpdate: (
        id: string,
        update: {
            questionText?: string;
            questionType?: QuestionType;
            isRequired?: boolean;
        }
    ) => void;
    onDelete: (id: string) => void;
}

export const QuestionCard = ({
    question,
    onUpdate,
    onDelete,
}: QuestionCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(question.questionText);
    const [type, setType] = useState(question.questionType);
    const [required, setRequired] = useState(question.isRequired);

    const commit = () => {
        setIsEditing(false);
        onUpdate(question.id, {
            questionText: text,
            questionType: type,
            isRequired: required,
        });
    };

    const cancel = () => {
        setIsEditing(false);
        setText(question.questionText);
        setType(question.questionType);
        setRequired(question.isRequired);
    };

    return (
        <div
            className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:bg-accent/50 transition-colors group"
            onDoubleClick={() => setIsEditing(true)}
        >
            <SortableItemHandle className="text-muted-foreground hover:text-foreground p-1 shrink-0">
                <GripVertical className="h-4 w-4" />
            </SortableItemHandle>

            <div className="flex-1 min-w-0 space-y-2">
                {isEditing ? (
                    <>
                        <Input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') commit();
                                if (e.key === 'Escape') cancel();
                            }}
                            autoFocus
                        />
                        <div className="flex items-center gap-4">
                            <Select
                                value={type}
                                onValueChange={(v) =>
                                    setType(v as QuestionType)
                                }
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue>
                                        {humanizeEnum(type)}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {QUESTIONS.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {humanizeEnum(t)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={required}
                                    onCheckedChange={setRequired}
                                />
                                <span className="text-xs text-muted-foreground">
                                    Required
                                </span>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={cancel}
                                    className="text-xs text-muted-foreground hover:underline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={commit}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h4 className="font-medium text-sm truncate">
                            {question.questionText}
                        </h4>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                                {humanizeEnum(question.questionType)}
                            </span>
                            {question.isRequired && (
                                <span className="text-xs text-destructive">
                                    Required
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(question.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:text-destructive"
            >
                <Trash2Icon className="h-4 w-4" />
            </Button>
        </div>
    );
}

export const QuestionCardSkeleton = () => {
    return (
        <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg">
            <Skeleton className="h-4 w-4 shrink-0" />

            <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-5 w-3/4" />

                <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    );
}
