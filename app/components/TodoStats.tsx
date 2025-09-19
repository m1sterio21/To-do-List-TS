'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiClock, FiAlertTriangle, FiList } from 'react-icons/fi'
import { TodoStats as TodoStatsType } from '../types/todo'
import styles from './TodoStats.module.css'

interface TodoStatsProps {
	stats: TodoStatsType
}

const TodoStats: React.FC<TodoStatsProps> = ({ stats }) => {
	const statItems = [
		{
			label: 'Всего',
			value: stats.total,
			icon: FiList,
			color: 'var(--muted-foreground)',
		},
		{
			label: 'Активные',
			value: stats.active,
			icon: FiClock,
			color: 'var(--primary)',
		},
		{
			label: 'Выполнено',
			value: stats.completed,
			icon: FiCheckCircle,
			color: 'var(--primary)',
		},
		{
			label: 'Просрочено',
			value: stats.overdue,
			icon: FiAlertTriangle,
			color: 'var(--destructive)',
		},
	]

	const completionPercentage =
		stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className={styles.statsContainer}
		>
			<div className={styles.statsGrid}>
				{statItems.map(({ label, value, icon: Icon, color }) => (
					<motion.div
						key={label}
						whileHover={{ scale: 1.05 }}
						className={styles.statItem}
					>
						<div className={styles.statIcon} style={{ color }}>
							<Icon />
						</div>
						<div className={styles.statContent}>
							<div className={styles.statValue} style={{ color }}>
								{value}
							</div>
							<div className={styles.statLabel}>{label}</div>
						</div>
					</motion.div>
				))}
			</div>

			{stats.total > 0 && (
				<div className={styles.progressContainer}>
					<div className={styles.progressLabel}>
						Прогресс выполнения: {completionPercentage}%
					</div>
					<div className={styles.progressBar}>
						<motion.div
							className={styles.progressFill}
							initial={{ width: 0 }}
							animate={{ width: `${completionPercentage}%` }}
							transition={{ duration: 0.5, ease: 'easeOut' }}
						/>
					</div>
				</div>
			)}
		</motion.div>
	)
}

export default TodoStats
