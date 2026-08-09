import { Pencil, Trash2, Activity } from "lucide-react";

interface RowActionsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onViewActivity?: () => void;
}

const iconButtonClass = "p-1.5 rounded hover:bg-bgSecondary cursor-pointer transition-colors";

const RowActions = ({ onEdit, onDelete, onViewActivity }: RowActionsProps) => {
    const stop = (e: React.MouseEvent, handler?: () => void) => {
        e.stopPropagation();
        handler?.();
    };

    return (
        <div className="flex items-center gap-1">
            {onViewActivity && (
                <button
                    type="button"
                    title="View Activity"
                    onClick={(e) => stop(e, onViewActivity)}
                    className={`${iconButtonClass} text-blue-600 hover:text-blue-700`}
                >
                    <Activity className="h-4 w-4" />
                </button>
            )}
            {onEdit && (
                <button
                    type="button"
                    title="Edit"
                    onClick={(e) => stop(e, onEdit)}
                    className={`${iconButtonClass} text-textSecondary hover:text-textPrimary`}
                >
                    <Pencil className="h-4 w-4" />
                </button>
            )}
            {onDelete && (
                <button
                    type="button"
                    title="Delete"
                    onClick={(e) => stop(e, onDelete)}
                    className={`${iconButtonClass} text-red-600 hover:text-red-700`}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default RowActions;
