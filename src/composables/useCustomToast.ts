import { useToast } from 'primevue/usetoast';
import type { ToastMessageOptions } from 'primevue/toast';

type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

interface ToastOptions {
  title?: string;
  message: string;
  duration?: number;
  severity?: ToastSeverity;
}

export default function useCustomToast() {
  const toast = useToast();

  const showToast = (options: ToastOptions | string) => {
    const config: ToastMessageOptions = typeof options === 'string' 
      ? { detail: options }
      : {
          summary: options.title || getDefaultTitle(options.severity),
          detail: options.message,
          life: options.duration || 3000,
          severity: options.severity || 'info'
        };

    toast.add(config);
  };

  const showSuccess = (message: string, title?: string) => {
    showToast({
      title: title || 'Sucesso',
      message,
      severity: 'success'
    });
  };

  const showError = (message: string, title?: string) => {
    showToast({
      title: title || 'Erro',
      message,
      severity: 'error',
      duration: 5000
    });
  };

  const showWarning = (message: string, title?: string) => {
    showToast({
      title: title || 'Atenção',
      message,
      severity: 'warn'
    });
  };

  const showInfo = (message: string, title?: string) => {
    showToast({
      title: title || 'Informação',
      message,
      severity: 'info'
    });
  };

  const getDefaultTitle = (severity?: ToastSeverity): string => {
    switch (severity) {
      case 'success': return 'Sucesso';
      case 'error': return 'Erro';
      case 'warn': return 'Atenção';
      default: return 'Informação';
    }
  };

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}