'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	FiEdit,
	FiTrash2,
	FiCheck,
	FiX,
	FiFlag,
	FiTag,
	FiCalendar,
} from 'react-icons/fi'
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragStartEvent,
	DragEndEvent,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Todo } from '../types/todo'
import { getPriorityLabel } from '../utils/priorityUtils'
import { getRelativeDate } from '../utils/dateUtils'
import EmptyState from './EmptyState'
import styles from './TodoList.module.css'

interface TodoListProps {
	todos: Todo[]
	allTodos: Todo[]
	onToggle: (id: string) => void
	onDelete: (id: string) => void
	onEdit: (id: string, text: string) => void
	onMove: (fromIndex: number, toIndex: number) => void
	onUpdatePriority?: (id: string, priority: 'low' | 'medium' | 'high') => void
	onUpdateCategory?: (id: string, category: string) => void
	onSetDueDate?: (id: string, dueDate: Date | undefined) => void
	searchQuery?: string
}

// SortableItem component
interface SortableItemProps {
	todo: Todo
	index: number
	onToggle: (id: string) => void
	onDelete: (id: string) => void
	onEditStart: (id: string, text: string) => void
	editingId: string | null
	editText: string
	setEditText: (text: string) => void
	onEditSave: (id: string) => void
	onEditCancel: () => void
	onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void
	editInputRef: React.RefObject<HTMLInputElement>
	onUpdatePriority?: (id: string, priority: 'low' | 'medium' | 'high') => void
	onUpdateCategory?: (id: string, category: string) => void
	onSetDueDate?: (id: string, dueDate: Date | undefined) => void
}

const SortableItem: React.FC<SortableItemProps> = ({
	todo,
	index,
	onToggle,
	onDelete,
	onEditStart,
	editingId,
	editText,
	setEditText,
	onEditSave,
	onEditCancel,
	onKeyPress,
	editInputRef,
	onUpdatePriority,
	onUpdateCategory,
	onSetDueDate,
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: todo.id,
		disabled: editingId === todo.id, // Отключаем drag во время редактирования
	})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : undefined,
		opacity: isDragging ? 0.8 : 1,
	}

	return (
		<motion.li
			ref={setNodeRef}
			style={style}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, x: -100 }}
			transition={{ duration: 0.3 }}
			className={`${styles.todoItem} ${isDragging ? styles.dragging : ''} ${
				todo.completed ? styles.completed : ''
			}`}
			{...attributes}
			{...listeners}
		>
			<div className={styles.todoItemContent}>
				<motion.button
					whileTap={{ scale: 0.9 }}
					onClick={e => {
						e.stopPropagation() // Предотвращаем срабатывание drag
						onToggle(todo.id)
					}}
					className={`${styles.checkbox} ${
						todo.completed ? styles.checked : ''
					}`}
				>
					{todo.completed && <FiCheck />}
				</motion.button>

				{editingId === todo.id ? (
					<div className={styles.editInputContainer}>
						<input
							ref={editInputRef}
							type='text'
							value={editText}
							onChange={e => setEditText(e.target.value)}
							onBlur={() => onEditSave(todo.id)}
							onKeyDown={e => onKeyPress(e, todo.id)}
							className={styles.editInput}
						/>
						<div className={styles.editButtons}>
							<button
								onClick={e => {
									e.stopPropagation()
									onEditSave(todo.id)
								}}
								className={`${styles.editButton} ${styles.save}`}
							>
								<FiCheck />
							</button>
							<button
								onClick={e => {
									e.stopPropagation()
									onEditCancel()
								}}
								className={`${styles.editButton} ${styles.cancel}`}
							>
								<FiX />
							</button>
						</div>
					</div>
				) : (
					<div className={styles.todoContent}>
						<motion.span
							whileTap={{ scale: 0.95 }}
							onClick={e => {
								e.stopPropagation() // Предотвращаем срабатывание drag
								onEditStart(todo.id, todo.text)
							}}
							className={`${styles.todoText} ${
								todo.completed ? styles.completed : ''
							}`}
						>
							{todo.text}
						</motion.span>
						<div className={styles.todoMeta}>
							<div className={styles.todoTags}>
								<span
									className={`${styles.priorityTag} ${styles[todo.priority]}`}
								>
									<FiFlag />
									{getPriorityLabel(todo.priority)}
								</span>
								<span className={styles.categoryTag}>
									<FiTag />
									{todo.category}
								</span>
								{todo.dueDate && (
									<span
										className={`${styles.dueDateTag} ${
											todo.dueDate < new Date() && !todo.completed
												? styles.overdue
												: ''
										}`}
									>
										<FiCalendar />
										{getRelativeDate(todo.dueDate)}
									</span>
								)}
							</div>
						</div>
					</div>
				)}
			</div>

			{editingId !== todo.id && (
				<div className={styles.actionButtons}>
					<motion.button
						whileTap={{ scale: 0.9 }}
						onClick={e => {
							e.stopPropagation() // Предотвращаем срабатывание drag
							onEditStart(todo.id, todo.text)
						}}
						className={`${styles.actionButton} ${styles.edit}`}
					>
						<FiEdit />
					</motion.button>
					<motion.button
						whileTap={{ scale: 0.9 }}
						onClick={e => {
							e.stopPropagation() // Предотвращаем срабатывание drag
							onDelete(todo.id)
						}}
						className={`${styles.actionButton} ${styles.delete}`}
						aria-label='Удалить задачу'
					>
						<FiTrash2 />
					</motion.button>
				</div>
			)}
		</motion.li>
	)
}

