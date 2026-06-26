// app/actions.ts
'use server';

import { db } from '../db';
import { tasks, meetings, reminders } from '../db/schema';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function getDashboardData() {
  // CORREÇÃO: Adicionado o "await" antes do auth()
  const { userId } = await auth();
  if (!userId) return { tasks: [], meetings: [] };

  try {
    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(tasks.status, tasks.dueDate);
    const userMeetings = await db.select().from(meetings).where(eq(meetings.userId, userId)).orderBy(meetings.startTime);
    return { tasks: userTasks, meetings: userMeetings };
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return { tasks: [], meetings: [] };
  }
}

export async function createTaskAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Acesso negado");

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as 'pessoal' | 'trabalho';
  const priority = formData.get('priority') as 'baixa' | 'media' | 'alta';
  const dueDateStr = formData.get('dueDate') as string;
  const minutesBeforeStr = formData.get('minutesBefore') as string;

  if (!title) return;

  const [insertedTask] = await db.insert(tasks).values({
    userId,
    title,
    description: description || null,
    category,
    priority,
    status: 'pendente',
    dueDate: dueDateStr ? new Date(dueDateStr) : null,
  }).returning();

  if (insertedTask && minutesBeforeStr) {
    await db.insert(reminders).values({
      taskId: insertedTask.id,
      minutesBefore: parseInt(minutesBeforeStr, 10),
      type: 'push',
      status: 'agendado',
    });
  }

  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function createMeetingAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Acesso negado");

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as 'pessoal' | 'trabalho';
  const startTimeStr = formData.get('startTime') as string;
  const endTimeStr = formData.get('endTime') as string;
  const location = formData.get('location') as string;
  const minutesBeforeStr = formData.get('minutesBefore') as string;

  if (!title || !startTimeStr || !endTimeStr) return;

  const [insertedMeeting] = await db.insert(meetings).values({
    userId,
    title,
    description: description || null,
    startTime: new Date(startTimeStr),
    endTime: new Date(endTimeStr),
    location: location || null,
    category,
  }).returning();

  if (insertedMeeting && minutesBeforeStr) {
    await db.insert(reminders).values({
      meetingId: insertedMeeting.id,
      minutesBefore: parseInt(minutesBeforeStr, 10),
      type: 'push',
      status: 'agendado',
    });
  }

  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function deleteTaskAction(id: string) {
  const { userId } = await auth();
  if (!userId) return;
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function deleteMeetingAction(id: string) {
  const { userId } = await auth();
  if (!userId) return;
  await db.delete(meetings).where(and(eq(meetings.id, id), eq(meetings.userId, userId)));
  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function toggleTaskStatusAction(id: string, currentStatus: string) {
  const { userId } = await auth();
  if (!userId) return;
  const newStatus = currentStatus === 'concluido' ? 'pendente' : 'concluido';
  await db.update(tasks).set({ status: newStatus }).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function updateTaskAction(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) return;
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as 'baixa' | 'media' | 'alta';
  const dueDateStr = formData.get('dueDate') as string;

  if (!title) return;

  await db.update(tasks).set({
    title,
    description: description || null,
    priority,
    dueDate: dueDateStr ? new Date(dueDateStr) : null,
  }).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));

  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function updateMeetingAction(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) return;

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const startTimeStr = formData.get('startTime') as string;
  const endTimeStr = formData.get('endTime') as string;
  const location = formData.get('location') as string;

  if (!title || !startTimeStr || !endTimeStr) return;

  await db.update(meetings).set({
    title,
    description: description || null,
    startTime: new Date(startTimeStr),
    endTime: new Date(endTimeStr),
    location: location || null,
  }).where(and(eq(meetings.id, id), eq(meetings.userId, userId)));

  revalidatePath('/');
  revalidatePath('/calendar');
}