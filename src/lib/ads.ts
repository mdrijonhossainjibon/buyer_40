 
export const LoadAds = (data: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const fnName = `show_${data}`; // e.g., "show_9827587"
  
      const fn = (window as any)[fnName];
  
      if (typeof fn === "function") {
        Promise.resolve(fn())
          .then(() => {
            console.log("finished");
            resolve();
          })
          .catch((err) => {
            console.error(`Error running ${fnName}:`, err);
            reject(err);
          });
      } else {
        const errMsg = `Function ${fnName} not found on window`;
        console.error(errMsg);
        reject(new Error(errMsg));
      }
    });
  };
 




  export async function showAlternatingAds(zoneId: string) {
  // Define all ad providers in rotation
  const ads = ["giga", "adexora" ,'load']

  // Get last state from localStorage
  let lastAd = localStorage.getItem("lastAd")

  // Find index of last shown ad
  let lastIndex = ads.indexOf(lastAd || "")

  // Calculate next ad index (rotate)
  let nextIndex = (lastIndex + 1) % ads.length
  let nextAd = ads[nextIndex]

  // Show the next ad
  if (nextAd === "load") {
    await LoadAds(zoneId)
  } else if (nextAd === "giga") {
    await window.showGiga?.()
  } else if (nextAd === "adexora") {
    await window.showAdexora?.()
  }

  // Save state
  localStorage.setItem("lastAd", nextAd)

  return nextAd
}