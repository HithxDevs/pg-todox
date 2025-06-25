import React, { useState, useEffect } from 'react';
import { Plus, Check, X, User, LogOut } from 'lucide-react';

const api = "http://localhost:3000"

type Todo = {
    id: string;
    title: string;
    discription?: string; // Matching your backend spelling
    done: boolean;
};

export default function Todos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('User');
    const [newTodo, setNewTodo] = useState<{ title: string; discription?: string }>({ title: '', discription: '' }); // Matching backend spelling
    const [showAddForm, setShowAddForm] = useState(false);
    const [addingTodo, setAddingTodo] = useState(false);

    // Get token and username from localStorage
    const getToken = () => {
        return localStorage.getItem('token');
    };

    const getUserInfo = () => {
        const token = getToken();
        if (token) {
            try {
                // Decode JWT to get username (this is just for display, not for security)
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.username || 'User';
            } catch {
                return 'User';
            }
        }
        return 'User';
    };

           const markTodoAsDone = async (id: string) => {
    try {
        const response = await fetch( api +`/api/v1/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ done: true }) // ✅ Send done: true
        });

        if (!response.ok) throw new Error('Failed to update');

        // Optionally update only the changed todo instead of re-fetching all
        const updatedTodo = await response.json();

        setTodos(prev =>
            prev.map(todo => todo.id === id ? updatedTodo.todo : todo)
        );

    } catch (error) {
        console.error('Failed to mark as done', error);
        setError('Failed to mark as done.');
    }
};



    // Fetch todos from API
const fetchTodos = async () => {
    const token = getToken();
    if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
    }

    try {
        const response = await fetch(api+'/api/v1/todos', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setTodos(data.todos);
    } catch {
        setError("ERORRING");
    } finally {
        setLoading(false);
    }
};

    // Add new todo
    const addTodo = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!newTodo.title.trim()) return;

        const token = getToken();
        if (!token) {
            setError('No authentication token found');
            return;
        }

        setAddingTodo(true);
        try {
             console.log(JSON.stringify(newTodo));
            const response = await fetch(api+'/api/v1/todos', {
                method: 'POST',
                headers: {
                    'Authorization': `Barer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newTodo.title,
                    discription: newTodo.discription // Matching backend spelling
                })
            });
           

            if (response.ok) {
                setNewTodo({ title: '', discription: '' });
                setShowAddForm(false);
                fetchTodos(); // Refresh the list
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to add todo');
            }
        } catch {
            setError('Network error. Please check if the server is running.');
        } finally {
            setAddingTodo(false);
        }
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login page
    };

    useEffect(() => {
        setUsername(getUserInfo());
        fetchTodos();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your todos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Hi, {username}!</h1>
                                <p className="text-gray-600">Welcome back to your todos</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <X className="h-5 w-5 text-red-600 mr-2" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Add Todo Section */}
                <div className="bg-white rounded-lg shadow-sm border mb-6">
                    <div className="p-6">
                        {!showAddForm ? (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                            >
                                <Plus className="h-5 w-5 text-gray-400" />
                                <span className="text-gray-600">Add a new todo</span>
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={newTodo.title}
                                        onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter todo title"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={newTodo.discription}
                                        onChange={(e) => setNewTodo({...newTodo, discription: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter todo description (optional)"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={(e) => addTodo(e)}
                                        disabled={addingTodo}
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {addingTodo ? 'Adding...' : 'Add Todo'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setNewTodo({ title: '', discription: '' });
                                        }}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Todos List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Your Todos ({todos.length})
                        </h2>
                        <button
                            onClick={fetchTodos}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Refresh
                        </button>
                    </div>

                    {todos.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <Check className="h-16 w-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
                            <p className="text-gray-600">Get started by adding your first todo!</p>
                        </div>
                    ) : (
                        <div className="space-y-3" >
                    {todos.map((todo) => (
                        <div
                            key={todo.id}
                            onClick={() => markTodoAsDone(todo.id)}

                            className="cursor-pointer bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start space-x-3">
                            <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-1 ${
                                todo.done
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300 hover:border-green-400'
                                }`}
                            >
                                {todo.done && <Check className="h-3 w-3 text-white m-0.5" />}
                            </div>
                            <div className="flex-1">
                                <h3
                                className={`font-medium ${
                                    todo.done ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}
                                >
                                {todo.title}
                                </h3>
                                {todo.discription && (
                                <p
                                    className={`text-sm mt-1 ${
                                    todo.done ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                                    {todo.discription}
                                </p>
                                )}
                            </div>
                            <div className="flex-shrink-0">
                                <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    todo.done
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                                >
                                {todo.done ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                            </div>
                        </div>
                        ))}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}