const TodoList: React.FC<TodoListProps> = ({
	todos,
	allTodos,
	onToggle,
	onDelete,
	onEdit,
	onMove,
	onUpdatePriority,
	onUpdateCategory,
	onSetDueDate,
	searchQuery,
}) => {
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editText, setEditText] = useState('')
	const [activeId, setActiveId] = useState<string | null>(null)
	const editInputRef = useRef<HTMLInputElement>(null)

	// Фокус на поле ввода при начале редактирования
	useEffect(() => {
		if (editingId && editInputRef.current) {
			editInputRef.current.focus()
		}
	}, [editingId])

	const handleEditStart = (id: string, text: string) => {
		setEditingId(id)
		setEditText(text)
	}

	const handleEditSave = (id: string) => {
		if (editText.trim()) {
			onEdit(id, editText.trim())
		}
		setEditingId(null)
	}

	const handleEditCancel = () => {
		setEditingId(null)
	}

	const handleKeyPress = (
		e: React.KeyboardEvent<HTMLInputElement>,
		id: string
	) => {
		if (e.key === 'Enter') {
			handleEditSave(id)
		} else if (e.key === 'Escape') {
			handleEditCancel()
		}
	}

	// Dnd-kit handlers
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (over && active.id !== over.id) {
			const oldIndex = todos.findIndex(todo => todo.id === active.id)
			const newIndex = todos.findIndex(todo => todo.id === over.id)

			if (oldIndex !== -1 && newIndex !== -1) {
				onMove(oldIndex, newIndex)
			}
		}

		setActiveId(null)
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<ul className={styles.todoList}>
				<AnimatePresence>
					<SortableContext
						items={todos.map(todo => todo.id)}
						strategy={verticalListSortingStrategy}
					>
						{todos.map((todo, index) => (
							<SortableItem
								key={todo.id}
								todo={todo}
								index={index}
								onToggle={onToggle}
								onDelete={onDelete}
								onEditStart={handleEditStart}
								editingId={editingId}
								editText={editText}
								setEditText={setEditText}
								onEditSave={handleEditSave}
								onEditCancel={handleEditCancel}
								onKeyPress={handleKeyPress}
								editInputRef={editInputRef}
								onUpdatePriority={onUpdatePriority}
								onUpdateCategory={onUpdateCategory}
								onSetDueDate={onSetDueDate}
							/>
						))}
					</SortableContext>
				</AnimatePresence>

				{todos.length === 0 && (
					<EmptyState
						type={
							allTodos.length === 0
								? 'empty'
								: searchQuery
								? 'no-results'
								: 'all-completed'
						}
						searchQuery={searchQuery}
					/>
				)}
			</ul>
		</DndContext>
	)
}

export default TodoList
