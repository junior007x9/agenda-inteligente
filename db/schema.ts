// src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Tabela de Tarefas (Uso pessoal e trabalho)
export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['pendente', 'em_andamento', 'concluido'] }).default('pendente').notNull(),
  priority: text('priority', { enum: ['baixa', 'media', 'alta'] }).default('media').notNull(),
  category: text('category', { enum: ['pessoal', 'trabalho'] }).default('pessoal').notNull(),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Tabela de Reuniões e Compromissos
export const meetings = sqliteTable('meetings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }).notNull(),
  location: text('location'), // Pode ser um link do Meet/Zoom ou endereço físico
  category: text('category', { enum: ['pessoal', 'trabalho'] }).default('trabalho').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Tabela de Alertas/Notificações Personalizadas
export const reminders = sqliteTable('reminders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  // Chaves estrangeiras opcionais (um alerta pode pertencer a uma tarefa OU a uma reunião)
  taskId: text('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  meetingId: text('meeting_id').references(() => meetings.id, { onDelete: 'cascade' }),
  
  // Customização do alerta (ex: 15 minutos antes, 1 hora antes)
  minutesBefore: integer('minutes_before').notNull(), 
  type: text('type', { enum: ['push', 'in_app'] }).default('push').notNull(),
  status: text('status', { enum: ['agendado', 'enviado'] }).default('agendado').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
export const pushSubscriptions = sqliteTable('push_subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  endpoint: text('endpoint').notNull(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});