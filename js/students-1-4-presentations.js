(function () {
  const viewer = document.getElementById('presentation-viewer');
  const frame = document.getElementById('presentation-viewer-frame');
  const download = document.getElementById('presentation-viewer-download');
  const title = document.getElementById('presentation-viewer-title');

  if (!viewer || !frame || !download || !title) return;

  const previewButtons = document.querySelectorAll('[data-preview-src]');

  previewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const presentationPath = button.getAttribute('data-preview-src');
      if (!presentationPath) return;

      const absoluteUrl = new URL(presentationPath, window.location.href).href;
      const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`;

      frame.src = officeViewerUrl;
      download.href = presentationPath;

      const cardTitle = button.closest('.senior-card')?.querySelector('h3')?.textContent?.trim();
      title.textContent = cardTitle ? `Просмотр: ${cardTitle}` : 'Просмотр презентации';

      viewer.hidden = false;
      viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
