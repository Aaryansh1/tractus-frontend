export interface Contract {
  id: string;
  name: string;
  clientName: string;
  status: status;
}

export enum status {
  Draft = "draft",
  In_Progress = "in-progress",
  Completed = "complete",
}

export interface DropdownMenuItem {
  label: string;
  value: string;
}

export type type = "add" | "update" | "delete";
