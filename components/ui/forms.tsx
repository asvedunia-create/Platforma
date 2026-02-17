"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const baseSchema = z.object({ title: z.string().min(3), description: z.string().optional() });

export function RiskForm() {
  const form = useForm({ resolver: zodResolver(baseSchema) });
  return <form>{form.formState.isSubmitting ? "Saving..." : "Risk form"}</form>;
}

export function ControlForm() {
  return <form>Control form</form>;
}

export function TaskForm() {
  return <form>Task form</form>;
}

export function EvidenceForm() {
  return <form>Evidence form</form>;
}

export function OwnerSelect() {
  return <select><option>Unassigned</option></select>;
}

export function Modal({ children }: { children: React.ReactNode }) {
  return <div role="dialog">{children}</div>;
}

export function Drawer({ children }: { children: React.ReactNode }) {
  return <aside>{children}</aside>;
}
