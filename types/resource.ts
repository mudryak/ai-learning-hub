export type ResourceType = "article" | "video";

export type ResourceCategory =
  | "AI Engineering & Education"
  | "Claude Workflow & Skills"
  | "AI Agents & Orchestration"
  | "Curation & Discovery"
  | "Tools & Stacks"
  | "Other";

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  category: ResourceCategory;
  tags: string[];
  description: string;
  takeaways: string[];
  addedAt: string;
}
