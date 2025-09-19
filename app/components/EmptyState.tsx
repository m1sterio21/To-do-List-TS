'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiPlus, FiSearch } from 'react-icons/fi'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
	type: 'empty' | 'no-results' | 'all-completed'
	searchQuery?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, searchQuery }) => {
	const getContent = () => {
		switch (type) {
			case 'empty':
				return {
					icon: <FiPlus className={styles.icon} />,
					title: 'Список задач пуст',
					description: 'Добавьте новую задачу, чтобы начать работу',
					action: 'Начните с добавления первой задачи',
				}
			case 'no-results':
				return {
					icon: <FiSearch className={styles.icon} />,
					title: 'Ничего не найдено',
					description: searchQuery
						? `По запросу "${searchQuery}" ничего не найдено`
						: 'Попробуйте изменить параметры поиска',
					action: 'Попробуйте другой поисковый запрос',
				}
			case 'all-completed':
				return {
					icon: <FiCheckCircle className={styles.icon} />,
					title: 'Все задачи выполнены!',
					description: 'Отличная работа! Все ваши задачи завершены',
					action: 'Добавьте новые задачи или отдохните',
				}
			default:
				return {
					icon: <FiPlus className={styles.icon} />,
					title: 'Список задач пуст',
					description: 'Добавьте новую задачу, чтобы начать работу',
					action: 'Начните с добавления первой задачи',
				}
		}
	}

	const content = getContent()

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={styles.container}
		>
			<motion.div
				initial={{ scale: 0.8 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
				className={styles.iconContainer}
			>
				{content.icon}
			</motion.div>

			<motion.h3
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
				className={styles.title}
			>
				{content.title}
			</motion.h3>

			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				className={styles.description}
			>
				{content.description}
			</motion.p>

			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className={styles.action}
			>
				{content.action}
			</motion.p>
		</motion.div>
	)
}

export default EmptyState
