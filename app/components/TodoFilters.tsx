"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiList, FiClock, FiCheckCircle } from 'react-icons/fi';
import styles from './TodoFilters.module.css';

interface TodoFiltersProps {
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ filter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'Все', icon: FiList },
    { key: 'active', label: 'Активные', icon: FiClock },
    { key: 'completed', label: 'Выполненные', icon: FiCheckCircle },
  ];

  return (
    <div className={styles.filterContainer}>
      {filters.map(({ key, label, icon: Icon }) => (
        <motion.button
          key={key}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(key as 'all' | 'active' | 'completed')}
          className={`${styles.filterButton} ${filter === key ? styles.active : ''}`}
        >
          <Icon className={styles.filterIcon} />
          <span className={styles.filterLabel}>{label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default TodoFilters;