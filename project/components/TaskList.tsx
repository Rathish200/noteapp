'use client'

import { useState } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TaskForm } from './TaskForm';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Task = {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
};

type TaskListProps = {
  tasks: Task[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
  onToggle: (id: string) => Promise<void>;
};

export function TaskList({ tasks, onDelete, onUpdate, onToggle }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks found. Create your first task above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task._id} className={cn(task.completed && 'opacity-60')}>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggle(task._id)}
              />
              <CardTitle className={cn(task.completed && 'line-through')}>
                {task.title}
              </CardTitle>
            </div>
            {task.dueDate && (
              <CardDescription>
                Due: {format(new Date(task.dueDate), 'PPP')}
              </CardDescription>
            )}
          </CardHeader>
          {task.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </CardContent>
          )}
          <CardFooter className="flex justify-end space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditingTask(task)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <TaskForm
                  onSubmit={(formData) => {
                    onUpdate(task._id, formData);
                    setEditingTask(null);
                  }}
                  initialData={{
                    title: task.title,
                    description: task.description,
                    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                  }}
                />
              </DialogContent>
            </Dialog>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(task._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}