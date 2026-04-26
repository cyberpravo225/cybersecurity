(function () {
  const previewButtons = document.querySelectorAll('[data-preview-src]');

  if (!previewButtons.length) return;

  previewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const presentationPath = button.getAttribute('data-preview-src');
      if (!presentationPath) return;

      const absoluteUrl = new URL(presentationPath, window.location.href).href;
      const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(absoluteUrl)}`;

      window.open(officeViewerUrl, '_blank', 'noopener');
    });
  });
})();
