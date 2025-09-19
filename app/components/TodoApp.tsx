'use client'

import React from 'react'
import TodoList from './TodoList'
import TodoInput from './TodoInput'
import TodoFilters from './TodoFilters'
import TodoSearch from './TodoSearch'
import TodoSort from './TodoSort'
import TodoStats from './TodoStats'
import { motion } from 'framer-motion'
import { FiSun, FiMoon, FiTrash2, FiSettings } from 'react-icons/fi'
import { useTodos } from '../hooks/useTodos'

const TodoApp: React.FC = () => {
	const {
		todos,
		allTodos,
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
	} = useTodos()

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className='w-full max-w-4xl mx-auto'
		>
			{/* Заголовок и настройки */}
			<div className='bg-card rounded-lg border border-border shadow-sm overflow-hidden mb-6'>
				<div className='p-6 border-b border-border'>
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
							Todo App
						</h1>
						<div className='flex items-center gap-2'>
							<motion.button
								whileTap={{ scale: 0.95 }}
								onClick={() => setDarkMode(!darkMode)}
								className='p-2 rounded-md hover:bg-secondary text-foreground transition-colors'
								title={
									darkMode
										? 'Переключить на светлую тему'
										: 'Переключить на темную тему'
								}
							>
								{darkMode ? (
									<FiSun className='text-lg' />
								) : (
									<FiMoon className='text-lg' />
								)}
							</motion.button>
						</div>
					</div>

					<TodoInput onAdd={addTodo} />
				</div>
			</div>

			{/* Статистика */}
			<TodoStats stats={stats} />

			{/* Поиск и сортировка */}
			<div className='bg-card rounded-lg border border-border shadow-sm overflow-hidden mb-6'>
				<div className='p-6'>
					<TodoSearch
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
					/>
					<TodoSort sortBy={sortBy} onSortChange={setSortBy} />
				</div>
			</div>

			{/* Фильтры и список задач */}
			<div className='bg-card rounded-lg border border-border shadow-sm overflow-hidden mb-6'>
				<div className='p-6'>
					<TodoFilters filter={filter} onFilterChange={setFilter} />
				</div>

				<div className='border-t border-border'>
					<TodoList
						todos={todos}
						allTodos={allTodos}
						onToggle={toggleTodo}
						onDelete={deleteTodo}
						onEdit={editTodo}
						onMove={moveTodo}
						onUpdatePriority={updateTodoPriority}
						onUpdateCategory={updateTodoCategory}
						onSetDueDate={setDueDate}
						searchQuery={searchQuery}
					/>
				</div>
			</div>

			{/* Действия */}
			<div className='bg-card rounded-lg border border-border shadow-sm overflow-hidden'>
				<div className='p-6'>
					<div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
						<div className='text-sm text-muted-foreground'>
							{stats.active}{' '}
							{stats.active === 1 ? 'задача осталась' : 'задач осталось'}
							{stats.overdue > 0 && (
								<span className='text-destructive ml-2'>
									({stats.overdue} просрочено)
								</span>
							)}
						</div>

						<div className='flex gap-2'>
							<motion.button
								whileTap={{ scale: 0.95 }}
								onClick={clearCompleted}
								disabled={!allTodos.some(todo => todo.completed)}
								className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
									allTodos.some(todo => todo.completed)
										? 'text-destructive hover:bg-destructive/10'
										: 'text-muted-foreground cursor-not-allowed'
								}`}
							>
								<FiTrash2 />
								<span>Очистить выполненные</span>
							</motion.button>

							{allTodos.length > 0 && (
								<motion.button
									whileTap={{ scale: 0.95 }}
									onClick={clearAll}
									className='flex items-center gap-2 px-3 py-1.5 rounded text-sm text-destructive hover:bg-destructive/10 transition-colors'
								>
									<FiSettings />
									<span>Очистить все</span>
								</motion.button>
							)}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default TodoApp
