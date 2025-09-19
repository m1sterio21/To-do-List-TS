'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiFlag, FiTag } from 'react-icons/fi'
import styles from './TodoInput.module.css'

interface TodoInputProps {
	onAdd: (
		text: string,
		priority: 'low' | 'medium' | 'high',
		category: string
	) => void
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
	const [inputValue, setInputValue] = useState('')
	const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
	const [category, setCategory] = useState('Общие')
	const [showAdvanced, setShowAdvanced] = useState(false)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (inputValue.trim()) {
			onAdd(inputValue.trim(), priority, category)
			setInputValue('')
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubmit(e as unknown as React.FormEvent)
		}
	}

	return (
		<div className={styles.inputContainer}>
			<form onSubmit={handleSubmit} className={styles.todoForm}>
				<input
					type='text'
					value={inputValue}
					onChange={handleInputChange}
					onKeyPress={handleKeyPress}
					placeholder='Что нужно сделать?'
					className={styles.todoInput}
				/>
				<button
					type='submit'
					className={styles.todoButton}
					disabled={!inputValue.trim()}
				>
					<FiPlus className={styles.buttonIcon} />
					<span className={styles.buttonText}>Добавить</span>
				</button>
			</form>

			<motion.button
				whileTap={{ scale: 0.95 }}
				onClick={() => setShowAdvanced(!showAdvanced)}
				className={styles.advancedToggle}
			>
				<span>Дополнительно</span>
				<motion.span
					animate={{ rotate: showAdvanced ? 180 : 0 }}
					transition={{ duration: 0.2 }}
				>
					▼
				</motion.span>
			</motion.button>

			<motion.div
				initial={false}
				animate={{
					height: showAdvanced ? 'auto' : 0,
					opacity: showAdvanced ? 1 : 0,
				}}
				transition={{ duration: 0.3 }}
				className={styles.advancedOptions}
			>
				<div className={styles.optionGroup}>
					<label className={styles.optionLabel}>
						<FiFlag className={styles.optionIcon} />
						Приоритет:
					</label>
					<select
						value={priority}
						onChange={e =>
							setPriority(e.target.value as 'low' | 'medium' | 'high')
						}
						className={styles.optionSelect}
					>
						<option value='low'>Низкий</option>
						<option value='medium'>Средний</option>
						<option value='high'>Высокий</option>
					</select>
				</div>

				<div className={styles.optionGroup}>
					<label className={styles.optionLabel}>
						<FiTag className={styles.optionIcon} />
						Категория:
					</label>
					<input
						type='text'
						value={category}
						onChange={e => setCategory(e.target.value)}
						placeholder='Введите категорию'
						className={styles.optionInput}
					/>
				</div>
			</motion.div>
		</div>
	)
}

export default TodoInput
