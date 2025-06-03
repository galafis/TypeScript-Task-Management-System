/**
 * Task Management System
 * @author Gabriel Demetrios Lafis
 */

import express, { Request, Response } from 'express';

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    updatedAt: Date;
}

class TaskManager {
    private tasks: Task[] = [];
    private nextId: number = 1;

    createTask(title: string, description: string, priority: Task['priority']): Task {
        const task: Task = {
            id: this.nextId++,
            title,
            description,
            status: 'pending',
            priority,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.tasks.push(task);
        return task;
    }

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: number): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    updateTaskStatus(id: number, status: Task['status']): Task | null {
        const task = this.getTaskById(id);
        if (task) {
            task.status = status;
            task.updatedAt = new Date();
            return task;
        }
        return null;
    }
}

const app = express();
const taskManager = new TaskManager();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Task Management System by Gabriel Lafis',
        version: '1.0.0',
        endpoints: ['/api/tasks', '/api/tasks/:id', '/api/health']
    });
});

app.get('/api/tasks', (req: Request, res: Response) => {
    res.json(taskManager.getAllTasks());
});

app.post('/api/tasks', (req: Request, res: Response) => {
    const { title, description, priority } = req.body;
    const task = taskManager.createTask(title, description, priority);
    res.status(201).json(task);
});

app.get('/api/health', (req: Request, res: Response) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        author: 'Gabriel Demetrios Lafis'
    });
});

app.listen(PORT, () => {
    console.log(`📋 Task Management System running on port ${PORT}`);
    console.log(`👨‍💻 Created by Gabriel Demetrios Lafis`);
});

export default app;
