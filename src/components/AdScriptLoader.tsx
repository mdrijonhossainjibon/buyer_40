import { useEffect } from "react";

interface Props {
  zoneId: string;
  scriptId: string; // unique for removing/reloading
}

export default function AdScriptLoader({ zoneId, scriptId }: Props) {
  useEffect(() => {
    if (!zoneId) return;

    // Remove existing script
    const oldScript = document.getElementById(scriptId);
    if (oldScript) oldScript.remove();

    // Create new script
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "//libtl.com/sdk.js";
    script.dataset.zone = zoneId;
    script.dataset.sdk = `show_${zoneId}`;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [zoneId]);

  return <div id={`ad-container-${zoneId}`}></div>;
}
