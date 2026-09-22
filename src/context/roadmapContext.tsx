import { create } from "zustand";

// --- 1. Core Data Models ---

export type Status = "Learning" | "Done" | "Skip";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Resource {
  id: string;
  title: string;
  url: string;
}

export interface Subtopic {
  id: string;
  title: string;
  difficulty: Difficulty;
  status: Status;
  content: string;
  resources: Resource[]; // Changed to array to support multiple resources
}

export interface Topic {
  id: string;
  title: string; // e.g., "React"
  subtopics: Subtopic[];
}

export interface Task {
  id: string;
  title: string; // e.g., "Set up navigation"
  isCompleted: boolean;
}

export interface Project {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string; // High-level overview
  tasks: Task[]; // Array of pressable checkboxes
}

// --- 2. Zustand State & Actions ---

interface RoadmapState {
  topics: Topic[];
  projects: Project[];

  // Actions for Subtopics
  setSubtopicStatus: (
    topicId: string,
    subtopicId: string,
    status: Status,
  ) => void;

  // Actions for Projects
  toggleTaskCompletion: (projectId: string, taskId: string) => void;
}

// --- 3. Store Initialization ---

export const useRoadmapStore = create<RoadmapState>((set) => ({
  topics: [
    {
      id: "topic-react",
      title: "React Fundamentals",
      subtopics: [
        {
          id: "sub-1",
          title: "Components & Props",
          difficulty: "Beginner",
          status: "Learning",
          content:
            "React is a JavaScript library for building user interfaces using reusable components.",
          resources: [
            {
              id: "r1",
              title: "React Official Docs",
              url: "https://reactjs.org/",
            },
            {
              id: "r2",
              title: "Video Tutorial",
              url: "https://youtube.com/example",
            },
          ],
        },
      ],
    },
  ],

  projects: [
    {
      id: "proj-1",
      title: "Build a Todo App",
      difficulty: "Beginner",
      description: "A simple task manager to practice state and props.",
      tasks: [
        { id: "task-1", title: "Initialize Expo project", isCompleted: true },
        {
          id: "task-2",
          title: "Create TaskItem component",
          isCompleted: false,
        },
        // ... add up to 10-15 tasks here
      ],
    },
  ],

  // Optimized action: finds the topic and subtopic, updates only the status
  setSubtopicStatus: (topicId, subtopicId, status) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.map((sub) =>
                sub.id === subtopicId ? { ...sub, status } : sub,
              ),
            }
          : topic,
      ),
    })),

  // Optimized action: toggles the boolean of a specific task
  toggleTaskCompletion: (projectId, taskId) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, isCompleted: !task.isCompleted }
                  : task,
              ),
            }
          : project,
      ),
    })),
}));
