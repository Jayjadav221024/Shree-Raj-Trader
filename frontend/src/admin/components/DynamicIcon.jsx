import React from 'react';
import * as Icons from 'lucide-react';

export default function DynamicIcon({ name, className = 'h-4 w-4' }) {
  const IconComponent = Icons[name];
  if (!IconComponent) {
    return <Icons.HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
}
