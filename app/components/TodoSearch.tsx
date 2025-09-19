'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiX } from 'react-icons/fi'
import styles from './TodoSearch.module.css'

interface TodoSearchProps {
	searchQuery: string
	onSearchChange: (query: string) => void
}

const TodoSearch: React.FC<TodoSearchProps> = ({
	searchQuery,
	onSearchChange,
}) => {
	const handleClear = () => {
		onSearchChange('')
	}

	return (
		<div className={styles.searchContainer}>
			<div className={styles.searchInputWrapper}>
				<FiSearch className={styles.searchIcon} />
				<input
					type='text'
					value={searchQuery}
					onChange={e => onSearchChange(e.target.value)}
					placeholder='Поиск задач...'
					className={styles.searchInput}
				/>
				{searchQuery && (
					<motion.button
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						whileTap={{ scale: 0.9 }}
						onClick={handleClear}
						className={styles.clearButton}
						aria-label='Очистить поиск'
					>
						<FiX />
					</motion.button>
				)}
			</div>
		</div>
	)
}

export default TodoSearch
