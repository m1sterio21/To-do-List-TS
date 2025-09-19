export interface Todo {
	id: string
	text: string
	completed: boolean
	priority: 'low' | 'medium' | 'high'
	category: string
	createdAt: Date
	updatedAt: Date
	dueDate?: Date
}

export type FilterType = 'all' | 'active' | 'completed'
export type SortType = 'created' | 'priority' | 'dueDate' | 'alphabetical'

export interface TodoStats {
	total: number
	completed: number
	active: number
	overdue: number
}

export interface Category {
	id: string
	name: string
	color: string
}
