import { ReactNode } from 'react';
import { BsInboxFill } from 'react-icons/bs';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, message, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-primary/5 rounded-full p-4 mb-4">
        {icon || <BsInboxFill className="text-4xl text-primary/60" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-4">{message}</p>
      {action}
    </div>
  );
} 