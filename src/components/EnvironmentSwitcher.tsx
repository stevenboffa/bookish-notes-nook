
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export const EnvironmentSwitcher = () => {
  const [isStaging, setIsStaging] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get current environment setting
    const currentSetting = import.meta.env.VITE_USE_STAGING === 'true';
    setIsStaging(currentSetting);
  }, []);

  const toggleEnvironment = () => {
    // This will trigger a full page reload with the new environment
    const newValue = !isStaging;
    localStorage.setItem('preferredEnvironment', newValue ? 'staging' : 'production');
    
    toast({
      title: `Switching to ${newValue ? 'Staging' : 'Production'}`,
      description: "The page will reload to apply the changes.",
    });
    
    // Small delay to show the toast before reload
    setTimeout(() => {
      window.location.href = `${window.location.origin}${window.location.pathname}?env=${newValue ? 'staging' : 'production'}`;
    }, 1000);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleEnvironment}
      className={`text-xs ${isStaging ? 'bg-blue-50' : 'bg-green-50'}`}
    >
      {isStaging ? '🧪 Staging' : '🚀 Production'}
    </Button>
  );
};

export default EnvironmentSwitcher;
