import TodoApp from './components/TodoApp'

export default function Home() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-secondary/20'>
			<div className='container mx-auto px-4 py-8'>
				<TodoApp />
			</div>
		</div>
	)
}
