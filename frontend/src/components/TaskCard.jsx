import { Trash2, Edit2, CheckCircle, Circle, Clock } from 'lucide-react';
import clsx from 'clsx';

const statusColors = {
    todo: 'text-gray-500 bg-gray-100',
    'in-progress': 'text-blue-600 bg-blue-50',
    done: 'text-green-600 bg-green-50',
};

const statusIcons = {
    todo: Circle,
    'in-progress': Clock,
    done: CheckCircle,
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
    const StatusIcon = statusIcons[task.status] || Circle;

    // Function to cycle status or just show dropdown? 
    // For simplicity, let's just have a Quick Action to mark as Done or cycle.
    const handleStatusClick = () => {
        const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
        onStatusChange(task.id, nextStatus);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-gray-500 mt-1 text-sm line-clamp-2">{task.description}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <button
                    onClick={handleStatusClick}
                    className={clsx(
                        "flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors",
                        statusColors[task.status]
                    )}
                >
                    <StatusIcon size={14} />
                    <span>{task.status}</span>
                </button>
                <span className="text-xs text-gray-400">
                    {new Date(task.created_at).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
}
