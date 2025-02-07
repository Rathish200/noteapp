'use server'

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db';
import { Task } from '@/lib/models/task';
import { z } from 'zod';

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean().optional(),
});

export async function createTask(formData: FormData) {
  try {
    await connectDB();
    
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate'),
    };
    
    const validatedData = TaskSchema.parse(rawData);
    
    await Task.create(validatedData);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to create task:', error);
    return { error: 'Failed to create task' };
  }
}

export async function getTasks() {
  try {
    await connectDB();
    const tasks = await Task.find().sort({ createdAt: -1 });
    return tasks;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return [];
  }
}

export async function updateTask(id: string, formData: FormData) {
  try {
    await connectDB();
    
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate'),
      completed: formData.get('completed') === 'true',
    };
    
    const validatedData = TaskSchema.parse(rawData);
    
    await Task.findByIdAndUpdate(id, validatedData);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update task:', error);
    return { error: 'Failed to update task' };
  }
}

export async function deleteTask(id: string) {
  try {
    await connectDB();
    await Task.findByIdAndDelete(id);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete task:', error);
    return { error: 'Failed to delete task' };
  }
}

export async function toggleTaskStatus(id: string) {
  try {
    await connectDB();
    const task = await Task.findById(id);
    if (!task) throw new Error('Task not found');
    
    task.completed = !task.completed;
    await task.save();
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle task status:', error);
    return { error: 'Failed to toggle task status' };
  }
}