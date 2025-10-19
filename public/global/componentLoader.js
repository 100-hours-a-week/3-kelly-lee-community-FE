
export async function componentLoader(targetId, basePath, isCss, isJs, replacements) {
    const target = document.getElementById(targetId);


    try {
        const response = await fetch(`${basePath}.html`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        let html = await response.text();

       if (replacements) {
            for (const [key, value] of Object.entries(replacements)) {
                html = html.replaceAll(`__${key.toUpperCase()}__`, String(value));
            }

        }

        target.innerHTML = html;
        
        if (isCss && !document.querySelector(`link[href="${basePath}.css"]`)) {
            const cssLink = document.createElement("link");
            cssLink.rel = "stylesheet";
            cssLink.href = `${basePath}.css`;
            cssLink.onerror = () => cssLink.remove;
            document.head.appendChild(cssLink);
        }

        if (isJs && !document.querySelector(`script[src="${basePath}.js"]`)) {
            const jsScript = document.createElement("script");
            jsScript.src = `${basePath}.js`;
            jsScript.type = "module";
            jsScript.defer = true;
            jsScript.onerror = () => jsScript.remove;
            document.body.appendChild(jsScript);
        }

    } catch (err) {

    }
  

}