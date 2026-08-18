import { useEffect } from 'react';

export default function SEO({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Shree Raj Traders`;
    } else {
      document.title = "Shree Raj Traders | Siemens Switchgears, Motors, FRP Gratings & Cable Tray";
    }

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return null;
}
