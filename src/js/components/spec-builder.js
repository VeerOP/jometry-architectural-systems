/* ==========================================================================
   JOMETRY CSI MASTERFORMAT 3-PART SPECIFICATION BUILDER
   Sections 05, 06, 08, 10 Architectural Tender Configurator
   ========================================================================== */

import { openEnquiryModal } from './modal.js';

export function initSpecBuilder() {
  const familySelect = document.getElementById('spec-family-select');
  const depthSelect = document.getElementById('spec-depth-select');
  const finishSelect = document.getElementById('spec-finish-select');
  const optionCheckboxes = document.querySelectorAll('.spec-option-cb');
  const codeBox = document.getElementById('spec-generated-code');
  const csiBox = document.getElementById('spec-generated-csi');
  const copyBtn = document.getElementById('spec-copy-btn');
  const sampleBtn = document.getElementById('spec-request-sample-btn');
  const downloadBtn = document.getElementById('spec-download-btn');

  if (!familySelect || !csiBox) return;

  function generateSpec() {
    const family = familySelect.value;
    const depth = depthSelect.value;
    const finish = finishSelect.value;

    const selectedOptions = [];
    optionCheckboxes.forEach(cb => {
      if (cb.checked) selectedOptions.push(cb.value);
    });

    // Generate JOMETRY model code
    let prefix = 'DW-SERV-JOM';
    let divCode = 'SECTION 10 22 19 (Demountable Partitions)';
    let familyTitle = 'JOMETRY Service Wall Demountable MEP Platform';

    if (family === 'acoustic') {
      prefix = 'DW-ACST-JOM';
      divCode = 'SECTION 09 84 13 (Sound-Absorbing Wall Units)';
      familyTitle = 'JOMETRY Acoustic Control Helmholtz Resonant Wall System';
    } else if (family === 'living') {
      prefix = 'DW-LIVE-JOM';
      divCode = 'SECTION 12 93 00 (Interior Botanical & Biofiltration Cladding)';
      familyTitle = 'JOMETRY Living Bio-Wall Active Botanical System';
    } else if (family === 'facade-light') {
      prefix = 'DW-LITE-JOM';
      divCode = 'SECTION 09 54 00 / 26 51 00 (Illuminated Architectural Cladding)';
      familyTitle = 'JOMETRY Facade & Light Concealed LED Backlit System';
    }

    const optSuffix = selectedOptions.length > 0 ? `-${selectedOptions.join('-')}` : '';
    const finishCode = finish.toUpperCase().replace('-', '_');
    const modelCode = `${prefix}-500-ST${depth}-${finishCode}${optSuffix}`;

    if (codeBox) codeBox.textContent = modelCode;

    // CSI 3-Part Clause
    const csiText = `${divCode}
PART 1 — GENERAL
1.01 SUMMARY:
  A. Provide precision modular demountable wall cladding platform engineered with toolless access for the life of the building.
  B. Related Sections: Div 09 22 00 (Supports for Plaster/Gypsum), Div 10 22 19 (Demountable Partitions), Div 27 11 00 (Communications Equipment Rooms).

PART 2 — PRODUCTS
2.01 MANUFACTURER:
  A. Basis of Design: MACR MAYR India Pvt Ltd (Mumbai, India) · Email: project@jometry.in · Phone: +91 (022) 6700-DWALL.
  B. Platform Name: JOMETRY Modular Wall Architectural Systems.
  C. Model Designation: ${modelCode}.

2.02 MECHANICAL ATTRIBUTES & TOLERANCES:
  A. Module Dimensions: 500 mm × 500 mm precision cassette (30 mm profile).
  B. Mounting Platform: Patented WallClick Node with 180 N calibrated pull-off force.
  C. Material: Architectural Die-Cast Zinc & Stainless Steel SS304 corrosion-proof alloy.
  D. Alignment Tolerance: ±0.25 mm True Position locked by conical indexing pins.
  E. Vibration & Flanking: EPDM elastomeric isolation rings on all mounting nodes.
  F. Standoff Cavity Depth: ${depth} mm continuous ventilated service raceway.
  G. Demountability: 100% toolless, independent panel removal rated for >500 cycles without mechanical play.

2.03 FINISH & PERFORMANCE:
  A. Face Typology / Finish: ${finish.replace('-', ' ').toUpperCase()}.
  B. Fire Performance: Class 1 / Class A flame spread rated to ASTM E84 / EN 13501 (BS 476 Part 6 & 7 compliant).
  C. Multi-Tier Raceway Provisions: ${selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Standard segregated cable rails'}.
  D. BIM / CAD: BIM Revit 2026 Ready family files provided.

PART 3 — EXECUTION
3.01 INSTALLATION:
  A. Anchor cold-rolled aluminum sub-frames to host substrate with neoprene isolation washers.
  B. Snap-fit cassettes into position without face fasteners, wet plaster, or repainting.`;

    csiBox.textContent = csiText;
    return { modelCode, csiText, familyTitle };
  }

  // Update on change
  familySelect.addEventListener('change', generateSpec);
  depthSelect.addEventListener('change', generateSpec);
  finishSelect.addEventListener('change', generateSpec);
  optionCheckboxes.forEach(cb => cb.addEventListener('change', generateSpec));

  // Copy to clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const spec = generateSpec();
      navigator.clipboard.writeText(spec.csiText).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ CSI Specification Copied!';
        copyBtn.style.background = 'var(--color-service-blue)';
        copyBtn.style.color = '#fff';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2200);
      });
    });
  }

  // Download Spec Sheet
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const spec = generateSpec();
      const blob = new Blob([spec.csiText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${spec.modelCode}-Specification.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Request Sample Box modal
  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      const spec = generateSpec();
      openEnquiryModal(`Architectural Package Request: ${spec.modelCode} (${spec.familyTitle})`);
    });
  }

  // Initial generation
  generateSpec();
}
