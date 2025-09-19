/**
 * Утилиты для работы с датами
 */

export const formatDate = (date: Date): string => {
	return date.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}

export const formatDateTime = (date: Date): string => {
	return date.toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export const isOverdue = (dueDate: Date): boolean => {
	const now = new Date()
	now.setHours(0, 0, 0, 0)
	dueDate.setHours(0, 0, 0, 0)
	return dueDate < now
}

export const getDaysUntilDue = (dueDate: Date): number => {
	const now = new Date()
	const diffTime = dueDate.getTime() - now.getTime()
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const isToday = (date: Date): boolean => {
	const today = new Date()
	return date.toDateString() === today.toDateString()
}

export const isTomorrow = (date: Date): boolean => {
	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)
	return date.toDateString() === tomorrow.toDateString()
}

export const getRelativeDate = (date: Date): string => {
	if (isToday(date)) return 'Сегодня'
	if (isTomorrow(date)) return 'Завтра'

	const daysUntil = getDaysUntilDue(date)
	if (daysUntil < 0) return `Просрочено на ${Math.abs(daysUntil)} дн.`
	if (daysUntil === 0) return 'Сегодня'
	if (daysUntil === 1) return 'Завтра'
	if (daysUntil <= 7) return `Через ${daysUntil} дн.`

	return formatDate(date)
}
