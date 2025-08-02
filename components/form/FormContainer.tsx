'use client';
// this is client component 
// form wrapper - it is essention for showing toast messages 
// it takes two things - formaction from server and children inputs
// entire project wherever form toast messages is needed 
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { actionFunction } from '@/utils/types';

const initialState = {
  message: '',
};

function FormContainer({
  action,
  children,
}: {
  action: actionFunction;
  children: React.ReactNode;
}) {
  const [state, formAction] = useFormState(action, initialState);
  const timestamp = new Date().toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  
  useEffect(() => {
    if (state.message) {
        toast(state.message, {
            description: timestamp,
          });          
    }
  }, [state]);
  return <form action={formAction}>{children}</form>;
}
export default FormContainer;