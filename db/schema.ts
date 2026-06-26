import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().default('local_user'),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['pendente', 'em_andamento', 'concluido'] }).default('pendente').notNull(),
  priority: text('priority', { enum: ['baixa', 'media', 'alta'] }).default('media').notNull(),
  category: text('category', { enum: ['pessoal', 'trabalho'] }).default('pessoal').notNull(),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const meetings = sqliteTable('meetings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().default('local_user'),
  title: text('title').notNull(),
  description: text('description'),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }).notNull(),
  location: text('location'),
  category: text('category', { enum: ['pessoal', 'trabalho'] }).default('trabalho').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const reminders = sqliteTable('reminders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  taskId: text('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  meetingId: text('meeting_id').references(() => meetings.id, { onDelete: 'cascade' }),
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