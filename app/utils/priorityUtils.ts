/**
 * Утилиты для работы с приоритетами задач
 */

export type Priority = 'low' | 'medium' | 'high'

export const PRIORITY_LABELS: Record<Priority, string> = {
	low: 'Низкий',
	medium: 'Средний',
	high: 'Высокий',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
	low: 'var(--muted-foreground)',
	medium: 'var(--primary)',
	high: 'var(--destructive)',
}

export const PRIORITY_ORDER: Record<Priority, number> = {
	low: 1,
	medium: 2,
	high: 3,
}

export const getPriorityLabel = (priority: Priority): string => {
	return PRIORITY_LABELS[priority]
}

export const getPriorityColor = (priority: Priority): string => {
	return PRIORITY_COLORS[priority]
}

export const getPriorityOrder = (priority: Priority): number => {
	return PRIORITY_ORDER[priority]
}

export const sortByPriority = (a: Priority, b: Priority): number => {
	return PRIORITY_ORDER[b] - PRIORITY_ORDER[a]
}
