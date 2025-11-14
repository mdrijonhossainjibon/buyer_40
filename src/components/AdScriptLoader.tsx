import { useEffect } from "react";

interface Props {
  type: "libtl" | "gigapub" | "adexora";
  zoneId: string;
  scriptId: string; // unique for removing/reloading
}

export default function AdScriptLoader({ type, zoneId, scriptId }: Props) {
  useEffect(() => {
    if (!zoneId) return;

    // Remove previous script (avoid duplicate ads)
    const old = document.getElementById(scriptId);
    if (old) old.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;

    // Select correct script URL
    if (type === "libtl") {
      script.src = "//libtl.com/sdk.js";
      script.dataset.zone = zoneId;
      script.dataset.sdk = `show_${zoneId}`;
    }

    if (type === "gigapub") {
      script.src = `https://ad.gigapub.tech/script?id=${zoneId}`;
    }

    if (type === "adexora") {
      script.src = `https://adexora.com/cdn/ads.js?id=310`;
    }

    document.body.appendChild(script);

    return () => script.remove();
  }, [zoneId, type]);

  return <div id={`ad-container-${scriptId}`} />;
}
