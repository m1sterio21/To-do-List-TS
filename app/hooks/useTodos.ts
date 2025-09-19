import { useState, useEffect, useCallback } from 'react'
import { Todo, FilterType, SortType, TodoStats } from '../types/todo'

const STORAGE_KEY = 'todos'
const THEME_KEY = 'theme'

export const useTodos = () => {
	const [todos, setTodos] = useState<Todo[]>([])
	const [filter, setFilter] = useState<FilterType>('all')
	const [sortBy, setSortBy] = useState<SortType>('created')
	const [searchQuery, setSearchQuery] = useState('')
	const [darkMode, setDarkMode] = useState(false)

	// Загрузка данных из localStorage
	useEffect(() => {
		const savedTodos = localStorage.getItem(STORAGE_KEY)
		if (savedTodos) {
			try {
				const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
					...todo,
					createdAt: new Date(todo.createdAt),
					updatedAt: new Date(todo.updatedAt),
					dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
				}))
				setTodos(parsedTodos)
			} catch (error) {
				console.error('Error parsing todos from localStorage:', error)
			}
		}

		// Проверяем предпочтение темной темы
		const prefersDark = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches
		const savedTheme = localStorage.getItem(THEME_KEY)
		setDarkMode(savedTheme ? savedTheme === 'dark' : prefersDark)
	}, [])

	// Сохранение данных в localStorage
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
	}, [todos])

	// Применение темы
	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add('dark')
			localStorage.setItem(THEME_KEY, 'dark')
		} else {
			document.documentElement.classList.remove('dark')
			localStorage.setItem(THEME_KEY, 'light')
		}
	}, [darkMode])

	const generateId = useCallback(() => {
		return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
	}, [])

	const addTodo = useCallback(
		(
			text: string,
			priority: 'low' | 'medium' | 'high' = 'medium',
			category: string = 'Общие'
		) => {
			const newTodo: Todo = {
				id: generateId(),
				text: text.trim(),
				completed: false,
				priority,
				category,
				createdAt: new Date(),
				updatedAt: new Date(),
			}
			setTodos(prev => [...prev, newTodo])
		},
		[generateId]
	)

	const toggleTodo = useCallback((id: string) => {
		setTodos(prev =>
			prev.map(todo =>
				todo.id === id
					? { ...todo, completed: !todo.completed, updatedAt: new Date() }
					: todo
			)
		)
	}, [])

	const deleteTodo = useCallback((id: string) => {
		setTodos(prev => prev.filter(todo => todo.id !== id))
	}, [])

	const editTodo = useCallback((id: string, newText: string) => {
		setTodos(prev =>
			prev.map(todo =>
				todo.id === id
					? { ...todo, text: newText.trim(), updatedAt: new Date() }
					: todo
			)
		)
	}, [])

	const updateTodoPriority = useCallback(
		(id: string, priority: 'low' | 'medium' | 'high') => {
			setTodos(prev =>
				prev.map(todo =>
					todo.id === id ? { ...todo, priority, updatedAt: new Date() } : todo
				)
			)
		},
		[]
	)

	const updateTodoCategory = useCallback((id: string, category: string) => {
		setTodos(prev =>
			prev.map(todo =>
				todo.id === id ? { ...todo, category, updatedAt: new Date() } : todo
			)
		)
	}, [])

	const setDueDate = useCallback((id: string, dueDate: Date | undefined) => {
		setTodos(prev =>
			prev.map(todo =>
				todo.id === id ? { ...todo, dueDate, updatedAt: new Date() } : todo
			)
		)
	}, [])

	const moveTodo = useCallback((fromIndex: number, toIndex: number) => {
		setTodos(prev => {
			const newTodos = [...prev]
			const [movedTodo] = newTodos.splice(fromIndex, 1)
			newTodos.splice(toIndex, 0, movedTodo)
			return newTodos
		})
	}, [])

	const clearCompleted = useCallback(() => {
		setTodos(prev => prev.filter(todo => !todo.completed))
	}, [])

	const clearAll = useCallback(() => {
		setTodos([])
	}, [])

	// Фильтрация и сортировка
	const filteredAndSortedTodos = todos
		.filter(todo => {
			// Фильтр по статусу
			if (filter === 'active') return !todo.completed
			if (filter === 'completed') return todo.completed

			// Поиск
			if (searchQuery) {
				return (
					todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
					todo.category.toLowerCase().includes(searchQuery.toLowerCase())
				)
			}

			return true
		})
		.sort((a, b) => {
			switch (sortBy) {
				case 'priority':
					const priorityOrder = { high: 3, medium: 2, low: 1 }
					return priorityOrder[b.priority] - priorityOrder[a.priority]
				case 'dueDate':
					if (!a.dueDate && !b.dueDate) return 0
					if (!a.dueDate) return 1
					if (!b.dueDate) return -1
					return a.dueDate.getTime() - b.dueDate.getTime()
				case 'alphabetical':
					return a.text.localeCompare(b.text)
				case 'created':
				default:
					return b.createdAt.getTime() - a.createdAt.getTime()
			}
		})

	// Статистика
	const stats: TodoStats = {
		total: todos.length,
		completed: todos.filter(todo => todo.completed).length,
		active: todos.filter(todo => !todo.completed).length,
		overdue: todos.filter(
			todo => !todo.completed && todo.dueDate && todo.dueDate < new Date()
		).length,
	}

	return {
		todos: filteredAndSortedTodos,
		allTodos: todos,
		filter,
		setFilter,
		sortBy,
		setSortBy,
		searchQuery,
		setSearchQuery,
		darkMode,
		setDarkMode,
		stats,
		addTodo,
		toggleTodo,
		deleteTodo,
		editTodo,
		updateTodoPriority,
		updateTodoCategory,
		setDueDate,
		moveTodo,
		clearCompleted,
		clearAll,
	}
}
