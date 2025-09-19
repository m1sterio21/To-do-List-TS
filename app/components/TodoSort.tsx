'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowUp, FiCalendar, FiFlag, FiList } from 'react-icons/fi'
import { SortType } from '../types/todo'
import styles from './TodoSort.module.css'

interface TodoSortProps {
	sortBy: SortType
	onSortChange: (sort: SortType) => void
}

const TodoSort: React.FC<TodoSortProps> = ({ sortBy, onSortChange }) => {
	const sortOptions = [
		{ key: 'created', label: 'По дате создания', icon: FiCalendar },
		{ key: 'priority', label: 'По приоритету', icon: FiFlag },
		{ key: 'dueDate', label: 'По сроку', icon: FiCalendar },
		{ key: 'alphabetical', label: 'По алфавиту', icon: FiArrowUp },
	] as const

	return (
		<div className={styles.sortContainer}>
			<div className={styles.sortLabel}>
				<FiArrowUp className={styles.sortIcon} />
				<span>Сортировка:</span>
			</div>
			<select
				value={sortBy}
				onChange={e => onSortChange(e.target.value as SortType)}
				className={styles.sortSelect}
			>
				{sortOptions.map(({ key, label }) => (
					<option key={key} value={key}>
						{label}
					</option>
				))}
			</select>
		</div>
	)
}

export default TodoSort
