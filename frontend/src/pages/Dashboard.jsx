import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import UserProfile from '../components/UserProfile';
import { Plus, LogOut, Layout, Search, Filter } from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks/');
            setTasks(res.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateOrUpdate = async (taskData) => {
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask.id}`, taskData);
            } else {
                await api.post('/tasks/', taskData);
            }
            fetchTasks();
            closeModal();
        } catch (error) {
            console.error("Failed to save task", error);
            alert("Failed to save task");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        try {
            await api.put(`/tasks/${id}`, { ...task, status: newStatus });
            // Optimistic update
            setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error("Failed to update status", error);
            fetchTasks(); // Revert on error
        }
    };

    const openModal = (task = null) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingTask(null);
        setIsModalOpen(false);
    };

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'all' || task.status === filter;
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'done').length,
        pending: tasks.filter(t => t.status !== 'done').length,
        rate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center text-white">
                                <Layout className="h-8 w-8" />
                                <span className="ml-2 font-bold text-xl tracking-tight">TaskFlow</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsProfileOpen(true)}
                                className="text-white text-sm hover:bg-white/10 focus:outline-none flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200"
                            >
                                <span className="font-medium">Hi, {user?.email}</span>
                            </button>
                            <button
                                onClick={logout}
                                className="p-2 rounded-full text-indigo-100 hover:text-white hover:bg-white/10 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <UserProfile
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
            />

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                        <p className="text-sm font-medium text-slate-500">Total Tasks</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                        <p className="text-sm font-medium text-slate-500">Completion Rate</p>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.rate}%</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                        <p className="text-sm font-medium text-slate-500">Pending</p>
                        <p className="text-3xl font-bold text-amber-500 mt-2">{stats.pending}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                        <p className="text-sm font-medium text-slate-500">Completed</p>
                        <p className="text-3xl font-bold text-emerald-500 mt-2">{stats.completed}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex flex-1 w-full sm:w-auto space-x-4">
                        <div className="relative flex-1 sm:max-w-xs">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Search tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-gray-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        New Task
                    </button>
                </div>

                {/* Task Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">No tasks found. Create one to get started!</p>
                        <button
                            onClick={() => openModal()}
                            className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Create a new task
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={openModal}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                )}
            </main>

            <TaskForm
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleCreateOrUpdate}
                initialData={editingTask}
            />
        </div>
    );
}
