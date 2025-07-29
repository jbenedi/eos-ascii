    const csvInput = document.getElementById('csvInput');
    const dropZone = document.getElementById('dropZone');
    const preview = document.getElementById('preview');
    const mapping = document.getElementById('mapping');
    const convertBtn = document.getElementById('convertBtn');

    let parsedCSV = [];

    const fields = [
      'Cue Numbers',
      'Cue Durations',
      'Cue Labels',
      'Cue Notes',
      'Cue Scenes',
      'Blocks',
      'Auto Follows'
    ];

    csvInput.addEventListener('change', e => {
      const file = e.target.files[0];
      handleFile(file);
    });

    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.classList.add('hover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('hover');
    });

    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('hover');
      const file = e.dataTransfer.files[0];
      handleFile(file);
    });

    function handleFile(file) {
      if (!file.name.endsWith('.csv')) {
        alert('Please upload a CSV file.');
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          parsedCSV = results.data;
          showPreview(parsedCSV);
          showMappingDropdowns(parsedCSV);
        }
      });
    }

    function showPreview(data) {
      if (data.length === 0) return;
      const headers = Object.keys(data[0]);
      let html = '<table><thead><tr>' + headers.map((h, i) => `<th>${i + 1}</th>`).join('') + '</tr></thead><tbody>';
      data.slice(0, 5).forEach(row => {
        html += '<tr>' + headers.map(h => `<td>${row[h]}</td>`).join('') + '</tr>';
      });
      html += '</tbody></table>';
      preview.innerHTML = html;
    }

    function showMappingDropdowns(data) {
      const headers = Object.keys(data[0]);
      let html = '';
      fields.forEach(field => {
        html += `<label style="display:block; margin-top:0.25rem; font-weight:bold;">${field}</label>`;
        html += `<select id="field-${field}" data-field="${field}" style="width:100%; max-width:300px;">`;
        html += '<option value="">-- Select Column --</option>';
        headers.forEach((h, i) => {
          html += `<option value="${i}">Column ${i + 1}</option>`;
        });
        html += '</select><br/>';
      });
      mapping.innerHTML = html;
      document.getElementById('mapping-container').style.display = 'block';
      convertBtn.disabled = false;

      convertBtn.onclick = () => {
        const selects = document.querySelectorAll('select[data-field]');
        const columnMap = {};
        selects.forEach(select => {
          const field = select.getAttribute('data-field');
          const columnIndex = parseInt(select.value);
          if (!isNaN(columnIndex)) columnMap[field] = columnIndex;
        });

        const lines = [
          "Manufacturer ETC",
          "Console Eos",
          "",
          "$CueList 1",
          "   Text Imported from USITT ASCII",
          ""
        ];

        parsedCSV.forEach(row => {
  const headers = Object.keys(row);
  const cue = row[headers[columnMap['Cue Numbers']]];
  if (!cue) return;

  lines.push(`Cue ${cue} 1`);

  // Label
  if (columnMap['Cue Labels']) {
    const label = row[headers[columnMap['Cue Labels']]];
    if (label && label.trim()) {
      lines.push(`   Text ${label.trim()}`);
    }
  }

  // Duration
  if (columnMap['Cue Durations']) {
    const dur = row[headers[columnMap['Cue Durations']]];
    if (dur && dur.trim()) {
      lines.push(`   Up ${dur.trim()}`);
      lines.push(`   $$TimeUp ${dur.trim()} 0 0 1`);
      lines.push(`   Down ${dur.trim()}`);
      lines.push(`   $$TimeDown ${dur.trim()} 0 1 1`);
    }
  }

  // Block
  if (columnMap['Blocks']) {
    const block = row[headers[columnMap['Blocks']]];
    if (block && block.trim()) {
      const b = block.trim().toUpperCase();
      if (b === 'B') lines.push(`   $$Block`);
      else if (b === 'I') lines.push(`   $$IntBlock`);
    }
  }

  // Chan placeholder
  lines.push(`   Chan 999 0`);

  // Follow
  if (columnMap['Auto Follows']) {
    const follow = row[headers[columnMap['Auto Follows']]];
    if (follow && follow.trim()) {
      lines.push(`   FollowOn ${follow.trim()}`);
      lines.push(`   $$Follow ${follow.trim()}`);
    }
  }

  // Cue Notes
  if (columnMap['Cue Notes']) {
    const note = row[headers[columnMap['Cue Notes']]];
    if (note && note.trim()) {
      lines.push(`   $$CueNotes ${note.trim()}`);
    }
  }

  // Scene Text
  if (columnMap['Cue Scenes']) {
    const scene = row[headers[columnMap['Cue Scenes']]];
    if (scene && scene.trim()) {
      lines.push(`   $$SceneText ${scene.trim()}`);
    }
  }

  lines.push(''); // blank line between cues
});

lines.push('');
lines.push('EndData');

        const blob = new Blob([lines.join("\n")], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cue_output_${new Date().toISOString().slice(0,10)}.asc`;
        a.click();
        URL.revokeObjectURL(url);
      };
    }
