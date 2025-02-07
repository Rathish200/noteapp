import { Suspense } from 'react';
import { getTasks, createTask, updateTask, deleteTask, toggleTaskStatus } from './actions/tasks';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Home() {
  const tasks = await getTasks();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-6 w-6" />
            <CardTitle>Task Manager</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <TaskForm onSubmit={async (formData) => { 
            const result = await createTask(formData);
            if (result.error) {
              console.error(result.error);
            }
          }} />
          
          <Suspense fallback={<div>Loading tasks...</div>}>
            <TaskList
              tasks={tasks}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onToggle={toggleTaskStatus}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
