document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('button-grid');
  let currentDetailPanel = null;
  if (!grid) return;

  function getGridStructure() {
    const cs = window.getComputedStyle(grid);
    const columnsRaw = cs.getPropertyValue('grid-template-columns').trim();
    const rowsRaw = cs.getPropertyValue('grid-template-rows').trim();

    const columns = columnsRaw ? columnsRaw.split(/\s+/).filter(Boolean).length : 0;
    const rows = rowsRaw ? rowsRaw.split(/\s+/).filter(Boolean).length : 0;

    const colCount = Number(columns) || 0;
    const rowCount = Number(rows) || 0;

    const result = { columns: colCount, rows: rowCount };
    // console.log(`Grid: ${colCount} column${colCount !== 1 ? 's' : ''} × ${rowCount} row${rowCount !== 1 ? 's' : ''}`, result);
    return result;
  }

  function getRowIndex(element) {
    // data-id is 1-based (loop.index). Convert to Number and return a 1-based row index.
    const id = Number(element.dataset.id);
    const columnsPerRow = Number(getGridStructure().columns) || 1; // avoid divide-by-zero
    if (!Number.isFinite(id) || id < 1) return -1;
    return Math.ceil(id / columnsPerRow);
  }

  function getlastItemInRow(rowIndex) {
    const { columns } = getGridStructure();
    if (columns === 0) return null;
    if (!Number.isFinite(rowIndex) || rowIndex < 1) return null;

    const lastItemId = rowIndex * columns;
    const firstItemId = (rowIndex - 1) * columns + 1;

    // direct hit (full row)
    let el = grid.querySelector(`.btn-item[data-id="${lastItemId}"]`);
    if (el) return el;

    // row isn't full — find the highest id within the row range
    const candidates = Array.from(grid.querySelectorAll('.btn-item')).map(node => ({
      node,
      id: Number(node.dataset.id)
    })).filter(x => Number.isFinite(x.id) && x.id >= firstItemId && x.id <= lastItemId);

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => a.id - b.id);
    return candidates[candidates.length - 1].node;
  }

  // initial measurement
  const initialGrid = getGridStructure();

  // update on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => getGridStructure(), 100);
  });

  grid.addEventListener('click', (e) => {
    // find the nearest ancestor that is the button (works when clicking the img inside)
    const clickedButton = e.target.closest('.btn-item');
    if (!clickedButton || !grid.contains(clickedButton)) return;

    const detailPanelElement = document.querySelector('.detail-panel');

    if (detailPanelElement) {
      console.log('Detail panel already exists.');
      currentButton = detailPanelElement.getElementsByTagName('button')[0];
      console.log('Current Button ID: ', currentButton.dataset.id);
    } else {
      console.log('No existing detail panel.');
    }

    // find the row the clicked button is on.
    // console.log('Grid Structure: ', getGridStructure());
    console.log('Clicked Button ID: ', clickedButton.dataset.id);
    // console.log('Clicked Button Row Index: ', getRowIndex(clickedButton));
    // console.log('Last Item in Row: ', getlastItemInRow(getRowIndex(clickedButton)));

    // Close existing detail panel if it exists
    if (currentDetailPanel) {
      currentDetailPanel.remove();
    }


    // Create new details panel (two columns)
    const detailPanel = document.createElement('div');
    detailPanel.className = 'detail-panel';


    // Left column: contains a doubled-size clone of the clicked button, right-aligned
    const leftCol = document.createElement('div');
    leftCol.className = 'detail-left';

    // Right column: simple text (dataset.name), left-aligned, with a vertical separator
    const rightCol = document.createElement('div');
    rightCol.className = 'detail-right';

    const infoCol = document.createElement('div');
    infoCol.className = 'detail-info';
    
    const controlsCol = document.createElement('div');
    controlsCol.className = 'detail-controls';

    const bigButton = clickedButton.cloneNode(true);
    bigButton.classList.add('big-button');

    leftCol.appendChild(bigButton);

    // Right column content: just the dataset.name text, no extra formatting
    const linkElement = clickedButton.dataset.link 
      ? document.createElement('a') 
      : document.createElement('div');
    linkElement.className = 'detail-link';
    if (clickedButton.dataset.link) {
      linkElement.href = clickedButton.dataset.link;
      linkElement.target = '_blank';
      linkElement.rel = 'noopener noreferrer';
    }
    linkElement.textContent = clickedButton.dataset.name || '';
    infoCol.appendChild(linkElement);

    const closeRow = document.createElement('div');
    closeRow.className = 'detail-close-row';
    
    const prevNextRow = document.createElement('div');
    prevNextRow.className = 'detail-prev-next-row';

    const closeButton = document.createElement('button');
    closeButton.className = 'detail-close';
    closeButton.setAttribute('aria-label', 'Close details');
    closeButton.innerHTML = '&times;';
    closeRow.appendChild(closeButton);
    closeButton.addEventListener('click', () => {
      if (currentDetailPanel) {
        currentDetailPanel.remove();
        currentDetailPanel = null;
      }
    });
    const prevButton = document.createElement('button');
    prevButton.className = 'detail-prev';
    prevButton.setAttribute('aria-label', 'Previous item');
    prevButton.innerHTML = '&#8592;';
    prevNextRow.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.className = 'detail-next';
    nextButton.setAttribute('aria-label', 'Next item');
    nextButton.innerHTML = '&#8594;';
    prevNextRow.appendChild(nextButton);

    controlsCol.appendChild(closeRow);
    controlsCol.appendChild(prevNextRow);

    // Assemble the detail panel
    rightCol.appendChild(infoCol);
    rightCol.appendChild(controlsCol);
    detailPanel.appendChild(leftCol);
    detailPanel.appendChild(rightCol);

    const lastItemInRow = getlastItemInRow(getRowIndex(clickedButton));
    if (lastItemInRow) {
      lastItemInRow.insertAdjacentElement('afterend', detailPanel);
    } else {
      // fallback: append to grid if we couldn't find the last item
      grid.appendChild(detailPanel);
    }

    setTimeout(() => {
      if (currentDetailPanel) {
        currentDetailPanel.classList.add('open');
      }
    }, 10);
    currentDetailPanel = detailPanel;


    // console.log(getRowIndex(clickedButton));

  });


});

