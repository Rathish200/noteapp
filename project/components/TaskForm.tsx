'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional(),
});

type TaskFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: {
    title: string;
    description?: string;
    dueDate?: Date;
  };
};

export function TaskForm({ onSubmit, initialData }: TaskFormProps) {
  const [date, setDate] = useState<Date | undefined>(initialData?.dueDate);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData,
  });

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (date) {
      formData.set('dueDate', date.toISOString());
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-4">
      <div>
        <Input
          {...register('title')}
          placeholder="Task title"
          className="w-full"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Textarea
          {...register('description')}
          placeholder="Task description"
          className="w-full"
        />
      </div>

      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Task' : 'Create Task'}
      </Button>
    </form>
  );
}