/**
 * Componente: Modal Reutilizable
 */
export default function Modal({ isOpen, onClose, title, message, type = 'info', confirmText = 'Aceptar', onConfirm, showCancel = false, cancelText = 'Cancelar' }) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <div className="p-3 bg-green-500/20 rounded-full">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="p-3 bg-red-500/20 rounded-full">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case 'warning':
                return (
                    <div className="p-3 bg-yellow-500/20 rounded-full">
                        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="p-3 bg-blue-500/20 rounded-full">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return 'border-green-500/50 text-green-400';
            case 'error': return 'border-red-500/50 text-red-400';
            case 'warning': return 'border-yellow-500/50 text-yellow-400';
            default: return 'border-blue-500/50 text-blue-400';
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'success': return 'bg-green-600 hover:bg-green-700';
            case 'error': return 'bg-red-600 hover:bg-red-700';
            case 'warning': return 'bg-yellow-600 hover:bg-yellow-700';
            default: return 'bg-blue-600 hover:bg-blue-700';
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className={`bg-dark-800 border-2 ${getColor()} rounded-2xl p-8 max-w-md w-full shadow-2xl animate-slide-up`}
                onClick={(e) => e.stopPropagation()}
                style={{
                    animation: 'slideUp 0.3s ease-out'
                }}
            >
                <div className="flex items-center gap-4 mb-4">
                    {getIcon()}
                    <h2 className={`text-2xl font-bold ${getColor().split(' ')[1]}`}>{title}</h2>
                </div>
                <p className="text-gray-300 mb-6 text-lg">
                    {message}
                </p>
                <div className="flex gap-4">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg border border-gray-600 transition-all font-semibold"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={onConfirm || onClose}
                        className={`${showCancel ? 'flex-1' : 'w-full'} px-6 py-3 ${getButtonColor()} text-white rounded-lg font-semibold transition-all`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
