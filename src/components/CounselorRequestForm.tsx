import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SchoolName } from '@/types';

export default function CounselorRequestForm() {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/counselor-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: user.name,
          email: user.email,
          school: user.school,
          reason,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit request');
      }

      setSuccess(true);
      setReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Please log in to submit a counselor request.
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-4 bg-green-100 text-green-700 rounded-lg">
        Your request has been submitted successfully! We will review it and get back to you soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-200 mb-1">
          Why do you want to become a counselor?
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2 bg-[#383A40] text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors
          ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
} 