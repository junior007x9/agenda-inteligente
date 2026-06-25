// app/actions.ts
'use server';

import { db } from '../db';
import { tasks, meetings, reminders } from '../db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function getDashboardData() {
  try {
    const allTasks = await db.select().from(tasks).orderBy(tasks.status, tasks.dueDate);
    const allMeetings = await db.select().from(meetings).orderBy(meetings.startTime);
    return { tasks: allTasks, meetings: allMeetings };
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return { tasks: [], meetings: [] };
  }
}

export async function createTaskAction(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as 'pessoal' | 'trabalho';
  const priority = formData.get('priority') as 'baixa' | 'media' | 'alta';
  const dueDateStr = formData.get('dueDate') as string;
  const minutesBeforeStr = formData.get('minutesBefore') as string;

  if (!title) return;

  const [insertedTask] = await db.insert(tasks).values({
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
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as 'pessoal' | 'trabalho';
  const startTimeStr = formData.get('startTime') as string;
  const endTimeStr = formData.get('endTime') as string;
  const location = formData.get('location') as string;
  const minutesBeforeStr = formData.get('minutesBefore') as string;

  if (!title || !startTimeStr || !endTimeStr) return;

  const [insertedMeeting] = await db.insert(meetings).values({
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
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function deleteMeetingAction(id: string) {
  await db.delete(meetings).where(eq(meetings.id, id));
  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function toggleTaskStatusAction(id: string, currentStatus: string) {
  const newStatus = currentStatus === 'concluido' ? 'pendente' : 'concluido';
  await db.update(tasks).set({ status: newStatus }).where(eq(tasks.id, id));
  revalidatePath('/');
  revalidatePath('/calendar');
}

// NOVAS FUNÇÕES: Editar Demandas
export async function updateTaskAction(id: string, formData: FormData) {
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
  }).where(eq(tasks.id, id));

  revalidatePath('/');
  revalidatePath('/calendar');
}

export async function updateMeetingAction(id: string, formData: FormData) {
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
  }).where(eq(meetings.id, id));

  revalidatePath('/');
  revalidatePath('/calendar');
}