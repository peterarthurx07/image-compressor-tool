{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww29740\viewh18600\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const fileInput = document.getElementById('fileInput');\
const dropArea = document.getElementById('dropArea');\
const resizeToggle = document.getElementById('resizeToggle');\
const resizeInputs = document.getElementById('resizeInputs');\
const widthInput = document.getElementById('widthInput');\
const heightInput = document.getElementById('heightInput');\
const compressBtn = document.getElementById('compressBtn');\
const progressContainer = document.getElementById('progressContainer');\
const formatSelect = document.getElementById('formatSelect');\
\
resizeToggle.addEventListener('change', () => \{\
  resizeInputs.style.display = resizeToggle.checked ? 'block' : 'none';\
\});\
\
// Drag and drop handlers\
['dragenter','dragover','dragleave','drop'].forEach(event => \{\
  dropArea.addEventListener(event, e => \{\
    e.preventDefault();\
    e.stopPropagation();\
  \});\
\});\
['dragenter','dragover'].forEach(e => \{\
  dropArea.addEventListener(e, () => dropArea.classList.add('dragover'));\
\});\
['dragleave','drop'].forEach(e => \{\
  dropArea.addEventListener(e, () => dropArea.classList.remove('dragover'));\
\});\
dropArea.addEventListener('drop', e => \{\
  fileInput.files = e.dataTransfer.files;\
\});\
\
compressBtn.addEventListener('click', () => \{\
  const files = [...fileInput.files];\
  if (files.length === 0) return alert('No images selected!');\
\
  progressContainer.innerHTML = '';\
  files.forEach(file => compressImage(file));\
\});\
\
function compressImage(file) \{\
  const reader = new FileReader();\
  reader.onload = e => \{\
    const img = new Image();\
    img.onload = () => processImage(img, file.type, file.name);\
    img.src = e.target.result;\
  \};\
  reader.readAsDataURL(file);\
\}\
\
function processImage(img, originalType, originalName) \{\
  const canvas = document.createElement('canvas');\
  const ctx = canvas.getContext('2d');\
\
  let width = img.width;\
  let height = img.height;\
  if (resizeToggle.checked) \{\
    width = parseInt(widthInput.value) || width;\
    height = parseInt(heightInput.value) || height;\
  \}\
\
  canvas.width = width;\
  canvas.height = height;\
  ctx.drawImage(img, 0, 0, width, height);\
\
  const format = formatSelect.value;\
  const ext = format.split('/')[1]; // jpeg, png, webp\
\
  const progressBar = document.createElement('div');\
  progressBar.className = 'progress-bar';\
  progressContainer.appendChild(document.createTextNode(originalName));\
  progressContainer.appendChild(progressBar);\
\
  let quality = 0.9;\
  const targetMaxKB = 90;\
\
  function compressLoop() \{\
    const dataURL = canvas.toDataURL(format, quality);\
    const sizeKB = ((dataURL.length - dataURL.indexOf(',') - 1) * 3 / 4) / 1024;\
\
    if (sizeKB > targetMaxKB && quality > 0.1 && format !== 'image/png') \{\
      quality -= 0.05;\
      progressBar.style.width = `$\{Math.round((1 - quality) * 100)\}%`;\
      progressBar.textContent = `$\{Math.round(sizeKB)\}\uc0\u8239 KB`;\
      setTimeout(compressLoop, 50);\
    \} else \{\
      progressBar.style.width = '100%';\
      progressBar.textContent = `$\{Math.round(sizeKB)\}\uc0\u8239 KB`;\
      downloadImage(dataURL, originalName, ext);\
    \}\
  \}\
\
  compressLoop();\
\}\
\
function downloadImage(dataURL, originalName, ext) \{\
  const baseName = originalName.split('.').slice(0, -1).join('.') || "image";\
  const a = document.createElement('a');\
  a.href = dataURL;\
  a.download = `$\{baseName\}.$\{ext\}`;\
  document.body.appendChild(a);\
  a.click();\
  document.body.removeChild(a);\
\}\
}