"use client";

import React, { useState } from "react";
import { Task, BusinessCategory, CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/business-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  MoreHorizontal, 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertTriangle,
  User,
  Calendar,
  ArrowRight,
  GripVertical
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTaskDelete: (taskId: string) => void;
}

const COLUMNS = [
  { id: "todo", title: "To Do", color: "#6B7280" },
  { id: "in_progress", title: "In Progress", color: "#3B82F6" },
  { id: "done", title: "Done", color: "#10B981" },
  { id: "blocked", title: "Blocked", color: "#EF4444" },
] as const;

type ColumnId = typeof COLUMNS[number]['id'];

function TaskCard({ task, onUpdate, onDelete, onMove }: { 
  task: Task; 
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  onMove: (newStatus: ColumnId) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    assignee: task.assignee || "",
    dueDate: task.dueDate || "",
    estimatedHours: task.estimatedHours?.toString() || "",
  });

  const handleSave = () => {
    onUpdate({
      ...editForm,
      estimatedHours: editForm.estimatedHours ? parseInt(editForm.estimatedHours) : undefined,
    });
    setIsEditing(false);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className="mb-2 shadow-sm hover:shadow-md transition-shadow cursor-move">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-gray-400" />
            {getStatusIcon(task.status)}
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
            <span className="text-xs text-gray-500">
              {CATEGORY_ICONS[task.category as BusinessCategory]} {task.category}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Edit
              </DropdownMenuItem>
              {COLUMNS.filter(col => col.id !== task.status).map((column) => (
                <DropdownMenuItem key={column.id} onClick={() => onMove(column.id)}>
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Move to {column.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="font-medium text-sm mb-2">{task.title}</h4>
        {task.description && (
          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            {task.assignee && (
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">
                  {task.assignee.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            {task.dueDate && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
          {task.estimatedHours && (
            <span>{task.estimatedHours}h</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TaskBoard({ tasks, onTaskUpdate, onTaskCreate, onTaskDelete }: TaskBoardProps) {
  const [filter, setFilter] = useState<"all" | BusinessCategory>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "Product" as BusinessCategory,
    priority: "medium" as Task['priority'],
  });

  const getTasksByColumn = (columnId: ColumnId) => {
    let filteredTasks = tasks;
    
    if (filter !== "all") {
      filteredTasks = tasks.filter(task => task.category === filter);
    }

    return filteredTasks
      .filter(task => task.status === columnId)
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  };

  const handleMoveTask = (taskId: string, newStatus: ColumnId) => {
    onTaskUpdate(taskId, { status: newStatus });
  };

  const handleCreateTask = () => {
    onTaskCreate({
      ...newTask,
      category: newTask.category,
      priority: newTask.priority,
      status: "todo",
    });
    setNewTask({
      title: "",
      description: "",
      category: "Product",
      priority: "medium",
    });
    setShowCreateDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Task Board</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filter by category:</span>
            <Select value={filter} onValueChange={(value) => setFilter(value as "all" | BusinessCategory)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.keys(CATEGORY_ICONS).map((category) => (
                  <SelectItem key={category} value={category}>
                    {CATEGORY_ICONS[category as BusinessCategory]} {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title..."
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newTask.category} 
                    onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value as BusinessCategory }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(CATEGORY_ICONS).map((category) => (
                        <SelectItem key={category} value={category}>
                          {CATEGORY_ICONS[category as BusinessCategory]} {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as Task['priority'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => (
          <div key={column.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center">
                {getStatusIcon(column.id as Task['status'])}
                <span className="ml-2">{column.title}</span>
              </h3>
              <Badge variant="secondary" className="text-xs">
                {getTasksByColumn(column.id).length}
              </Badge>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 min-h-[400px]">
              {getTasksByColumn(column.id).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={(updates) => onTaskUpdate(task.id, updates)}
                  onDelete={() => onTaskDelete(task.id)}
                  onMove={(newStatus) => handleMoveTask(task.id, newStatus)}
                />
              ))}
              {getTasksByColumn(column.id).length === 0 && (
                <div className="text-center text-gray-400 text-sm py-8">
                  No tasks in this column
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatusIcon(status: Task['status']) {
  switch (status) {
    case 'done': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
    case 'blocked': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default: return <Circle className="h-4 w-4 text-gray-400" />;
  }
}